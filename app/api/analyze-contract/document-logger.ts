import { logDocument as appwriteLogDocument, getAllLogs } from '@/lib/appwrite-logger';

/**
 * Log a document submission (Appwrite-backed)
 * Stores: timestamp, document content, and document type
 */
export async function logDocument(
    documentContent: string,
    documentType: string
): Promise<void> {
    try {
        await appwriteLogDocument(documentContent, documentType);
    } catch (error) {
        console.error('Error logging document:', error);
        // Don't throw - logging shouldn't break analysis
    }
}

/**
 * Get all document logs
 */
export async function getAllDocumentLogs(limit = 1000) {
    try {
        return await getAllLogs(limit);
    } catch (error) {
        console.error('Error fetching logs:', error);
        return [];
    }
}
