/**
 * Simple in-memory rate limiter with localStorage fallback
 * For production, use Redis or Upstash for true persistence
 */

interface UserQuota {
    count: number;
    resetAt: number;
}

// Store user quotas: key = userId (IP hash or session ID)
const userQuotas = new Map<string, UserQuota>();

// Configuration
const FREE_TIER_LIMIT = 4; // 4 analyses per day
const RESET_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get unique identifier for anonymous user
 * In production, use session IDs or Upstash for better tracking
 */
export function getUserIdentifier(request: Request): string {
    // Try to get from headers (works behind proxies)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown';

    // Hash the IP for privacy
    return Buffer.from(ip).toString('base64');
}

/**
 * Check if user has quota available
 * Returns: { allowed: boolean, remaining: number, resetsIn: number }
 */
export function checkQuota(userId: string): {
    allowed: boolean;
    remaining: number;
    resetsIn: number;
    total: number;
} {
    const now = Date.now();
    let quota = userQuotas.get(userId);

    // Create new quota or reset if expired
    if (!quota || now > quota.resetAt) {
        quota = {
            count: 0,
            resetAt: now + RESET_INTERVAL_MS,
        };
        userQuotas.set(userId, quota);
    }

    const remaining = Math.max(0, FREE_TIER_LIMIT - quota.count);
    const resetsIn = Math.ceil((quota.resetAt - now) / 1000 / 60); // minutes

    return {
        allowed: remaining > 0,
        remaining,
        resetsIn,
        total: FREE_TIER_LIMIT,
    };
}

/**
 * Increment user's quota usage
 */
export function incrementQuota(userId: string): void {
    const quota = userQuotas.get(userId);
    if (quota) {
        quota.count++;
    }
}

/**
 * Get rate limit stats for debugging
 */
export function getRateLimitStats() {
    const now = Date.now();
    let activeUsers = 0;
    let totalRequests = 0;

    userQuotas.forEach((quota) => {
        if (now <= quota.resetAt) {
            activeUsers++;
            totalRequests += quota.count;
        }
    });

    return {
        activeUsers,
        totalRequests,
        quotaLimit: FREE_TIER_LIMIT,
        totalUsers: userQuotas.size,
    };
}

/**
 * Reset all quotas (for development/testing)
 */
export function resetAllQuotas(): void {
    userQuotas.clear();
}

/**
 * Clean up expired quotas (call periodically)
 */
export function cleanupExpiredQuotas(): void {
    const now = Date.now();
    let cleaned = 0;

    userQuotas.forEach((quota, userId) => {
        if (now > quota.resetAt && quota.count === 0) {
            userQuotas.delete(userId);
            cleaned++;
        }
    });

    if (cleaned > 0) {
        console.log(`[Rate Limiter] Cleaned up ${cleaned} expired quotas`);
    }
}
