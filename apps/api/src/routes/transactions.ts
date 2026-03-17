import { Router } from 'express';
import { transactionUpdateSchema } from '@aqarkom/shared';
import { query } from '../db.js';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth.js';
import { createEjarContract } from '../integrations/ejar/ejar.service.js';
import { generateCommissionInvoice } from '../integrations/zatca/zatca.service.js';

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
      JOIN properties p ON t.property_id = p.id AND p.deleted_at IS NULL
      JOIN contacts c ON t.client_contact_id = c.id AND c.deleted_at IS NULL
      WHERE t.deleted_at IS NULL
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

// Get transaction timeline (TM-006)
router.get('/:id/timeline', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const [tasks, offers, rentPayments, earnestMoney] = await Promise.all([
      query('SELECT id, title, status, due_date, completed_at, created_at, \'task\' as type FROM tasks WHERE transaction_id = $1 ORDER BY created_at DESC', [id]),
      query('SELECT id, offer_amount, status, created_at, \'offer\' as type FROM property_offers WHERE transaction_id = $1 ORDER BY created_at DESC', [id]),
      query('SELECT id, amount, payment_date, status, created_at, \'rent_payment\' as type FROM rent_payments WHERE transaction_id = $1 ORDER BY payment_date DESC', [id]),
      query('SELECT id, amount, payment_date, status, created_at, \'earnest_money\' as type FROM earnest_money WHERE transaction_id = $1 ORDER BY payment_date DESC', [id]),
    ]);
    const items = [
      ...tasks.rows.map((r) => ({ ...r, type: 'task' })),
      ...offers.rows.map((r) => ({ ...r, type: 'offer' })),
      ...rentPayments.rows.map((r) => ({ ...r, type: 'rent_payment' })),
      ...earnestMoney.rows.map((r) => ({ ...r, type: 'earnest_money' })),
    ].sort((a, b) => {
      const dateA = (a as Record<string, unknown>).created_at ?? (a as Record<string, unknown>).payment_date;
      const dateB = (b as Record<string, unknown>).created_at ?? (b as Record<string, unknown>).payment_date;
      return new Date(dateB as string).getTime() - new Date(dateA as string).getTime();
    });
    res.json(items);
  } catch (err) {
    console.error('Timeline error:', err);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

// Get closing checklist (TM-007)
router.get('/:id/checklist', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const r = await query('SELECT status, contract_date, closing_date, ejar_contract_number FROM transactions WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Transaction not found' });
    const t = r.rows[0] as Record<string, unknown>;
    const checklist = [
      { id: 'contract_signed', label_ar: 'توقيع العقد', label_en: 'Contract signed', done: !!t.contract_date },
      { id: 'ejar_registered', label_ar: 'تسجيل إيجار', label_en: 'Ejar registered', done: !!t.ejar_contract_number },
      { id: 'closing_complete', label_ar: 'إتمام الإغلاق', label_en: 'Closing complete', done: !!t.closing_date },
      { id: 'commission_paid', label_ar: 'دفع العمولة', label_en: 'Commission paid', done: t.status === 'closed' },
    ];
    res.json(checklist);
  } catch (err) {
    console.error('Checklist error:', err);
    res.status(500).json({ error: 'Failed to fetch checklist' });
  }
});

// Get commission breakdown (TM-009)
router.get('/:id/commission', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const r = await query(
      'SELECT list_price, final_price, commission_rate, commission_amount, vat_amount FROM transactions WHERE id = $1 AND deleted_at IS NULL',
      [id]
    );
    if (!r.rows[0]) return res.status(404).json({ error: 'Transaction not found' });
    const t = r.rows[0] as Record<string, unknown>;
    const commission = Number(t.commission_amount) || 0;
    const vat = Number(t.vat_amount) || commission * 0.15;
    res.json({
      commission_amount: commission,
      vat_rate: 0.15,
      vat_amount: vat,
      total_with_vat: commission + vat,
      commission_rate: t.commission_rate,
      list_price: t.list_price,
      final_price: t.final_price,
    });
  } catch (err) {
    console.error('Commission error:', err);
    res.status(500).json({ error: 'Failed to fetch commission' });
  }
});

// Get transaction offers (TM-004)
router.get('/:id/offers', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT po.*, c.first_name_ar as buyer_first_name, c.last_name_ar as buyer_last_name
       FROM property_offers po
       JOIN contacts c ON po.buyer_contact_id = c.id
       WHERE po.transaction_id = $1 ORDER BY po.created_at DESC`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Offers list error:', err);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

// Get rent payments (FIN-002, TM-008)
router.get('/:id/rent-payments', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM rent_payments WHERE transaction_id = $1 ORDER BY payment_date DESC', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Rent payments error:', err);
    res.status(500).json({ error: 'Failed to fetch rent payments' });
  }
});

// Add rent payment (FIN-002)
router.post('/:id/rent-payments', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { amount, payment_date, period_start, period_end, status, payment_method, notes } = req.body;
    if (!amount || !payment_date) return res.status(400).json({ error: 'amount and payment_date required' });
    await query(
      `INSERT INTO rent_payments (transaction_id, amount, payment_date, period_start, period_end, status, payment_method, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, amount, payment_date, period_start || null, period_end || null, status || 'paid', payment_method || null, notes || null]
    );
    res.status(201).json({ message: 'Rent payment recorded' });
  } catch (err) {
    console.error('Rent payment add error:', err);
    res.status(500).json({ error: 'Failed to add rent payment' });
  }
});

