import { callGemini, parseJsonFromResponse, estimateTokens } from '../gemini-utils';

export interface ReturnPolicyResult {
    summary: string;
    plainEnglish: string;
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
    const prompt = `You are a warranty, return, refund, and consumer protection policy analyzer. Analyze this policy and extract what matters to the consumer. Return ONLY valid JSON:

{
  "summary": "1 sentence: what this warranty/return/refund policy covers",
  "plainEnglish": "In simple terms, explain the return policy in a way anyone can understand. Include: how many days you have, what condition items must be in, who pays for returns, and any fees. 2-3 sentences max.",
  "returnWindow": "How many days to return or request refund",
  "conditions": ["Condition 1: what must be true", "Condition 2", "Condition 3 if critical"],
  "process": ["Step 1: how to initiate return", "Step 2: next step", "Step 3 if needed"],
  "costs": ["Cost 1", "Who pays shipping if applicable", "Restocking fee if any"],
  "exclusions": ["What's NOT covered 1", "Exclusion 2", "Exception 3 if important"],
  "risks": ["Gotcha 1: unfavorable clause", "Gotcha 2: hidden limitation", "Risk 3 if significant"],
  "verdict": "buyer_friendly | neutral | buyer_unfriendly"
}

CRITICAL RULES:
- Extract 2-3 items for conditions, process, costs, exclusions, and risks
- returnWindow: must be SPECIFIC (e.g., "30 days" not "varies")
- conditions: what the customer must do to qualify (original condition, tags attached, etc.)
- process: actionable steps to return/refund
- exclusions: CLEARLY state what's NOT covered and exceptions
- risks: highlight tricky language like "all sales final," restocking fees, condition requirements, difficult processes
- verdict: judge from consumer perspective
- Flag automatic renewals, hidden fees, restocking fees, tight timelines, unusual conditions
- Include cost details - who pays for return shipping, any restocking fees, etc.
- Return ONLY valid JSON, no other text

Policy to analyze:
${policyText}`;

    const responseText = await callGemini(prompt);
    const analysis = parseJsonFromResponse(responseText);

    return {
        summary: analysis.summary || '',
        plainEnglish: analysis.plainEnglish || '',
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
