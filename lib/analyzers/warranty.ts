import { callGemini, parseJsonFromResponse, estimateTokens } from '../gemini-utils';

export interface WarrantyResult {
    summary: string;
    plainEnglish: string;
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
    const prompt = `You are a warranty, guarantee, and coverage document analyzer. Analyze this warranty and tell the consumer what matters. Return ONLY valid JSON:

{
  "summary": "1 sentence: what product/service this warranty covers and duration",
  "plainEnglish": "In simple everyday language, explain what this warranty covers, what it doesn't, how long it lasts, and how to make a claim if something breaks. 2-3 sentences max.",
  "coveragePeriod": "Exact coverage period (e.g., '2 years from purchase')",
  "covered": ["What IS covered 1", "What IS covered 2", "Coverage 3 if applicable"],
  "notCovered": ["Gotcha 1: what's NOT covered", "Gotcha 2: limitation", "Exclusion 3 if critical"],
  "claimProcess": ["Step 1: how to claim", "Step 2: next step", "Step 3 if needed"],
  "documentsNeeded": ["Proof of purchase", "Receipt or warranty card", "Other doc if needed"],
  "contactInfo": "Support phone, email, or website",
  "deadlines": ["When to claim (e.g., 'Within 30 days')", "Other deadline if critical"],
  "risks": ["Risk 1: unfavorable clause", "Risk 2: limitation", "Risk 3 if significant"],
  "verdict": "strong | standard | weak"
}

CRITICAL RULES:
- Extract 2-3 items per field for covered, notCovered, claimProcess, risks
- coveragePeriod: MUST be specific and clear
- notCovered: MOST IMPORTANT - highlight what consumer WON'T get, including wear/tear, accidental damage
- contactInfo: NEVER blank - list exact contact method or "Not specified"
- verdict: strong = covers most, standard = typical, weak = covers almost nothing
- Flag limitations like "wear and tear excluded," "accidental damage not covered," restocking fees
- Highlight time limits on claims and restrictions
- Include all significant exclusions
- Return ONLY valid JSON, no other text

Warranty Document to analyze:
${warrantyText}`;

    const responseText = await callGemini(prompt);
    const analysis = parseJsonFromResponse(responseText);

    return {
        summary: analysis.summary || '',
        plainEnglish: analysis.plainEnglish || '',
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
