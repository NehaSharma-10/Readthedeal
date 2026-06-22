import { analyzeContractWithGemini } from './gemini';
import { analyzeMessageWithGemini } from './message';
import { getCachedAnalysis, cacheAnalysis } from './cache';
import { getUserIdentifier, checkQuota, incrementQuota } from './rate-limiter';

export async function POST(request: Request) {
    try {
        const { contractText, messageText, mode } = await request.json();

        // Determine mode and text
        const analysisMode = mode || (contractText ? 'contract' : 'message');
        const textToAnalyze = contractText || messageText;

        if (!textToAnalyze || textToAnalyze.trim().length === 0) {
            return Response.json(
                { error: 'Text is required' },
                { status: 400 }
            );
        }

        // Get user identifier and check quota
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

        // Check cache first
        const cachedResult = getCachedAnalysis(textToAnalyze);
        if (cachedResult) {
            incrementQuota(userId);
            return Response.json({
                success: true,
                ...cachedResult,
                cached: true,
                mode: analysisMode,
                quotaInfo: {
                    limit: quotaCheck.total,
                    remaining: quotaCheck.remaining - 1,
                    resetsInMinutes: quotaCheck.resetsIn
                }
            });
        }

        // Analyze based on mode
        let result;
        try {
            if (analysisMode === 'message') {
                result = await analyzeMessageWithGemini(textToAnalyze);
            } else {
                result = await analyzeContractWithGemini(textToAnalyze);
            }
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
        cacheAnalysis(textToAnalyze, result);

        // Increment quota usage
        incrementQuota(userId);

        return Response.json({
            success: true,
            ...result,
            cached: false,
            mode: analysisMode,
            quotaInfo: {
                limit: quotaCheck.total,
                remaining: quotaCheck.remaining - 1,
                resetsInMinutes: quotaCheck.resetsIn
            }
        });

    } catch (error) {
        console.error('Analysis error:', error);

        const errorMsg = error instanceof Error ? error.message : 'Failed to analyze';
        return Response.json(
            { error: errorMsg },
            { status: 500 }
        );
    }
}
