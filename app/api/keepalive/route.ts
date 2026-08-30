import { logDocument } from '../analyze-contract/document-logger';

/**
 * Keepalive endpoint to keep Appwrite project active
 * Run this every 5 days to prevent 7-day inactivity deactivation
 * 
 * Trigger via:
 * - External cron: POST to https://yourapp.com/api/keepalive
 * - cron-job.org, EasyCron, or similar service
 */

export async function POST(request: Request) {
    try {
        // Verify request is authorized (optional but recommended)
        const authHeader = request.headers.get('authorization');
        const expectedKey = process.env.KEEPALIVE_SECRET_KEY;
        
        if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
            return Response.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Minimal test contract to keep Appwrite active
        const testContract = `KEEPALIVE TEST CONTRACT
        
This is an automated keepalive request sent every 5 days to maintain project activity.
        
Service Agreement
Provider: ReadTheDeal Service
Duration: Monthly
Cost: Test Entry
        
Both parties agree to the terms of this automated health check.`;

        // Log to Appwrite (this keeps the project active)
        await logDocument(testContract, 'contract');

        return Response.json({
            success: true,
            message: 'Keepalive check completed',
            timestamp: new Date().toISOString(),
            nextCheck: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
        });

    } catch (error) {
        console.error('❌ Keepalive error:', error);
        return Response.json(
            { 
                error: 'Keepalive check failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// Optional: GET endpoint for monitoring/testing
export async function GET(request: Request) {
    return Response.json({
        status: 'keepalive endpoint active',
        lastCheck: new Date().toISOString(),
        nextScheduled: 'Every 5 days via cron job',
        usage: 'POST /api/keepalive with optional Bearer token'
    });
}
