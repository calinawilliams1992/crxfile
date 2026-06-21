type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitResult =
  | {
      ok: true;
      remaining: number;
      resetAt: number;
    }
  | {
      ok: false;
      retryAfter: number;
      resetAt: number;
    };

const globalBuckets = globalThis as typeof globalThis & {
  __crxfileRateBuckets?: Map<string, Bucket>;
};

const buckets = globalBuckets.__crxfileRateBuckets ?? new Map<string, Bucket>();
globalBuckets.__crxfileRateBuckets = buckets;

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    sweepExpiredBuckets(now);
    return { ok: true, remaining: limit - 1, resetAt };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
      resetAt: current.resetAt
    };
  }

  current.count += 1;
  return { ok: true, remaining: Math.max(0, limit - current.count), resetAt: current.resetAt };
}

function sweepExpiredBuckets(now: number): void {
  if (buckets.size < 500) {
    return;
  }

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}
