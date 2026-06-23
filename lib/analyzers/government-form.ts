import { callGemini, parseJsonFromResponse, estimateTokens } from '../gemini-utils';

export interface Deadline {
  action: string;
  date: string;
  consequence: string;
}

export interface GovernmentFormResult {
  summary: string;
  whatTheyNeedToDo: string[];
  documentsRequired: string[];
  deadlines: Deadline[];
  fees: string[];
  governmentWarnings: string[];
  helpfulTips: string[];
  provider: string;
}

export async function analyzeGovernmentForm(formText: string): Promise<GovernmentFormResult> {
  const prompt = `You are a government form analyzer. Analyze this government form or official notice and return ONLY valid JSON:

{
  "summary": "What this document is and its purpose",
  "whatTheyNeedToDo": ["Step 1", "Step 2", "Step 3"],
  "documentsRequired": ["Document 1", "Document 2"],
  "deadlines": [
    {
      "action": "What needs to be done",
      "date": "Date or timeframe",
      "consequence": "What happens if missed"
    }
  ],
  "fees": ["Fee 1", "Fee 2 or empty array"],
  "warnings": ["Important warning"],
  "helpfulTips": ["Tip 1", "Tip 2"]
}

IMPORTANT: 
- whatTheyNeedToDo must be numbered steps
- Each deadline MUST have a consequence (never blank)
- Use "Consequence not specified" if not mentioned
- Return ONLY valid JSON, no other text

Document to analyze:
${formText}`;

  const responseText = await callGemini(prompt);
  const analysis = parseJsonFromResponse(responseText);

  return {
    summary: analysis.summary || '',
    whatTheyNeedToDo: analysis.whatTheyNeedToDo || [],
    documentsRequired: analysis.documentsRequired || [],
    deadlines: (analysis.deadlines || []).map((d: any) => ({
      action: d.action || '',
      date: d.date || '',
      consequence: d.consequence || 'Consequence not specified'
    })),
    fees: analysis.fees || [],
    governmentWarnings: analysis.warnings || analysis.governmentWarnings || [],
    helpfulTips: analysis.helpfulTips || [],
    provider: 'gemini-2.5-flash'
  };
}
