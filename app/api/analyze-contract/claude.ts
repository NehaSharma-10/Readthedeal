import Anthropic from '@anthropic-ai/sdk';

interface ContractAnalysis {
    plainEnglish: string;
    obligations: string[];
    deadlines: string[];
    costs: string[];
    cancellation: string;
    riskFlags: Array<{ phrase: string; risk: string }>;
    keyPhrases: string[];
}

export async function analyzeContractWithClaude(contractText: string): Promise<{
    analysis: ContractAnalysis;
    contractLength: number;
    tokensUsed: number;
    provider: string;
}> {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is not set');
    }

    const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const systemPrompt = `You are an expert contract analyzer. Your job is to read contracts and provide clear, plain-English summaries that highlight:

1. Key Obligations - What does each party have to do?
2. Important Deadlines - When do things need to happen?
3. Hidden Fees/Costs - What will they actually pay?
4. Cancellation Terms - How and when can this be terminated?
5. Risk Flags - What clauses are unusually unfavorable?
6. Key Phrases - Highlight the most important parts

Format your response as JSON with these exact fields:
{
  "plainEnglish": "A 2-3 sentence plain English summary",
  "obligations": ["obligation 1", "obligation 2"],
  "deadlines": ["deadline 1", "deadline 2"],
  "costs": ["cost 1", "cost 2"],
  "cancellation": "How to cancel",
  "riskFlags": [{ "phrase": "exact phrase from contract", "risk": "why this is risky" }],
  "keyPhrases": ["phrase 1", "phrase 2"]
}`;

    const message = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
            {
                role: 'user',
                content: `Please analyze this contract and provide a breakdown:\n\n${contractText}`
            }
        ],
        system: systemPrompt,
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('Failed to parse contract analysis response');
    }

    const analysis: ContractAnalysis = JSON.parse(jsonMatch[0]);

    return {
        analysis,
        contractLength: contractText.length,
        tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
        provider: 'claude-3.5-sonnet'
    };
}
