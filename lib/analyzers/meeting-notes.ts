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
    const prompt = `You are a meeting notes analyzer. Analyze these meeting notes and return ONLY valid JSON:

{
  "summary": "Brief summary of the meeting",
  "decisions": ["Decision 1", "Decision 2"],
  "actionItems": [
    {
      "task": "Action item description",
      "owner": "Name or 'Unassigned'",
      "deadline": "Date or empty string",
      "priority": "high" | "medium" | "low"
    }
  ],
  "openQuestions": ["Question 1", "Question 2"],
  "nextMeeting": "Date/time or empty string",
  "keyPoints": ["Key point 1", "Key point 2"]
}

Return ONLY valid JSON, no other text.

Meeting notes to analyze:
${notesText}`;

    const responseText = await callGemini(prompt);
    const analysis = parseJsonFromResponse(responseText);

    return {
        summary: analysis.summary || '',
        decisions: analysis.decisions || [],
        actionItems: (analysis.actionItems || []).map((item: any) => ({
            task: item.task || '',
            owner: item.owner || 'Unassigned',
            deadline: item.deadline || '',
            priority: item.priority || 'medium'
        })),
        openQuestions: analysis.openQuestions || [],
        nextMeeting: analysis.nextMeeting || '',
        keyPoints: analysis.keyPoints || [],
        provider: 'gemini-2.5-flash'
    };
}
