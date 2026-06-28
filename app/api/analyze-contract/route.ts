import { analyze, type AnalysisMode } from '@/lib/analyzers';
import { callGemini } from '@/lib/gemini-utils';
import { getCachedAnalysis, cacheAnalysis } from './cache';
import { getUserIdentifier, checkQuota, incrementQuota } from './rate-limiter';

/**
 * RATE LIMITING NOTE:
 * This implementation uses in-memory server storage + browser localStorage.
 * For production with persistent storage across server restarts:
 * - Use Redis (Upstash Redis for serverless)
 * - Use Supabase PostgREST
 * - Use MongoDB Atlas
 * 
 * The browser localStorage persists quota reset time so users can't bypass
 * the 4 analyses/day limit by simply refreshing the page.
 */

export async function POST(request: Request) {
    try {
        const { contractText, messageText, mode, text } = await request.json();

        // Support both old and new API formats
        let analysisMode = (mode || (contractText ? 'contract' : 'message')) as AnalysisMode | 'auto';
        const textToAnalyze = text || contractText || messageText;

        if (!textToAnalyze || textToAnalyze.trim().length === 0) {
            return Response.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        // Get user identifier and check quota early
        const userId = getUserIdentifier(request);
        const quotaCheck = checkQuota(userId);

        if (!quotaCheck.allowed) {
            return Response.json(
                {
                    error: 'Daily limit reached',
                    message: `You've used all ${quotaCheck.total} free analyses for today. Quota resets in ${quotaCheck.resetsIn} minutes.`,
                    quotaInfo: {
                        limit: quotaCheck.total,
                        remaining: 0,
                        resetsInMinutes: quotaCheck.resetsIn,
                        needsUpgrade: true
                    }
                },
                { status: 429 }
            );
        }

        // Classify document to detect actual type
        let detectedType: string = analysisMode as string;
        try {
            const classifyPrompt = `You are a universal document classifier. Read the text and identify what type of document it is. Be precise.

If the document is a SHORT message (text, email, SMS, WhatsApp, chat, DM, social media message):
- Return "message" if it's a single message/communication
- Return "message" for potential scams, phishing, or suspicious messages

If the document contains MEDICAL/HEALTHCARE information (prescriptions, medical reports, lab results, discharge summaries, vaccination records, health records):
- Return "prescription"

If the document is GOVERNMENT-RELATED (government forms, tax forms, IRS forms, passport applications, visa documents, driving licenses, DMV forms, property registration, permits, official government letters):
- Return "government"

If the document is about MEETING/DISCUSSION (meeting notes, transcripts, conference minutes, discussion records, team updates, event notes, business notes):
- Return "meeting"

If the document is about WARRANTIES or RETURNS (warranty cards, return policies, refund policies, exchange policies, product guarantees, service guarantees, coverage documents):
- Return "returns"

If the document is ANY OTHER TYPE (contracts, agreements, policies, terms & conditions, privacy policies, NDAs, employment agreements, lease agreements, service agreements, subscription agreements, user agreements, loan agreements, credit card agreements, insurance policies, purchase agreements, purchase orders, quotations, business proposals, property deeds, rent receipts, bank statements, credit card statements, investment reports, salary slips, financial reports, invoices, bills, receipts, travel insurance, hotel bookings, flight itineraries, visa letters, home inspection reports, real estate documents, and any other legal/formal documents):
- Return "contract"

Return ONLY one exact value: contract | message | returns | prescription | meeting | government | warranty

Document text:
<<<START>>>
${textToAnalyze}
<<<END>>>`;

            const classificationResult = await callGemini(classifyPrompt);
            detectedType = classificationResult.trim().toLowerCase();

            // Validate detected type
            const validTypes = ['contract', 'message', 'returns', 'prescription', 'meeting', 'government', 'warranty'];
            detectedType = validTypes.includes(detectedType) ? detectedType : 'contract';
        } catch (classifyError) {
            const classifyErrorMsg = classifyError instanceof Error ? classifyError.message : 'Unknown error';
            console.error('Classification error:', classifyErrorMsg);

            // If classification fails due to quota, throw immediately (will be caught by outer catch)
            if (classifyErrorMsg.toLowerCase().includes('quota') ||
                classifyErrorMsg.toLowerCase().includes('429') ||
                classifyErrorMsg.toLowerCase().includes('all ai providers unavailable')) {
                throw new Error(`Classification failed: ${classifyErrorMsg}`);
            }

            // Otherwise, default to contract and continue
            detectedType = 'contract';
        }

        // Always use detected type for analysis (no warnings, just auto-detect)
        analysisMode = detectedType as AnalysisMode;

        // Check cache first
        const cachedResult = getCachedAnalysis(textToAnalyze, analysisMode);
        if (cachedResult) {
            incrementQuota(userId);
            return Response.json({
                success: true,
                ...cachedResult,
                cached: true,
                mode: analysisMode,
                detectedMode: analysisMode,
                quotaInfo: {
                    limit: quotaCheck.total,
                    remaining: quotaCheck.remaining - 1,
                    resetsInMinutes: quotaCheck.resetsIn
                }
            });
        }

        // Analyze based on detected mode
        let result;
        try {
            result = await analyze(textToAnalyze, analysisMode);
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            if (errorMsg.includes('GOOGLE_API_KEY')) {
                return Response.json(
                    {
                        error: 'Google API key not configured',
                        setupGuide: '/AI_SETUP.md'
                    },
                    { status: 500 }
                );
            }
            throw error;
        }

        // Cache the result
        cacheAnalysis(textToAnalyze, result, analysisMode);

        // Increment quota usage
        incrementQuota(userId);

        return Response.json({
            success: true,
            ...result,
            cached: false,
            mode: analysisMode,
            detectedMode: analysisMode,
            quotaInfo: {
                limit: quotaCheck.total,
                remaining: quotaCheck.remaining - 1,
                resetsInMinutes: quotaCheck.resetsIn
            }
        });

    } catch (error) {
        console.error('❌ Analysis error:', error);

        const errorMsg = error instanceof Error ? error.message : 'Failed to analyze';

        // Check if it's a quota exhaustion error
        const isQuotaError = errorMsg.toLowerCase().includes('quota') ||
            errorMsg.toLowerCase().includes('429') ||
            errorMsg.toLowerCase().includes('resource_exhausted') ||
            errorMsg.toLowerCase().includes('rate limit') ||
            errorMsg.toLowerCase().includes('all ai providers unavailable');

        if (isQuotaError) {
            console.warn('⚠️ QUOTA EXHAUSTED:', errorMsg);
            return Response.json(
                {
                    error: 'There is some issue right now. Please try again later.',
                    type: 'quota_exhausted'
                },
                { status: 503 }
            );
        }

        // For other errors, return generic message but log details
        console.error('ERROR DETAILS:', errorMsg);
        return Response.json(
            { error: 'There is some issue right now. Please try again later.' },
            { status: 500 }
        );
    }
}
