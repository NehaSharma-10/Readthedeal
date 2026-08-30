import { GoogleGenerativeAI } from '@google/generative-ai';
import { callGroq } from './groq-utils';

const MODEL = 'gemini-3.6-flash';
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
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error('GOOGLE_API_KEY is not set');
    }

    let lastGeminiError: string | null = null;
    let lastGroqError: string | null = null;

    // Try Gemini 2.0 first (primary provider)
    try {
        const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
        const model = client.getGenerativeModel({ model: MODEL });

        const response = await withTimeout(model.generateContent(prompt), TIMEOUT_MS);
        const responseText = response.response.text();

        if (!responseText) {
            throw new Error('No response from Gemini API');
        }

        return responseText;
    } catch (geminiError) {
        lastGeminiError = geminiError instanceof Error ? geminiError.message : 'Unknown Gemini error';
        console.warn(`⚠️ [GEMINI] Request failed: ${lastGeminiError}`);
    }

    // Try Groq as fallback (only if Gemini fails and Groq key is available)
    try {
        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY is not set (fallback not available)');
        }

        const result = await callGroq(prompt);
        console.info(`✅ [GROQ] Fallback succeeded`);
        return result;
    } catch (groqError) {
        lastGroqError = groqError instanceof Error ? groqError.message : 'Unknown Groq error';
        console.error(`❌ [GROQ] Fallback also failed: ${lastGroqError}`);

        // Both providers failed
        throw new Error(
            `All AI providers unavailable: Gemini: ${lastGeminiError}, Groq: ${lastGroqError}`
        );
    }
}

export function parseJsonFromResponse(responseText: string): any {
    try {
        // Try direct parse first
        return JSON.parse(responseText);
    } catch {
        // Extract JSON from response if it's wrapped in other text
        // Try to find the largest JSON object/array
        const jsonMatches = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/g);
        if (!jsonMatches || jsonMatches.length === 0) {
            throw new Error('Failed to extract JSON from response: no JSON found');
        }
        
        // Use the longest match (likely the main content)
        const largestMatch = jsonMatches.reduce((a, b) => a.length > b.length ? a : b);
        
        try {
            return JSON.parse(largestMatch);
        } catch (parseError) {
            throw new Error(`Failed to parse extracted JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
    }
}

export function estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
}
