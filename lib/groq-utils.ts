import Groq from 'groq-sdk';

const TIMEOUT_MS = 90000; // 90 second timeout for long documents

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms)
        )
    ]);
}

export async function callGroq(prompt: string): Promise<string> {
    if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set');
    }

    const client = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });

    const message = await withTimeout(
        client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        }),
        TIMEOUT_MS
    );

    const responseText = message.choices[0]?.message?.content || '';

    if (!responseText) {
        throw new Error('No response from Groq API');
    }

    return responseText;
}
