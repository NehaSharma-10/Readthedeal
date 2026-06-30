import { GoogleGenerativeAI } from '@google/generative-ai';
import { callGroq } from './groq-utils';

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

    let lastGroqError: string | null = null;
    let lastGeminiError: string | null = null;

    // Try Groq first
    try {
        const result = await callGroq(prompt);
        return result;
    } catch (groqError) {
        lastGroqError = groqError instanceof Error ? groqError.message : 'Unknown Groq error';
        console.warn(`⚠️ [GROQ] Request failed: ${lastGroqError}`);
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

        return responseText;
    } catch (geminiError) {
        lastGeminiError = geminiError instanceof Error ? geminiError.message : 'Unknown Gemini error';
        console.error(`❌ [GEMINI] Request failed: ${lastGeminiError}`);

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
