/**
 * Reset Quota Endpoint (Development Only)
 * POST /api/reset-quota
 * 
 * This endpoint resets API quotas for testing purposes.
 * In production, quotas reset automatically after 24 hours.
 */

import { resetQuotaMonitoring } from '@/lib/api-quota-monitor';

export async function POST(request: Request) {
    try {
        // Reset all quotas
        resetQuotaMonitoring();

        return Response.json({
            status: 'success',
            message: 'All API quotas have been reset',
            timestamp: new Date().toISOString(),
            groq: {
                status: 'available',
                resetAt: null
            },
            gemini: {
                status: 'available',
                resetAt: null
            }
        });
    } catch (error) {
        return Response.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
