import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import type { RedisReply } from 'rate-limit-redis';
import { getRedis } from '../redis.js';

function createStore(prefix: string) {
  const client = getRedis();
  if (!client) return undefined;
  return new RedisStore({
    prefix,
    sendCommand: (command: string, ...args: string[]) =>
      client.call(command, ...args) as Promise<RedisReply>,
  });
}

/** General API: 100 requests per minute per IP. Uses Redis when REDIS_URL is set. */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore('rl:api:'),
});

/** Auth endpoints (login, register): 20 requests per minute per IP. Uses Redis when REDIS_URL is set. */
export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore('rl:auth:'),
});
