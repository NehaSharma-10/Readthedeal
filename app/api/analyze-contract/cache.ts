import crypto from 'crypto';

interface CachedAnalysis {
    hash: string;
    result: any;
    timestamp: number;
    expiresAt: number;
}

// In-memory cache (replace with Redis for production)
const analysisCache = new Map<string, CachedAnalysis>();

// Cache expiry: 7 days
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Generate a hash of the contract text and mode combined
 */
export function generateContractHash(contractText: string, mode?: string): string {
    const combined = `${contractText.trim().toLowerCase()}|${mode || 'default'}`;
    return crypto
        .createHash('sha256')
        .update(combined)
        .digest('hex');
}

/**
 * Get cached analysis result
 */
export function getCachedAnalysis(contractText: string, mode?: string): any | null {
    const hash = generateContractHash(contractText, mode);
    const cached = analysisCache.get(hash);

    if (!cached) {
        return null;
    }

    // Check if cache has expired
    if (Date.now() > cached.expiresAt) {
        analysisCache.delete(hash);
        return null;
    }

    console.log(`[Cache HIT] Analysis analyzed ${Math.round((Date.now() - cached.timestamp) / 1000)}s ago`);
    return cached.result;
}

/**
 * Store analysis result in cache
 */
export function cacheAnalysis(contractText: string, result: any, mode?: string): void {
    const hash = generateContractHash(contractText, mode);
    const now = Date.now();

    analysisCache.set(hash, {
        hash,
        result,
        timestamp: now,
        expiresAt: now + CACHE_EXPIRY_MS,
    });

    console.log(`[Cache STORED] Hash: ${hash.substring(0, 8)}...`);
}

/**
 * Get cache stats
 */
export function getCacheStats() {
    let validCount = 0;
    let expiredCount = 0;
    const now = Date.now();

    analysisCache.forEach((cached) => {
        if (now > cached.expiresAt) {
            expiredCount++;
        } else {
            validCount++;
        }
    });

    // Clean up expired entries
    if (expiredCount > 0) {
        Array.from(analysisCache.entries()).forEach(([key, cached]) => {
            if (now > cached.expiresAt) {
                analysisCache.delete(key);
            }
        });
    }

    return {
        total: analysisCache.size,
        valid: validCount,
        expired: expiredCount,
    };
}

/**
 * Clear all cache (for development)
 */
export function clearCache(): void {
    analysisCache.clear();
}
