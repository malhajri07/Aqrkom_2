/**
 * Redis client for rate limiting, sessions, cache.
 * Connects lazily on first use when REDIS_URL is set.
 */

import { Redis } from 'ioredis';

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.REDIS_URL;
  if (!url) return null;
  redis = new Redis(url, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => (times > 3 ? null : Math.min(times * 100, 3000)),
    lazyConnect: true,
  });
  redis.on('error', (err: Error) => console.error('[Redis]', err.message));
  return redis;
}

export async function pingRedis(): Promise<boolean> {
  const client = getRedis();
  if (!client) return false;
  try {
    const pong = await client.ping();
    return pong === 'PONG';
  } catch {
    return false;
  }
}

export function hasRedis(): boolean {
  return !!process.env.REDIS_URL;
}
