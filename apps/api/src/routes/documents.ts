/**
 * Document Management - DOC-001, DOC-003, DOC-005
 */

import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth.js';

const router: Router = Router();

router.use(authMiddleware);

// List documents by entity
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { entity_type, entity_id } = req.query;
    if (!entity_type || !entity_id) {
      return res.status(400).json({ error: 'entity_type and entity_id required' });
    }
    const result = await query(
      'SELECT * FROM documents WHERE entity_type = $1 AND entity_id = $2 ORDER BY created_at DESC',
      [entity_type, entity_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Documents list error:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Create document (metadata - file upload would use separate upload endpoint)
router.post('/', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { name, file_path, file_type, file_size, entity_type, entity_id } = req.body;
    if (!name || !file_path || !entity_type || !entity_id) {
      return res.status(400).json({ error: 'name, file_path, entity_type, entity_id required' });
    }
    const result = await query<{ id: string }>(
      `INSERT INTO documents (name, file_path, file_type, file_size, entity_type, entity_id, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [name, file_path, file_type || null, file_size || null, entity_type, entity_id, req.user!.userId]
    );
    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Document create error:', err);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// Compliance checklist templates (DOC-005)
router.get('/templates', async (_req, res) => {
  const templates = [
    { id: 'sale_contract', name_ar: 'عقد بيع', name_en: 'Sale Contract' },
    { id: 'lease_agreement', name_ar: 'عقد إيجار', name_en: 'Lease Agreement' },
    { id: 'power_of_attorney', name_ar: 'الوكالة', name_en: 'Power of Attorney' },
  ];
  res.json(templates);
});

export default router;
