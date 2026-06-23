import { GoogleGenerativeAI } from '@google/generative-ai';
import { callGroq } from './groq-utils';
import { isQuotaExhausted, recordQuotaError, recordQuotaSuccess, getPrimaryProvider } from './api-quota-monitor';

const MODEL = 'gemini-2.0-flash';
const TIMEOUT_MS = 90000; // 90 second timeout for long documents

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms)
        )
    ]);
}

export async function callGemini(prompt: string): Promise<string> {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set');
    }

    const primaryProvider = getPrimaryProvider();
    let lastGroqError: string | null = null;
    let lastGeminiError: string | null = null;

    // Try primary provider first
    try {
        if (primaryProvider === 'groq') {
            const result = await callGroq(prompt);
            recordQuotaSuccess('groq');
            return result;
        }
    } catch (groqError) {
        lastGroqError = groqError instanceof Error ? groqError.message : 'Unknown Groq error';

        // Check if it's a quota exhaustion error
        if (isQuotaExhausted(lastGroqError)) {
            recordQuotaError('groq', lastGroqError);
            console.warn('🔄 [QUOTA] Groq quota exhausted. Switching to Gemini 2.0...');
        } else {
            console.warn(`⚠️ [GROQ] Request failed: ${lastGroqError}`);
        }
    }

    // Try Gemini 2.0 as fallback
    try {
        if (!process.env.GOOGLE_API_KEY) {
            throw new Error('GOOGLE_API_KEY is not set (fallback)');
        }

        const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = client.getGenerativeModel({ model: MODEL });

        const response = await withTimeout(model.generateContent(prompt), TIMEOUT_MS);
        const responseText = response.response.text();

        if (!responseText) {
            throw new Error('No response from Gemini API');
        }

        recordQuotaSuccess('gemini');
        return responseText;
    } catch (geminiError) {
        lastGeminiError = geminiError instanceof Error ? geminiError.message : 'Unknown Gemini error';

        if (isQuotaExhausted(lastGeminiError)) {
            recordQuotaError('gemini', lastGeminiError);
            console.error('❌ [QUOTA] Both Groq and Gemini quotas exhausted!');
        } else {
            console.error(`❌ [GEMINI] Request failed: ${lastGeminiError}`);
        }

        // Both providers failed
        throw new Error(
            `All AI providers unavailable: Groq: ${lastGroqError || 'not attempted'}, Gemini: ${lastGeminiError}`
        );
    }
}

export function parseJsonFromResponse(responseText: string): any {
    try {
        // Try direct parse first
        return JSON.parse(responseText);
    } catch {
        // Extract JSON from response if it's wrapped in other text
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to extract JSON from response');
        }
        return JSON.parse(jsonMatch[0]);
    }
}

export function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}
