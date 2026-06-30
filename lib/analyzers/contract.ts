import { callGemini, parseJsonFromResponse, estimateTokens } from '../gemini-utils';

export interface ContractResult {
  summary: string;
  plainEnglish: string;
  obligations: {
    serviceProvider: string[];
    client: string[];
  };
  deadlines: {
    label: string;
    value: string;
  }[];
  costs: string[];
  risks: string[];
  assessment: {
    riskLevel: 'low' | 'medium' | 'high';
    confidence: number;
    keyConcerns: string[];
    recommendedReview: string[];
  };
  keyPhrases: string[];
  contractLength: number;
  tokensUsed: number;
  provider: string;
}

export async function analyzeContract(contractText: string): Promise<ContractResult> {
  const prompt = `You are a contract analysis expert. Analyze the provided contract and extract critical information that helps users understand what they're signing.

RETURN ONLY THIS VALID JSON (no other text):
{
  "summary": "2-3 sentences describing the contract type, key parties, duration, main service/product, and core financial terms. Make it specific and business-focused so readers immediately understand what they're signing.",
  "plainEnglish": "In simple everyday language (like explaining to someone unfamiliar with contracts), explain what this contract means, what the person is agreeing to, and what the main risks are. 2-3 sentences max, no jargon.",
  "obligations": {
    "serviceProvider": ["obligation 1", "obligation 2", "obligation 3"],
    "client": ["obligation 1", "obligation 2", "obligation 3"]
  },
  "deadlines": [
    { "label": "Contract Length", "value": "12 months" },
    { "label": "Renewal", "value": "Automatic yearly renewal unless 30 days notice given" },
    { "label": "Invoice Due", "value": "15 calendar days from invoice date" },
    { "label": "Deliverable Review", "value": "5 business days" },
    { "label": "Cure Period", "value": "15 days to fix breach" }
  ],
  "costs": ["Monthly fee: ₹150,000", "Late payment interest: 1.5% per month"],
  "risks": [
    "Late payments incur 1.5% monthly interest",
    "No guarantee of error-free software",
    "Change requests may increase costs and extend timelines",
    "Liability capped at 6 months of payments",
    "Client must pay for completed work even after termination",
    "Client cannot hire provider's employees for 12 months after termination"
  ],
  "assessment": {
    "riskLevel": "medium or low or high",
    "confidence": 92,
    "keyConcerns": [
      "First key concern about what's risky/unfair",
      "Second concern",
      "Third concern if applicable"
    ],
    "recommendedReview": [
      "Action user should take before signing",
      "Second recommended action",
      "Third recommendation"
    ]
  },
  "keyPhrases": ["Important term 1", "Important concept 2"]
}

CRITICAL EXTRACTION RULES FOR CONTRACTS:

**SUMMARY** (MOST IMPORTANT):
- Lead with contract TYPE and PARTIES
- Include DURATION (e.g., "12-month")
- Specify SERVICE/PRODUCT provided
- Include KEY FINANCIAL TERM (e.g., monthly fee, one-time cost)
- Be specific with numbers, dates, and amounts
- Make it immediately clear what the user is signing
- Example: "This is a 12-month software development agreement where ABC Digital Solutions provides development services to XYZ Retail for ₹150,000/month, covering payment terms, IP ownership, and liability limits."

**OBLIGATIONS** (SEPARATE BY PARTY):
- Service Provider: What THEY must do (deliver services, maintain confidentiality, protect data, provide support)
- Client: What THEY must do (pay fees, provide access, review deliverables, give feedback)
- List 3-5 per party, most important first
- Keep concise but complete

**DEADLINES** (STRUCTURED LABELS):
- Contract Length: Initial term duration
- Renewal: How renewal works (automatic or manual)
- Notice Period: Time to cancel/opt-out
- Payment: When invoices are due
- Review Period: Time for deliverable review
- Cure Period: Time to fix breaches
- Non-Solicitation: Duration of employment restrictions
- Any other time-based commitment
- Always include VALUE (specific dates or durations)

**COSTS**:
- Monthly/annual fees
- Late payment penalties
- Additional costs or surcharges
- Be specific with amounts and currencies

**RISKS** (EXTRACT AT LEAST 5-6 HIGH-VALUE RISKS):
- Financial penalties (interest, fees, damages)
- Liability limitations and caps
- Performance guarantees (or lack thereof)
- Automatic renewals or lock-in periods
- Termination penalties or costs
- Restrictive covenants (non-solicitation, non-compete)
- IP/Data ownership concerns
- Indemnification obligations
- Change request impacts
- What user MUST pay for even if they cancel

**ASSESSMENT**:
- riskLevel: "low" (fair terms, minimal concerns), "medium" (some unfair clauses, typical restrictions), or "high" (predatory terms, major red flags)
- confidence: 85-98 (how confident you are in this assessment)
- keyConcerns: 2-3 bullet points about the biggest risks or unfair clauses
- recommendedReview: 2-3 specific actions to take before signing

Return ONLY valid JSON, no explanations, no markdown, no code blocks.

Contract text:
${contractText}`;

  const responseText = await callGemini(prompt);
  const analysis = parseJsonFromResponse(responseText);

  return {
    summary: analysis.summary || '',
    plainEnglish: analysis.plainEnglish || '',
    obligations: {
      serviceProvider: analysis.obligations?.serviceProvider || [],
      client: analysis.obligations?.client || []
    },
    deadlines: analysis.deadlines || [],
    costs: analysis.costs || [],
    risks: analysis.risks || [],
    assessment: {
      riskLevel: analysis.assessment?.riskLevel || 'medium',
      confidence: analysis.assessment?.confidence || 0,
      keyConcerns: analysis.assessment?.keyConcerns || [],
      recommendedReview: analysis.assessment?.recommendedReview || []
    },
    keyPhrases: analysis.keyPhrases || [],
    contractLength: contractText.length,
    tokensUsed: estimateTokens(contractText) + estimateTokens(responseText),
    provider: 'gemini-2.5-flash'
  };
}
