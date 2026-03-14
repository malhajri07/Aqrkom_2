import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth.js';

const router: Router = Router();

router.use(authMiddleware);

// List transactions (TM-001, TM-002, TM-003)
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { transaction_type, status, limit = 50, offset = 0 } = req.query;

    let sql = `
      SELECT t.*, p.title_ar as property_title, p.city, p.district,
             c.first_name_ar as client_first_name, c.last_name_ar as client_last_name
      FROM transactions t
      JOIN properties p ON t.property_id = p.id
      JOIN contacts c ON t.client_contact_id = c.id
      WHERE 1=1
    `;
    const params: unknown[] = [];
    let paramIndex = 1;

    if (transaction_type) {
      sql += ` AND t.transaction_type = $${paramIndex++}`;
      params.push(transaction_type);
    }
    if (status) {
      sql += ` AND t.status = $${paramIndex++}`;
      params.push(status);
    }

    if (req.user?.role !== 'admin') {
      sql += ` AND t.primary_agent_id = $${paramIndex++}`;
      params.push(req.user!.userId);
    }

    sql += ` ORDER BY t.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(Number(limit), Number(offset));

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Transactions list error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT t.*, p.title_ar, p.price, p.city, p.district, p.photos,
              c.first_name_ar as client_first_name, c.last_name_ar as client_last_name, c.phone as client_phone
       FROM transactions t
       JOIN properties p ON t.property_id = p.id
       JOIN contacts c ON t.client_contact_id = c.id
       WHERE t.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Transaction get error:', err);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// Create transaction (TM-001, TM-002, TM-003)
router.post('/', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const {
      transaction_type,
      property_id,
      client_contact_id,
      list_price,
      commission_rate = 0.05,
      source_request_id,
    } = req.body;

    if (!transaction_type || !property_id || !client_contact_id) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['transaction_type', 'property_id', 'client_contact_id'],
      });
    }

    const commission_amount = list_price ? list_price * commission_rate : null;
    const vat_amount = commission_amount ? commission_amount * 0.15 : null;

    const result = await query<{ id: string }>(
      `INSERT INTO transactions (
        transaction_type, status, property_id, primary_agent_id, client_contact_id,
        list_price, commission_rate, commission_amount, vat_amount, source_request_id
      ) VALUES ($1, 'initiated', $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`,
      [
        transaction_type, property_id, req.user!.userId, client_contact_id,
        list_price || null, commission_rate, commission_amount, vat_amount,
        source_request_id || null,
      ]
    );

    res.status(201).json({ id: result.rows[0].id, message: 'Transaction created' });
  } catch (err) {
    console.error('Transaction create error:', err);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update transaction status
router.put('/:id', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowed = [
      'status', 'list_price', 'final_price', 'commission_rate', 'commission_amount',
      'vat_amount', 'contract_date', 'closing_date', 'lease_start', 'lease_end',
      'lease_monthly_rent', 'deposit_amount', 'ejar_contract_number',
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

    await query(`UPDATE transactions SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`, values);
    res.json({ message: 'Transaction updated' });
  } catch (err) {
    console.error('Transaction update error:', err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

export default router;
