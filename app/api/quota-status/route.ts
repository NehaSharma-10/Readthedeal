/**
 * Quota Status Endpoint
 * GET /api/quota-status
 * Returns the current quota status and when they reset
 */

import { getQuotaStatus } from '@/lib/api-quota-monitor';

export async function GET() {
    const quotaStatus = getQuotaStatus();
    const now = Date.now();

    return Response.json({
        timestamp: new Date(now).toISOString(),
        groq: {
            available: quotaStatus.groq.available,
            resetAt: quotaStatus.groq.resetAt ? new Date(quotaStatus.groq.resetAt).toISOString() : null,
            hoursUntilReset: quotaStatus.groq.resetAt
                ? Math.ceil((quotaStatus.groq.resetAt - now) / 1000 / 3600)
                : null,
            lastError: quotaStatus.groq.lastError,
            failureCount: quotaStatus.groq.failureCount
        },
        gemini: {
            available: quotaStatus.gemini.available,
            resetAt: quotaStatus.gemini.resetAt ? new Date(quotaStatus.gemini.resetAt).toISOString() : null,
            hoursUntilReset: quotaStatus.gemini.resetAt
                ? Math.ceil((quotaStatus.gemini.resetAt - now) / 1000 / 3600)
                : null,
            lastError: quotaStatus.gemini.lastError,
            failureCount: quotaStatus.gemini.failureCount
        },
        anyAvailable: quotaStatus.groq.available || quotaStatus.gemini.available
    });
}
