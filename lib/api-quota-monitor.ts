/**
 * API Quota Monitor
 * Tracks quota status for both Groq and Gemini APIs
 * Automatically switches providers when quota is exhausted
 */

interface QuotaStatus {
    provider: 'groq' | 'gemini';
    available: boolean;
    remainingToday: number | null;
    resetAt: number | null;
    lastError: string | null;
    failureCount: number;
    lastChecked: number;
}

// In-memory quota tracking (for development)
// Production: use Redis for persistence across server restarts
const quotaStatus: Record<string, QuotaStatus> = {
    groq: {
        provider: 'groq',
        available: true,
        remainingToday: null,
        resetAt: null,
        lastError: null,
        failureCount: 0,
        lastChecked: Date.now(),
    },
    gemini: {
        provider: 'gemini',
        available: true,
        remainingToday: null,
        resetAt: null,
        lastError: null,
        failureCount: 0,
        lastChecked: Date.now(),
    },
};

/**
 * Check if API error indicates quota exhaustion
 */
export function isQuotaExhausted(error: string): boolean {
    const quotaIndicators = [
        '429',
        'quota',
        'RESOURCE_EXHAUSTED',
        'rate limit',
        'Too Many Requests',
        'Quota exceeded',
        'limit exceeded',
        'quota_exceeded',
        'daily_limit_exceeded',
    ];

    return quotaIndicators.some(indicator =>
        error.toLowerCase().includes(indicator.toLowerCase())
    );
}

/**
 * Update quota status when an error occurs
 */
export function recordQuotaError(provider: 'groq' | 'gemini', error: string): void {
    const status = quotaStatus[provider];

    if (isQuotaExhausted(error)) {
        status.available = false;
        status.lastError = error;
        status.resetAt = Date.now() + (24 * 60 * 60 * 1000); // Reset in 24 hours
        console.warn(`[QUOTA] ${provider.toUpperCase()} quota exhausted. Will reset at ${new Date(status.resetAt).toISOString()}`);
    } else {
        status.failureCount++;
        status.lastError = error;
        console.warn(`[ERROR] ${provider.toUpperCase()} error: ${error} (${status.failureCount} failures)`);
    }

    status.lastChecked = Date.now();
}

/**
 * Mark API as available again (e.g., after quota reset time)
 */
export function recordQuotaSuccess(provider: 'groq' | 'gemini'): void {
    const status = quotaStatus[provider];
    status.available = true;
    status.failureCount = 0;
    status.lastError = null;
    status.lastChecked = Date.now();
}

/**
 * Check if quota has reset (24+ hours passed)
 */
export function checkQuotaReset(): void {
    const now = Date.now();

    Object.keys(quotaStatus).forEach(provider => {
        const status = quotaStatus[provider as 'groq' | 'gemini'];

        if (!status.available && status.resetAt && now >= status.resetAt) {
            status.available = true;
            status.resetAt = null;
            console.log(`[QUOTA] ${provider.toUpperCase()} quota reset available`);
        }
    });
}

/**
 * Get which provider to use based on quota status
 */
export function getPrimaryProvider(): 'groq' | 'gemini' {
    checkQuotaReset(); // Check if any quotas have reset

    const groqStatus = quotaStatus.groq;
    const geminiStatus = quotaStatus.gemini;

    // If Groq is available, use it (primary)
    if (groqStatus.available) {
        return 'groq';
    }

    // If Groq quota exhausted but Gemini available, use Gemini
    if (!groqStatus.available && geminiStatus.available) {
        console.warn('[FALLBACK] Groq quota exhausted, switching to Gemini');
        return 'gemini';
    }

    // Default to Groq (will fail but that's expected)
    return 'groq';
}

/**
 * Get current quota status for all providers
 */
export function getQuotaStatus(): Record<string, QuotaStatus> {
    checkQuotaReset();
    return quotaStatus;
}

/**
 * Reset quota monitoring (for testing)
 */
export function resetQuotaMonitoring(): void {
    Object.keys(quotaStatus).forEach(provider => {
        quotaStatus[provider as 'groq' | 'gemini'] = {
            provider: provider as 'groq' | 'gemini',
            available: true,
            remainingToday: null,
            resetAt: null,
            lastError: null,
            failureCount: 0,
            lastChecked: Date.now(),
        };
    });
    console.log('[QUOTA] All quotas reset');
}

/**
 * Get quota reset time in minutes for user display
 */
export function getQuotaResetMinutes(provider: 'groq' | 'gemini'): number | null {
    const status = quotaStatus[provider];

    if (!status.resetAt) {
        return null;
    }

    const minutesRemaining = Math.ceil((status.resetAt - Date.now()) / 1000 / 60);
    return Math.max(0, minutesRemaining);
}
