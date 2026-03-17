/**
 * BullMQ workers.
 * Run in separate process when deploying to Cloud Run (Worker service).
 */

import { Worker, Job } from 'bullmq';
import path from 'path';
import fs from 'fs';

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

const c = getConnection();
if (!c) {
  console.warn('[Workers] REDIS_URL not set, workers disabled');
} else {
  const propertyPhotosWorker = new Worker(
    'property.photos.process',
    async (job: Job) => {
      const { propertyId, photoPaths } = job.data as { propertyId: string; photoPaths: string[] };
      const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'properties');
      for (const rel of photoPaths) {
        const filename = rel.replace(/^\/uploads\/properties\//, '');
        const fullPath = path.join(UPLOAD_DIR, filename);
        if (fs.existsSync(fullPath)) {
          // TODO: WebP conversion, thumbnail generation (sharp)
          // For now: just ensure file exists; future: add sharp for conversion
          await job.log(`Processed ${filename} for property ${propertyId}`);
        }
      }
      return { processed: photoPaths.length };
    },
    { connection: c, concurrency: 2 }
  );

  propertyPhotosWorker.on('completed', (job) => {
    console.log(`[Worker] property.photos.process job ${job.id} completed`);
  });

  propertyPhotosWorker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`[Worker] property.photos.process job ${job?.id} failed:`, err);
  });

  const requestMatchWorker = new Worker(
    'request.match.auto',
    async (job: Job) => {
      const { requestId } = job.data as { requestId: string };
      // TODO: Match new listings with open requests by city/district/budget
      await job.log(`Auto-match for request ${requestId} (placeholder)`);
      return { matched: 0 };
    },
    { connection: c, concurrency: 2 }
  );

  requestMatchWorker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`[Worker] request.match.auto job ${job?.id} failed:`, err);
  });

  const notificationWorker = new Worker(
    'notification.send',
    async (job: Job) => {
      const { userId, type, payload } = job.data as { userId: string; type: string; payload: Record<string, unknown> };
      // TODO: Send via Push, SMS (Unifonic), Email
      await job.log(`Notification ${type} for user ${userId}`);
      return { sent: true };
    },
    { connection: c, concurrency: 5 }
  );

  notificationWorker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`[Worker] notification.send job ${job?.id} failed:`, err);
  });

  console.log('[Workers] BullMQ workers started');
}
