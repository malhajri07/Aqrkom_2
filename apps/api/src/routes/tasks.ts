import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth.js';

const router: Router = Router();

router.use(authMiddleware);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const { status, assigned_to, limit = 50 } = req.query;

    let sql = 'SELECT * FROM tasks WHERE 1=1';
    const params: unknown[] = [];
    let paramIndex = 1;

    if (status) {
      sql += ` AND status = $${paramIndex++}`;
      params.push(status);
    }
    if (assigned_to) {
      sql += ` AND assigned_to = $${paramIndex++}`;
      params.push(assigned_to);
    } else if (req.user?.role !== 'admin') {
      sql += ` AND (assigned_to = $${paramIndex++} OR assigned_to IS NULL)`;
      params.push(req.user!.userId);
    }

    sql += ` ORDER BY due_date ASC NULLS LAST LIMIT $${paramIndex}`;
    params.push(Number(limit));

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Tasks list error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

router.post('/', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { title, description, due_date, priority, contact_id, property_id, transaction_id, assigned_to } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'title required' });
    }

    const result = await query<{ id: string }>(
      `INSERT INTO tasks (title, description, due_date, priority, contact_id, property_id, transaction_id, assigned_to, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [title, description || null, due_date || null, priority || 'medium', contact_id || null, property_id || null, transaction_id || null, assigned_to || req.user!.userId, req.user!.userId]
    );

    res.status(201).json({ id: result.rows[0].id, message: 'Task created' });
  } catch (err) {
    console.error('Task create error:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

router.put('/:id', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, completed_at } = req.body;

    await query(
      'UPDATE tasks SET status = $1, completed_at = $2, updated_at = NOW() WHERE id = $3',
      [status || 'pending', status === 'completed' ? new Date() : null, id]
    );

    res.json({ message: 'Task updated' });
  } catch (err) {
    console.error('Task update error:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

export default router;
