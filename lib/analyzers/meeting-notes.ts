import { callGemini, parseJsonFromResponse, estimateTokens } from '../gemini-utils';

export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
}

export interface MeetingNotesResult {
  summary: string;
  decisions: string[];
  actionItems: ActionItem[];
  openQuestions: string[];
  nextMeeting: string;
  keyPoints: string[];
  provider: string;
}

export async function analyzeMeetingNotes(notesText: string): Promise<MeetingNotesResult> {
  const prompt = `You are a meeting notes, transcripts, and discussion analyzer. Analyze these notes and extract what's actionable. Return ONLY valid JSON:

{
  "summary": "1 sentence: what this meeting was about and key outcome",
  "decisions": ["Decision 1: what was decided", "Decision 2", "Decision 3 if critical"],
  "actionItems": [
    {
      "task": "Clear action item description",
      "owner": "Person responsible or 'Unassigned'",
      "deadline": "Specific date/time or 'Not specified'",
      "priority": "high | medium | low"
    }
  ],
  "openQuestions": ["Unresolved question 1", "Question 2", "Question 3 if significant"],
  "nextMeeting": "Scheduled date/time or 'Not scheduled'",
  "keyPoints": ["Important discussion point 1", "Important point 2", "Point 3 if relevant"]
}

CRITICAL RULES:
- Extract 2-3 items for decisions, openQuestions, and keyPoints
- Extract all actionItems even if many - include owner and deadline for each
- summary: focus on OUTCOME not just topic discussed
- decisions: be specific about what was decided and who decided
- actionItems: MUST have owner and deadline (mark Unassigned/Not specified if missing), include priority
- Prioritize actionItems by urgency and impact
- openQuestions: list ALL unresolved topics that need follow-up
- keyPoints: highlight important discussion points and context
- Include all decisions made during meeting
- Return ONLY valid JSON, no other text

Meeting Notes to analyze:
${notesText}`;

  const responseText = await callGemini(prompt);
  const analysis = parseJsonFromResponse(responseText);

  return {
    summary: analysis.summary || '',
    decisions: analysis.decisions || [],
    actionItems: (analysis.actionItems || []).map((item: any) => ({
      task: item.task || '',
      owner: item.owner || 'Unassigned',
      deadline: item.deadline || 'Not specified',
      priority: item.priority || 'medium'
    })),
    openQuestions: analysis.openQuestions || [],
    nextMeeting: analysis.nextMeeting || 'Not scheduled',
    keyPoints: analysis.keyPoints || [],
    provider: 'gemini-2.5-flash'
  };
}
