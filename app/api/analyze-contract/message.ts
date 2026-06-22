import { GoogleGenerativeAI } from '@google/generative-ai';

interface LinkAnalysis {
    url: string;
    reputation: 'safe' | 'suspicious' | 'dangerous';
    reason: string;
}

interface MessageAnalysis {
    verdict: 'clean' | 'uncertain' | 'scam_likely';
    redFlags: string[];
    reasoning: string;
}

const MIN_WORDS_FOR_ANALYSIS = 8;
const URGENCY_KEYWORDS = ['verify your account', 'confirm password', 'update payment', 'verify banking', 'unusual activity', 'account suspended', 'click here', 'confirm credentials', 'wire transfer', 'gift card', 'payment failed', 'limited time offer', 'act now', 'claim reward', 'verify identity'];

function extractUrls(text: string): string[] {
    return text.match(/https?:\/\/[^\s]+|www\.[^\s]+/gi) || [];
}

function shouldShortCircuit(text: string, urls: string[]): boolean {
    const wordCount = text.trim().split(/\s+/).length;
    const hasKeyword = URGENCY_KEYWORDS.some(k => text.toLowerCase().includes(k));
    return wordCount < MIN_WORDS_FOR_ANALYSIS && urls.length === 0 && !hasKeyword;
}

async function checkUrlReputation(url: string): Promise<{ reputation: 'safe' | 'suspicious' | 'dangerous'; reason: string }> {
    try {
        const domain = new URL(url).hostname;
        if (domain.includes('bit.ly') || domain.includes('tinyurl') || domain.includes('short.link')) {
            return { reputation: 'suspicious', reason: 'URL shortener (harder to verify destination)' };
        }
        return { reputation: 'safe', reason: 'No known threats detected' };
    } catch (error) {
        return { reputation: 'suspicious', reason: 'Unable to check URL' };
    }
}

export async function analyzeMessageWithGemini(messageText: string): Promise<{
    verdict: 'clean' | 'uncertain' | 'scam_likely';
    redFlags: string[];
    reasoning: string;
    urls: LinkAnalysis[];
    shortCircuited: boolean;
    provider: string;
}> {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error('GOOGLE_API_KEY is not set');
    }

    const urlStrings = extractUrls(messageText);

    // Short-circuit: don't force a verdict on messages with nothing to evaluate
    if (shouldShortCircuit(messageText, urlStrings)) {
        return {
            verdict: 'clean',
            redFlags: [],
            reasoning: 'Too short, and no links or scam-pattern keywords present to meaningfully assess — reads like an ordinary personal message.',
            urls: [],
            shortCircuited: true,
            provider: 'gemini-2.5-flash'
        };
    }

    const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = client.getGenerativeModel({
        model: 'gemini-2.5-flash'
    });

    const prompt = `You are a financial scam and phishing detector. Analyze the message below ONLY for fraud-related indicators. Return ONLY valid JSON with no other text.

THIS TOOL DETECTS: Financial scams, phishing, credential theft, payment fraud, fake authority impersonation.
THIS TOOL DOES NOT ASSESS: Relationship safety, coercion, meeting logistics, personal dynamics.

ONLY flag "scam_likely" or "uncertain" if at least one CONCRETE financial/phishing indicator is present:
- A link or request to click something (especially shortened URLs or suspicious domains)
- A request for money, payment info, financial account details, or gift cards
- A request for passwords, login credentials, SSN, or other authentication tokens
- Urgency or threats TIED TO A FINANCIAL ACCOUNT, PAYMENT, or SECURITY ALERT ("verify your account," "payment failed," "your bank locked your account," "confirm your password")
- Impersonation of a real bank, payment processor, government agency, tech support, or financial institution
- An unrealistically good financial offer (inheritance, prize, guaranteed returns, unclaimed refund)
- Sender claiming to be from a real organization but email/number doesn't match official channels

DO NOT flag based on:
- General urgency about in-person meetings ("let's meet in 20 minutes," "I need to tell you something in person")
- Relationship dynamics, requests for advice, or personal conversations
- Emotional tone or brevity alone
- Secrecy about non-financial matters

If NONE of the financial/phishing indicators are present, respond with "clean" — even if the message has urgency or personal stakes.

Respond with this JSON format only:
{
  "verdict": "clean" | "uncertain" | "scam_likely",
  "redFlags": ["flag1", "flag2"],
  "reasoning": "explanation"
}

Message:
"""
${messageText}
"""`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
        throw new Error('No response from Gemini API');
    }

    let analysis: MessageAnalysis;
    try {
        // Extract JSON from response (handles cases where model adds extra text)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('Failed to find JSON in response:', responseText);
            throw new Error('Failed to parse message analysis response');
        }
        analysis = JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Failed to parse message analysis response:', responseText);
        throw new Error('Failed to parse message analysis response');
    }

    // Check URLs if present
    const linkAnalyses: LinkAnalysis[] = [];
    for (const url of urlStrings) {
        const reputation = await checkUrlReputation(url);
        linkAnalyses.push({
            url,
            reputation: reputation.reputation as 'safe' | 'suspicious' | 'dangerous',
            reason: reputation.reason
        });
    }

    return {
        ...analysis,
        urls: linkAnalyses,
        shortCircuited: false,
        provider: 'gemini-2.5-flash'
    };
}