// Register Ejar contract (Phase 2)

router.post('/:id/ejar/register', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const r = await query(
      `SELECT t.*, p.city, p.district, c.first_name_ar, c.last_name_ar, c.phone, c.email
       FROM transactions t
       JOIN properties p ON t.property_id = p.id AND p.deleted_at IS NULL
       JOIN contacts c ON t.client_contact_id = c.id AND c.deleted_at IS NULL
       WHERE t.id = $1 AND t.deleted_at IS NULL`,
      [id]
    );
    if (!r.rows[0]) return res.status(404).json({ error: 'Transaction not found' });
    const t = r.rows[0] as Record<string, unknown>;
    if (t.transaction_type !== 'lease') return res.status(400).json({ error: 'Ejar is for lease transactions only' });

    const data = {
      transactionId: id,
      propertyType: 'residential' as const,
      city: String(t.city || ''),
      district: String(t.district || ''),
      landlordName: 'Landlord', // TODO: from owner contact
      landlordPhone: String(t.phone || ''),
      tenantName: `${t.first_name_ar || ''} ${t.last_name_ar || ''}`.trim(),
      tenantPhone: String(t.phone || ''),
      tenantEmail: t.email ? String(t.email) : undefined,
      startDate: t.lease_start ? String(t.lease_start).slice(0, 10) : new Date().toISOString().slice(0, 10),
      endDate: t.lease_end ? String(t.lease_end).slice(0, 10) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      rentAmount: Number(t.lease_monthly_rent) || 0,
      paymentFrequency: 'monthly' as const,
    };

    const result = await createEjarContract(data);
    await query('UPDATE transactions SET ejar_contract_number = $1, updated_at = NOW() WHERE id = $2', [result.contractNumber, id]);
    res.json({ contractNumber: result.contractNumber, status: result.status, message: result.message });
  } catch (err) {
    console.error('Ejar register error:', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to register Ejar contract' });
  }
});

// Get ZATCA commission invoice (Phase 2)
router.get('/:id/invoice', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const r = await query(
      `SELECT t.*, c.first_name_ar, c.last_name_ar
       FROM transactions t
       JOIN contacts c ON t.client_contact_id = c.id AND c.deleted_at IS NULL
       WHERE t.id = $1 AND t.deleted_at IS NULL`,
      [id]
    );
    if (!r.rows[0]) return res.status(404).json({ error: 'Transaction not found' });
    const t = r.rows[0] as Record<string, unknown>;
    const commission = Number(t.commission_amount) || 0;
    const buyerName = `${t.first_name_ar || ''} ${t.last_name_ar || ''}`.trim() || 'Client';

    const invoice = generateCommissionInvoice({
      transactionId: id,
      buyerName,
      description: 'عمولة عقارية / Real Estate Commission',
      amountExclVat: commission,
      invoiceNumber: `INV-${id.slice(0, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
    });

    res.json(invoice);
  } catch (err) {
    console.error('Invoice error:', err);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
});

// Get earnest money (TM-009)
router.get('/:id/earnest-money', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM earnest_money WHERE transaction_id = $1 ORDER BY payment_date DESC', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Earnest money error:', err);
    res.status(500).json({ error: 'Failed to fetch earnest money' });
  }
});

// Add earnest money (TM-009)
router.post('/:id/earnest-money', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { amount, payment_date, holder, refund_conditions, status, notes } = req.body;
    if (!amount || !payment_date) return res.status(400).json({ error: 'amount and payment_date required' });
    await query(
      `INSERT INTO earnest_money (transaction_id, amount, payment_date, holder, refund_conditions, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, amount, payment_date, holder || null, refund_conditions || null, status || 'held', notes || null]
    );
    res.status(201).json({ message: 'Earnest money recorded' });
  } catch (err) {
    console.error('Earnest money add error:', err);
    res.status(500).json({ error: 'Failed to add earnest money' });
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
       JOIN properties p ON t.property_id = p.id AND p.deleted_at IS NULL
       JOIN contacts c ON t.client_contact_id = c.id AND c.deleted_at IS NULL
       WHERE t.id = $1 AND t.deleted_at IS NULL`,
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

// Update transaction
router.put('/:id', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const parsed = transactionUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg, message_en: msg });
    }
    const updates = parsed.data as Record<string, unknown>;

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
