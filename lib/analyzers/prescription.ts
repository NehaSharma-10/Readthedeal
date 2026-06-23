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
    const prompt = `You are a medical label analyzer. Analyze this prescription or medicine label and return ONLY valid JSON:

{
  "summary": "What this medication is for",
  "dosage": "Recommended dosage and frequency",
  "warnings": ["Warning 1", "Warning 2"],
  "sideEffects": ["Side effect 1", "Side effect 2"],
  "interactions": ["Drug/food interaction 1"],
  "storage": "How to store this medication",
  "missedDose": "What to do if you missed a dose",
  "redFlags": ["STOP and call doctor if: symptom1", "STOP and call doctor if: symptom2"],
  "disclaimer": "This explains what your prescription says — not medical advice. Never change your dosage without consulting your doctor."
}

Return ONLY valid JSON, no other text.

Prescription/Label to analyze:
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
        disclaimer: analysis.disclaimer || 'This explains what your prescription says — not medical advice. Never change your dosage without consulting your doctor.',
        provider: 'gemini-2.5-flash'
    };
}
