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
  const prompt = `You are a government form and official document analyzer. Analyze this government form, tax form, visa document, permit, or official notice and extract critical information. Return ONLY valid JSON:

{
  "summary": "1 sentence: what this form/notice is and its purpose",
  "whatTheyNeedToDo": ["Action 1: step to complete", "Action 2: next step", "Action 3 if applicable"],
  "documentsRequired": ["Document 1", "Document 2", "Document 3 if needed"],
  "deadlines": [
    {
      "action": "What needs to be done",
      "date": "Deadline date or timeframe",
      "consequence": "What happens if you miss it"
    }
  ],
  "fees": ["Fee 1", "Fee 2 if applicable"],
  "governmentWarnings": ["Critical warning 1", "Important note 2"],
  "helpfulTips": ["Official tip 1", "Pro tip 2"]
}

CRITICAL RULES:
- Extract 2-3 items for whatTheyNeedToDo, documentsRequired, and other fields
- whatTheyNeedToDo must be NUMBERED clear, actionable steps
- EVERY deadline MUST include consequence (never blank) - highlight penalties, fines, legal consequences
- Include all critical deadlines with specific dates
- Flag missing information or vague instructions
- Focus on what the user MUST know to comply
- Return ONLY valid JSON, no other text

Government Document to analyze:
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
    governmentWarnings: analysis.governmentWarnings || analysis.warnings || [],
    helpfulTips: analysis.helpfulTips || [],
    provider: 'gemini-2.5-flash'
  };
}
