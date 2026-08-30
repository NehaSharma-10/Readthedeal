import { logDocument } from '@/app/api/analyze-contract/document-logger';
import cron from 'node-cron';

let scheduleInitialized = false;

/**
 * Initialize scheduled keepalive task
 * Runs every 5 days to keep Appwrite project active
 * 
 * Call this in your app initialization (e.g., in a server component or middleware)
 */
export function initializeKeepaliveScheduler() {
    if (scheduleInitialized) {
        console.log('ℹ️ Keepalive scheduler already initialized');
        return;
    }

    try {
        // Run every 5 days at 2:00 AM
        // Cron format: second minute hour day month dayOfWeek
        // */5 days = every 5 days starting from day 0
        const task = cron.schedule('0 2 */5 * *', async () => {
            console.log('🔄 Running keepalive task...');
            
            try {
                const testContract = `KEEPALIVE TEST CONTRACT
                
This is an automated keepalive request sent every 5 days to maintain project activity.
                
Service Agreement
Provider: ReadTheDeal Service
Duration: Monthly
Cost: Test Entry
                
Both parties agree to the terms of this automated health check.`;

                // Log to Appwrite (this keeps the project active)
                await logDocument(testContract, 'contract');
                
                console.log('✅ Keepalive task completed successfully');
                console.log(`📅 Next scheduled run: ${new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()}`);
                
            } catch (error) {
                console.error('❌ Keepalive task failed:', error);
            }
        });

        // Start the task
        task.start();
        scheduleInitialized = true;
        
        console.log('✅ Keepalive scheduler initialized (runs every 5 days at 2:00 AM)');
        
    } catch (error) {
        console.error('❌ Failed to initialize keepalive scheduler:', error);
    }
}

/**
 * Stop the scheduler (useful for cleanup)
 */
export function stopKeepaliveScheduler() {
    console.log('🛑 Keepalive scheduler stopped');
    scheduleInitialized = false;
}
