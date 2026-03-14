import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth.js';

const router: Router = Router();

router.use(authMiddleware);

// List contacts (CRM-001, CRM-002)
router.get('/', async (req: AuthRequest, res) => {
  try {
    const {
      contact_type,
      lead_status,
      search,
      pipeline_stage_id,
      limit = 50,
      offset = 0,
    } = req.query;

    let sql = 'SELECT * FROM contacts WHERE 1=1';
    const params: unknown[] = [];
    let paramIndex = 1;

    if (contact_type) {
      sql += ` AND contact_type = $${paramIndex++}`;
      params.push(contact_type);
    }
    if (lead_status) {
      sql += ` AND lead_status = $${paramIndex++}`;
      params.push(lead_status);
    }
    if (pipeline_stage_id) {
      sql += ` AND pipeline_stage_id = $${paramIndex++}`;
      params.push(pipeline_stage_id);
    }
    if (search) {
      sql += ` AND (first_name_ar ILIKE $${paramIndex} OR last_name_ar ILIKE $${paramIndex} OR phone ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (req.user?.role !== 'admin') {
      sql += ` AND (assigned_agent_id = $${paramIndex++} OR assigned_agent_id IS NULL)`;
      params.push(req.user!.userId);
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(Number(limit), Number(offset));

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Contacts list error:', err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get single contact
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM contacts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Contact get error:', err);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// Create contact (CRM-001)
router.post('/', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const {
      contact_type,
      first_name_ar,
      last_name_ar,
      first_name_en,
      last_name_en,
      email,
      phone,
      whatsapp,
      company,
      lead_source,
      lead_status = 'new',
      lead_score,
      assigned_agent_id,
      tags,
      notes,
      pipeline_stage_id,
    } = req.body;

    if (!contact_type || !first_name_ar || !last_name_ar || !phone) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['contact_type', 'first_name_ar', 'last_name_ar', 'phone'],
      });
    }

    const result = await query<{ id: string }>(
      `INSERT INTO contacts (
        contact_type, first_name_ar, last_name_ar, first_name_en, last_name_en,
        email, phone, whatsapp, company, lead_source, lead_status, lead_score,
        assigned_agent_id, tags, notes, pipeline_stage_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING id`,
      [
        contact_type, first_name_ar, last_name_ar, first_name_en || null, last_name_en || null,
        email || null, phone, whatsapp || null, company || null, lead_source || null,
        lead_status, lead_score || null, assigned_agent_id || req.user?.userId, null,
        notes || null, pipeline_stage_id || null,
      ]
    );

    res.status(201).json({ id: result.rows[0].id, message: 'Contact created' });
  } catch (err) {
    console.error('Contact create error:', err);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Update contact
router.put('/:id', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowed = [
      'contact_type', 'first_name_ar', 'last_name_ar', 'first_name_en', 'last_name_en',
      'email', 'phone', 'whatsapp', 'company', 'lead_source', 'lead_status', 'lead_score',
      'assigned_agent_id', 'tags', 'notes', 'pipeline_stage_id',
    ];

    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        setClauses.push(`${key} = $${paramIndex++}`);
        values.push(updates[key]);
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No valid updates' });
    }

    setClauses.push('updated_at = NOW()');
    values.push(id);

    await query(`UPDATE contacts SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`, values);
    res.json({ message: 'Contact updated' });
  } catch (err) {
    console.error('Contact update error:', err);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

export default router;
