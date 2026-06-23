export { analyzeContract, type ContractResult } from './contract';
export { analyzeMessage, type MessageResult } from './message';
export { analyzeReturnPolicy, type ReturnPolicyResult } from './return-policy';
export { analyzePrescription, type PrescriptionResult } from './prescription';
export { analyzeMeetingNotes, type MeetingNotesResult } from './meeting-notes';
export { analyzeGovernmentForm, type GovernmentFormResult } from './government-form';
export { analyzeWarranty, type WarrantyResult } from './warranty';

export type AnalysisMode = 'contract' | 'message' | 'returns' | 'prescription' | 'meeting' | 'government' | 'warranty';

export async function analyze(text: string, mode: AnalysisMode) {
    switch (mode) {
        case 'contract':
            return (await import('./contract')).analyzeContract(text);
        case 'message':
            return (await import('./message')).analyzeMessage(text);
        case 'returns':
            return (await import('./return-policy')).analyzeReturnPolicy(text);
        case 'prescription':
            return (await import('./prescription')).analyzePrescription(text);
        case 'meeting':
            return (await import('./meeting-notes')).analyzeMeetingNotes(text);
        case 'government':
            return (await import('./government-form')).analyzeGovernmentForm(text);
        case 'warranty':
            return (await import('./warranty')).analyzeWarranty(text);
        default:
            throw new Error(`Unknown analysis mode: ${mode}`);
    }
}
