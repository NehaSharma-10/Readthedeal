import { callGemini, parseJsonFromResponse, estimateTokens } from '../gemini-utils';

export interface PrescriptionResult {
    summary: string;
    dosage: string;
    warnings: string[];
    sideEffects: string[];
    interactions: string[];
    storage: string;
    missedDose: string;
    redFlags: string[];
    disclaimer: string;
    provider: string;
}

export async function analyzePrescription(prescriptionText: string): Promise<PrescriptionResult> {
    const prompt = `You are a medical document analyzer. Analyze this prescription, medical report, lab result, or health document and extract critical information. Return ONLY valid JSON:

{
  "summary": "1 sentence: what this document is and what medication/condition it addresses",
  "dosage": "Recommended dosage, frequency, and duration if specified",
  "warnings": ["Warning 1", "Warning 2", "Warning 3 if exists"],
  "sideEffects": ["Most common side effect 1", "Important side effect 2", "Other notable side effect"],
  "interactions": ["Drug/food/supplement interaction 1", "Interaction 2 if any"],
  "storage": "Storage instructions if applicable",
  "missedDose": "What to do if a dose is missed",
  "redFlags": ["STOP and contact doctor if: critical symptom 1", "Emergency sign if applicable", "Contraindication if exists"],
  "disclaimer": "Disclaimer about medical advice"
}

CRITICAL RULES:
- Extract 2-3 items per field for warnings, side effects, interactions, and red flags
- Focus on CRITICAL and ACTIONABLE information
- Highlight dangerous interactions or contraindications clearly
- Keep warnings specific and actionable, not generic
- If information not in document, use "Not specified" rather than omitting
- Always include medical disclaimer
- For medical reports: focus on key findings, abnormal values, and recommendations
- For lab results: highlight abnormal values and what they mean
- Emphasize interactions with common drugs and foods
- Include emergency symptoms or when to seek immediate care

Return ONLY valid JSON, no other text.

Medical Document to analyze:
${prescriptionText}`;

    const responseText = await callGemini(prompt);
    const analysis = parseJsonFromResponse(responseText);

    return {
        summary: analysis.summary || '',
        dosage: analysis.dosage || '',
        warnings: analysis.warnings || [],
        sideEffects: analysis.sideEffects || [],
        interactions: analysis.interactions || [],
        storage: analysis.storage || '',
        missedDose: analysis.missedDose || '',
        redFlags: analysis.redFlags || [],
        disclaimer: analysis.disclaimer || 'This explains what your prescription or medical document says — not medical advice. Always consult your doctor before making any changes.',
        provider: 'gemini-2.5-flash'
    };
}
