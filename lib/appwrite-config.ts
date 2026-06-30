import { Client, Databases, ID } from 'node-appwrite';

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

export const databases = new Databases(client);

// Database and collection IDs
export const DB_ID = process.env.APPWRITE_DATABASE_ID || '686940b1002f41ba13a3';
export const LOGS_COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID || '6a427fab001aec0208c0';

export { ID };
