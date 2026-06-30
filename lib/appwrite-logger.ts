import { databases, DB_ID, LOGS_COLLECTION_ID, ID } from './appwrite-config';
import { Query } from 'node-appwrite';

export interface DocumentLog {
    $createdAt: string;
    documentContent: string;
    documentType: string;
}

/**
 * Log a document submission to Appwrite
 * Stores: documentContent, documentType
 * $createdAt is automatically set by Appwrite
 */
export async function logDocument(
    documentContent: string,
    documentType: string
): Promise<void> {
    try {
        await databases.createDocument(
            DB_ID,
            LOGS_COLLECTION_ID,
            ID.unique(),
            {
                documentContent,
                documentType
            }
        );
        console.log(`✅ Document logged: ${documentType}`);
    } catch (error) {
        console.error('Error logging document:', error);
    }
}

/**
 * Get all logged documents
 */
export async function getAllLogs(limit = 1000) {
    try {
        const response = await databases.listDocuments(
            DB_ID,
            LOGS_COLLECTION_ID,
            [Query.limit(limit), Query.orderDesc('$createdAt')]
        );

        return response.documents as unknown as DocumentLog[];
    } catch (error) {
        console.error('Error fetching logs:', error);
        return [];
    }
}
