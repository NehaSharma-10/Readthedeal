import { analyze, type AnalysisMode } from '@/lib/analyzers';
import { callGemini } from '@/lib/gemini-utils';
import { logDocument } from './document-logger';

export async function POST(request: Request) {
    try {
        const { contractText, messageText, mode, text } = await request.json();

        let analysisMode = (mode || (contractText ? 'contract' : 'message')) as AnalysisMode | 'auto';
        const textToAnalyze = text || contractText || messageText;

        if (!textToAnalyze || textToAnalyze.trim().length === 0) {
            return Response.json(
                { error: 'Text is required' },
                { status: 400 }
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

            const validTypes = ['contract', 'message', 'returns', 'prescription', 'meeting', 'government', 'warranty'];
            detectedType = validTypes.includes(detectedType) ? detectedType : 'contract';
        } catch (classifyError) {
            const classifyErrorMsg = classifyError instanceof Error ? classifyError.message : 'Unknown error';
            console.error('Classification error:', classifyErrorMsg);
            detectedType = 'contract';
        }

        analysisMode = detectedType as AnalysisMode;

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

        // Log the document submission (documentType and documentContent only)
        // $createdAt is automatically set by Appwrite
        await logDocument(textToAnalyze, analysisMode);

        return Response.json({
            success: true,
            ...result,
            mode: analysisMode,
            detectedMode: analysisMode
        });

    } catch (error) {
        console.error('❌ Analysis error:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to analyze';
        console.error('ERROR DETAILS:', errorMsg);
        return Response.json(
            { error: 'There is some issue right now. Please try again later.' },
            { status: 500 }
        );
    }
}
