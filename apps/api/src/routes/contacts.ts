import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth.js';
import { contactCreateSchema, contactUpdateSchema } from '@aqarkom/shared';

const router: Router = Router();

router.use(authMiddleware);

// List contacts (CRM-001, CRM-002)
router.get('/', async (req: AuthRequest, res) => {
  try {
    const {
      contact_type,
      lead_status,
      lead_source,
      search,
      pipeline_stage_id,
      limit = 50,
      offset = 0,
    } = req.query;

    let sql = 'SELECT * FROM contacts WHERE deleted_at IS NULL';
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
    if (lead_source) {
      sql += ` AND lead_source = $${paramIndex++}`;
      params.push(lead_source);
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

// Contact Export (CRM-008) - must be before /:id
router.get('/export', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    let sql = 'SELECT contact_type, first_name_ar, last_name_ar, email, phone, whatsapp, lead_source, lead_status, notes FROM contacts WHERE deleted_at IS NULL';
    const params: unknown[] = [];
    let idx = 1;

    if (req.user?.role !== 'admin') {
      sql += ` AND (assigned_agent_id = $${idx++} OR assigned_agent_id IS NULL)`;
      params.push(req.user!.userId);
    }
    sql += ' ORDER BY created_at DESC LIMIT 10000';

    const result = await query(sql, params);
    const headers = ['contact_type', 'first_name_ar', 'last_name_ar', 'email', 'phone', 'whatsapp', 'lead_source', 'lead_status', 'notes'];
    const csv = [headers.join(',')].concat(
      result.rows.map((r) =>
        headers.map((h) => {
          const v = String(r[h as keyof typeof r] ?? '');
          return v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
        }).join(',')
      )
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send('\uFEFF' + csv);
  } catch (err) {
    console.error('Contact export error:', err);
    res.status(500).json({ error: 'Failed to export contacts' });
  }
});

// Get single contact
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM contacts WHERE id = $1 AND deleted_at IS NULL', [id]);
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
    const parsed = contactCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg, message_en: msg });
    }
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
    } = parsed.data;

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
        lead_status, lead_score || null, assigned_agent_id ?? req.user?.userId, tags ? JSON.stringify(tags) : null,
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
    const parsed = contactUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg, message_en: msg });
    }
    const updates = parsed.data as Record<string, unknown>;

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
        values.push(key === 'tags' && typeof updates[key] === 'object' ? JSON.stringify(updates[key]) : updates[key]);
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

// Contact Import (CRM-008) - bulk up to 10K
router.post('/import', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { contacts: rows, fieldMapping } = req.body as {
      contacts: Array<Record<string, string>>;
      fieldMapping?: Record<string, string>;
    };

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ error: 'contacts array required (max 10000)' });
    }
    if (rows.length > 10000) {
      return res.status(400).json({ error: 'Maximum 10000 contacts per import' });
    }

    const map = fieldMapping || {};
    const mapField = (row: Record<string, string>, key: string) => {
      const src = map[key] || key;
      return row[src] || row[key] || null;
    };

    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      const first_name_ar = mapField(row, 'first_name_ar') || mapField(row, 'first_name') || '';
      const last_name_ar = mapField(row, 'last_name_ar') || mapField(row, 'last_name') || '';
      const phone = mapField(row, 'phone') || mapField(row, 'mobile');
      if (!phone || !first_name_ar.trim()) {
        skipped++;
        continue;
      }

      const existing = await query('SELECT id FROM contacts WHERE phone = $1 AND deleted_at IS NULL', [phone]);
      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      await query(
        `INSERT INTO contacts (contact_type, first_name_ar, last_name_ar, email, phone, whatsapp, lead_source, assigned_agent_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          mapField(row, 'contact_type') || 'buyer',
          first_name_ar.trim(),
          last_name_ar.trim() || '-',
          mapField(row, 'email') || null,
          phone,
          mapField(row, 'whatsapp') || phone,
          mapField(row, 'lead_source') || 'website',
          req.user!.userId,
        ]
      );
      imported++;
    }

    res.json({ imported, skipped, message: `Imported ${imported} contacts, skipped ${skipped} duplicates` });
  } catch (err) {
    console.error('Contact import error:', err);
    res.status(500).json({ error: 'Failed to import contacts' });
  }
});

export default router;
