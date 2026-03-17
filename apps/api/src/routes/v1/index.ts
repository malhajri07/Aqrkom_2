/**
 * API v1 router — all routes under /api/v1/
 */
import type { IRouter } from 'express';
import { Router } from 'express';
import { envelopeMiddleware } from '../../middleware/envelope.js';
import { authLimiter } from '../../middleware/rateLimit.js';
import authRoutes from '../auth.js';
import propertiesRoutes from '../properties.js';
import contactsRoutes from '../contacts.js';
import requestsRoutes from '../requests.js';
import transactionsRoutes from '../transactions.js';
import tasksRoutes from '../tasks.js';
import activitiesRoutes from '../activities.js';
import dashboardRoutes from '../dashboard.js';
import publicRoutes from '../public.js';
import adminRoutes from '../admin.js';
import documentsRoutes from '../documents.js';
import messagesRoutes from '../messages.js';

const router: IRouter = Router();
router.use(envelopeMiddleware);

router.use('/public', publicRoutes);
router.use('/auth', authLimiter, authRoutes);
router.use('/properties', propertiesRoutes);
router.use('/contacts', contactsRoutes);
router.use('/requests', requestsRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/tasks', tasksRoutes);
router.use('/activities', activitiesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoutes);
router.use('/documents', documentsRoutes);
router.use('/messages', messagesRoutes);

export default router;
