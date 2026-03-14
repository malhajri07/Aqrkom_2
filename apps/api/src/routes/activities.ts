import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth.js';

const router: Router = Router();

router.use(authMiddleware);

router.get('/contact/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    const result = await query(
      'SELECT * FROM activities WHERE contact_id = $1 ORDER BY created_at DESC LIMIT 50',
      [contactId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Activities list error:', err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

router.post('/', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { contact_id, activity_type, subject, description } = req.body;

    if (!contact_id || !activity_type) {
      return res.status(400).json({ error: 'contact_id and activity_type required' });
    }

    const result = await query<{ id: string }>(
      `INSERT INTO activities (contact_id, activity_type, subject, description, created_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [contact_id, activity_type, subject || null, description || null, req.user!.userId]
    );

    res.status(201).json({ id: result.rows[0].id, message: 'Activity logged' });
  } catch (err) {
    console.error('Activity create error:', err);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

export default router;
