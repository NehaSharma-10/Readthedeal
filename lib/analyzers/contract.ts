import { callGemini, parseJsonFromResponse, estimateTokens } from '../gemini-utils';

export interface ContractResult {
  summary: string;
  obligations: string[];
  deadlines: string[];
  costs: string[];
  risks: string[];
  keyPhrases: string[];
  contractLength: number;
  tokensUsed: number;
  provider: string;
}

export async function analyzeContract(contractText: string): Promise<ContractResult> {
  const prompt = `You are a contract reviewer. Analyze this contract VERY BRIEFLY and return ONLY a JSON response. Be EXTREMELY CONCISE - 1-2 short sentences per field:

{
  "summary": "1 sentence what this is",
  "obligations": ["Obligation 1", "Obligation 2"],
  "deadlines": ["Deadline if any"],
  "costs": ["Cost 1"],
  "risks": [
    "Risk 1: Short specific problem",
    "Risk 2: Another problem"
  ],
  "keyPhrases": ["Term 1", "Term 2"]
}

CRITICAL RULES:
- MAXIMUM 1-2 items per field (not 3+)
- Keep each risk to 1 short sentence (10-15 words max)
- Do NOT expand or over-explain
- Extract ONLY the absolute most critical gotchas
- Return ONLY valid JSON, no other text

Contract to analyze:
${contractText}`;

  const responseText = await callGemini(prompt);
  const analysis = parseJsonFromResponse(responseText);

  return {
    summary: analysis.summary || '',
    obligations: analysis.obligations || [],
    deadlines: analysis.deadlines || [],
    costs: analysis.costs || [],
    risks: analysis.risks || [],
    keyPhrases: analysis.keyPhrases || [],
    contractLength: contractText.length,
    tokensUsed: estimateTokens(contractText) + estimateTokens(responseText),
    provider: 'gemini-2.5-flash'
  };
}
