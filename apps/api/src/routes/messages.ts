/**
 * In-App Messaging - COM-001
 * Placeholder for 1:1 chat. Full implementation requires WebSocket/Redis.
 */

import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router: Router = Router();

router.use(authMiddleware);

router.get('/conversations', async (_req: AuthRequest, res) => {
  // TODO: Return user's conversations - requires chat schema
  res.json([]);
});

router.get('/conversations/:userId/messages', async (_req: AuthRequest, res) => {
  // TODO: Return messages - requires chat schema
  res.json([]);
});

router.post('/conversations/:userId/messages', async (req: AuthRequest, res) => {
  // TODO: Send message - requires chat schema
  res.status(201).json({ id: 'placeholder', message: 'Message endpoint - implement with WebSocket' });
});

export default router;
