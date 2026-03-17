/**
 * BullMQ queues.
 * Requires REDIS_URL. Queues are lazy-initialized; add* functions no-op when Redis unavailable.
 */

import { Queue } from 'bullmq';
import { hasRedis } from '../redis.js';

let propertyPhotosQueue: Queue | null = null;
let requestMatchQueue: Queue | null = null;
let notificationQueue: Queue | null = null;
let regaRevalidateQueue: Queue | null = null;

function getConnection() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  const { hostname, port, username, password } = new URL(url);
  return {
    host: hostname || 'localhost',
    port: parseInt(port || '6379', 10),
    username: username || undefined,
    password: password || undefined,
  };
}

function getPropertyPhotosQueue(): Queue | null {
  if (propertyPhotosQueue) return propertyPhotosQueue;
  const conn = getConnection();
  if (!conn) return null;
  propertyPhotosQueue = new Queue('property.photos.process', {
    connection: conn,
    defaultJobOptions: { removeOnComplete: { count: 100 }, removeOnFail: { count: 500 } },
  });
  return propertyPhotosQueue;
}

function getRequestMatchQueue(): Queue | null {
  if (requestMatchQueue) return requestMatchQueue;
  const conn = getConnection();
  if (!conn) return null;
  requestMatchQueue = new Queue('request.match.auto', {
    connection: conn,
    defaultJobOptions: { removeOnComplete: { count: 100 }, removeOnFail: { count: 500 } },
  });
  return requestMatchQueue;
}

function getNotificationQueue(): Queue | null {
  if (notificationQueue) return notificationQueue;
  const conn = getConnection();
  if (!conn) return null;
  notificationQueue = new Queue('notification.send', {
    connection: conn,
    defaultJobOptions: { removeOnComplete: { count: 100 }, removeOnFail: { count: 500 } },
  });
  return notificationQueue;
}

function getRegaRevalidateQueue(): Queue | null {
  if (regaRevalidateQueue) return regaRevalidateQueue;
  const conn = getConnection();
  if (!conn) return null;
  regaRevalidateQueue = new Queue('rega.license.revalidate', {
    connection: conn,
    defaultJobOptions: { removeOnComplete: { count: 100 }, removeOnFail: { count: 500 } },
  });
  return regaRevalidateQueue;
}

export function addPropertyPhotosJob(propertyId: string, photoPaths: string[]): void {
  if (!hasRedis()) return;
  const q = getPropertyPhotosQueue();
  if (!q) return;
  q.add('process', { propertyId, photoPaths }).catch((err: unknown) => {
    console.error('[BullMQ] Failed to add property.photos.process job:', err);
  });
}

export function addRequestMatchJob(requestId: string): void {
  if (!hasRedis()) return;
  const q = getRequestMatchQueue();
  if (!q) return;
  q.add('match', { requestId }).catch((err: unknown) => {
    console.error('[BullMQ] Failed to add request.match.auto job:', err);
  });
}

export function addNotificationJob(userId: string, type: string, payload: Record<string, unknown>): void {
  if (!hasRedis()) return;
  const q = getNotificationQueue();
  if (!q) return;
  q.add('send', { userId, type, payload }).catch((err: unknown) => {
    console.error('[BullMQ] Failed to add notification.send job:', err);
  });
}

export function addRegaRevalidateJob(propertyId: string): void {
  if (!hasRedis()) return;
  const q = getRegaRevalidateQueue();
  if (!q) return;
  q.add('revalidate', { propertyId }).catch((err: unknown) => {
    console.error('[BullMQ] Failed to add rega.license.revalidate job:', err);
  });
}
