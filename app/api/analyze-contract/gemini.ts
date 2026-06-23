import { GoogleGenerativeAI } from '@google/generative-ai';

interface ContractAnalysis {
    summary: string;
    obligations: string[];
    deadlines: string[];
    costs: string[];
    risks: string[];
    keyPhrases: string[];
}

export async function analyzeContractWithGemini(contractText: string): Promise<{
    summary?: string;
    obligations?: string[];
    deadlines?: string[];
    costs?: string[];
    risks?: string[];
    keyPhrases?: string[];
    contractLength: number;
    tokensUsed: number;
    provider: string;
}> {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error('GOOGLE_API_KEY is not set');
    }

    const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a contract reviewer. Analyze this contract BRIEFLY and return ONLY a JSON response with these fields. Be concise - extract only the most important points:

{
  "summary": "1-2 sentence summary of what this contract is about",
  "obligations": ["Key obligation 1", "Key obligation 2"],
  "deadlines": ["Important deadline if any"],
  "costs": ["Main cost or fee"],
  "risks": [
    "Risk 1: Specific problematic clause",
    "Risk 2: Unfavorable term",
    "Risk 3: Hidden trap or gotcha"
  ],
  "keyPhrases": ["Term 1", "Term 2", "Important clause name"]
}

IMPORTANT: 
- Do NOT copy/paste large blocks from the contract
- Extract ONLY 2-3 most critical items per section
- For risks, identify the TOP gotchas - cancellation traps, auto-renewal, liability shifts, hidden fees
- Be specific about WHAT makes each risk problematic
- Return ONLY valid JSON, no other text

Contract to analyze:
${contractText}`;

    const response = await model.generateContent(prompt);

    if (!response.response.text()) {
        throw new Error('No response from Gemini API');
    }

    const responseText = response.response.text();

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        console.error('Failed to find JSON in response:', responseText);
        throw new Error('Failed to parse contract analysis response');
    }

    const analysis: ContractAnalysis = JSON.parse(jsonMatch[0]);

    // Estimate tokens used
    const estimatedInputTokens = Math.ceil(contractText.length / 4);
    const estimatedOutputTokens = Math.ceil(responseText.length / 4);

    return {
        summary: analysis.summary,
        obligations: analysis.obligations,
        deadlines: analysis.deadlines,
        costs: analysis.costs,
        risks: analysis.risks,
        keyPhrases: analysis.keyPhrases,
        contractLength: contractText.length,
        tokensUsed: estimatedInputTokens + estimatedOutputTokens,
        provider: 'gemini-2.0-flash'
    };
}
