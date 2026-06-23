import { callGemini, parseJsonFromResponse, estimateTokens } from '../gemini-utils';

export interface WarrantyResult {
    summary: string;
    coveragePeriod: string;
    covered: string[];
    notCovered: string[];
    claimProcess: string[];
    documentsNeeded: string[];
    contactInfo: string;
    deadlines: string[];
    risks: string[];
    verdict: 'strong' | 'standard' | 'weak';
    provider: string;
}

export async function analyzeWarranty(warrantyText: string): Promise<WarrantyResult> {
    const prompt = `You are a warranty analyzer. Analyze this warranty document and return ONLY valid JSON:

{
  "summary": "Brief summary of the warranty",
  "coveragePeriod": "Length of coverage",
  "covered": ["What's covered 1", "What's covered 2"],
  "notCovered": ["What's NOT covered - gotcha 1", "What's NOT covered - gotcha 2"],
  "claimProcess": ["Step 1", "Step 2", "Step 3"],
  "documentsNeeded": ["Document 1", "Document 2"],
  "contactInfo": "How to contact for claims or 'Not specified'",
  "deadlines": ["Deadline 1", "Deadline 2 or empty array"],
  "risks": ["Risk/gotcha 1", "Risk/gotcha 2"],
  "verdict": "strong" | "standard" | "weak"
}

IMPORTANT:
- claimProcess must be numbered steps
- contactInfo must NEVER be blank - use 'Not specified' if not found
- notCovered and risks are the most important - highlight gotchas
- Return ONLY valid JSON, no other text

Warranty to analyze:
${warrantyText}`;

    const responseText = await callGemini(prompt);
    const analysis = parseJsonFromResponse(responseText);

    return {
        summary: analysis.summary || '',
        coveragePeriod: analysis.coveragePeriod || '',
        covered: analysis.covered || [],
        notCovered: analysis.notCovered || [],
        claimProcess: analysis.claimProcess || [],
        documentsNeeded: analysis.documentsNeeded || [],
        contactInfo: analysis.contactInfo || 'Not specified',
        deadlines: analysis.deadlines || [],
        risks: analysis.risks || [],
        verdict: analysis.verdict || 'standard',
        provider: 'gemini-2.5-flash'
    };
}
