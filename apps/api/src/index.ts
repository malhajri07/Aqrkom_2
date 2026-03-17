/**
 * Aqarkom API - Saudi Real Estate CRM Backend
 * Based on PRD: RealEstate_CRM_PRD_Saudi_Comprehensive.xlsx
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middleware/rateLimit.js';
import { pingRedis, hasRedis } from './redis.js';
import v1Router from './routes/v1/index.js';
import authRoutes from './routes/auth.js';
import propertiesRoutes from './routes/properties.js';
import contactsRoutes from './routes/contacts.js';
import requestsRoutes from './routes/requests.js';
import transactionsRoutes from './routes/transactions.js';
import tasksRoutes from './routes/tasks.js';
import activitiesRoutes from './routes/activities.js';
import dashboardRoutes from './routes/dashboard.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import documentsRoutes from './routes/documents.js';
import messagesRoutes from './routes/messages.js';
import { query } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use('/api', apiLimiter);

// Static uploads (PM-004)
app.use('/uploads', express.static('uploads'));

// Health check (no envelope) — database + Redis
async function healthCheck(_req: express.Request, res: express.Response) {
  let dbStatus = 'unknown';
  try {
    await query('SELECT 1');
    dbStatus = 'connected';
  } catch {
    dbStatus = 'disconnected';
  }

  let redisStatus: string = 'skipped';
  if (hasRedis()) {
    redisStatus = (await pingRedis()) ? 'connected' : 'disconnected';
  }

  const checks = { database: dbStatus, redis: redisStatus };
  const allOk = dbStatus === 'connected' && (redisStatus === 'skipped' || redisStatus === 'connected');
  res.json({
    status: allOk ? 'healthy' : 'degraded',
    app: 'Aqarkom API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    checks,
  });
}

app.get('/api/health', healthCheck);
app.get('/api/v1/health', healthCheck);

// API v1 (versioned, with response envelope)
app.use('/api/v1', v1Router);

// Legacy /api routes (backward compat — deprecated, use /api/v1)
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/messages', messagesRoutes);

app.listen(PORT, () => {
  console.log(`Aqarkom API running at http://localhost:${PORT}`);
});
