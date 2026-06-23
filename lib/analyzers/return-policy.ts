import { callGemini, parseJsonFromResponse, estimateTokens } from '../gemini-utils';

export interface ReturnPolicyResult {
    summary: string;
    returnWindow: string;
    conditions: string[];
    process: string[];
    costs: string[];
    exclusions: string[];
    risks: string[];
    verdict: 'buyer_friendly' | 'neutral' | 'buyer_unfriendly';
    provider: string;
}

export async function analyzeReturnPolicy(policyText: string): Promise<ReturnPolicyResult> {
    const prompt = `You are a return policy analyzer. Analyze this return/refund policy and return ONLY valid JSON with these fields:

{
  "summary": "Brief summary of the policy",
  "returnWindow": "How many days/months to return",
  "conditions": ["Condition 1", "Condition 2"],
  "process": ["Step 1", "Step 2"],
  "costs": ["Cost 1", "Cost 2 or empty array"],
  "exclusions": ["What's excluded"],
  "risks": ["Problematic terms", "Unfavorable clauses"],
  "verdict": "buyer_friendly" | "neutral" | "buyer_unfriendly"
}

Return ONLY valid JSON, no other text.

Policy to analyze:
${policyText}`;

    const responseText = await callGemini(prompt);
    const analysis = parseJsonFromResponse(responseText);

    return {
        summary: analysis.summary || '',
        returnWindow: analysis.returnWindow || '',
        conditions: analysis.conditions || [],
        process: analysis.process || [],
        costs: analysis.costs || [],
        exclusions: analysis.exclusions || [],
        risks: analysis.risks || [],
        verdict: analysis.verdict || 'neutral',
        provider: 'gemini-2.5-flash'
    };
}
