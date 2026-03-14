import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth.js';

const router: Router = Router();

router.use(authMiddleware);

// List property requests - for broker inbox (RM-002) or seeker's own
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { role, userId } = req.user!;
    const { status, city, limit = 50, offset = 0 } = req.query;

    let sql: string;
    const params: unknown[] = [];
    let paramIndex = 1;

    if (['broker', 'agent', 'admin'].includes(role)) {
      // Broker inbox: requests in broker's active neighborhoods
      sql = `
        SELECT pr.*, u.first_name_ar as seeker_first_name, u.last_name_ar as seeker_last_name, u.phone as seeker_phone
        FROM property_requests pr
        JOIN users u ON pr.seeker_id = u.id
        WHERE pr.status = 'open'
      `;
      if (city) {
        sql += ` AND pr.city = $${paramIndex++}`;
        params.push(city);
      }
      sql += ` ORDER BY pr.created_at DESC`;
    } else {
      // Seeker: own requests
      sql = `SELECT * FROM property_requests WHERE seeker_id = $${paramIndex++}`;
      params.push(userId);
      if (status) {
        sql += ` AND status = $${paramIndex++}`;
        params.push(status);
      }
      sql += ` ORDER BY created_at DESC`;
    }

    sql += ` LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(Number(limit), Number(offset));

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Requests list error:', err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Get single request with offers
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const reqResult = await query(
      `SELECT pr.*, u.first_name_ar as seeker_first_name, u.last_name_ar as seeker_last_name
       FROM property_requests pr
       JOIN users u ON pr.seeker_id = u.id
       WHERE pr.id = $1`,
      [id]
    );
    if (reqResult.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const offersResult = await query(
      `SELECT ro.*, p.title_ar, p.price, p.city, p.district, p.photos, p.area_sqm, p.bedrooms
       FROM request_offers ro
       JOIN properties p ON ro.property_id = p.id
       WHERE ro.request_id = $1`,
      [id]
    );

    const reqRow = reqResult.rows[0] || {};
    res.json({ ...reqRow, offers: offersResult.rows });
  } catch (err) {
    console.error('Request get error:', err);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
});

// Submit property request (RM-001)
router.post('/', async (req: AuthRequest, res) => {
  try {
    const {
      request_type,
      property_type,
      city,
      districts,
      budget_min,
      budget_max,
      bedrooms_min,
      area_min_sqm,
      move_in_date,
      additional_requirements,
    } = req.body;

    if (!request_type || !property_type || !city || !districts || !budget_max) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['request_type', 'property_type', 'city', 'districts', 'budget_max'],
      });
    }

    const result = await query<{ id: string }>(
      `INSERT INTO property_requests (
        seeker_id, request_type, property_type, city, districts,
        budget_min, budget_max, bedrooms_min, area_min_sqm, move_in_date,
        additional_requirements, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'open')
      RETURNING id`,
      [
        req.user!.userId, request_type, property_type, city,
        JSON.stringify(Array.isArray(districts) ? districts : [districts]),
        budget_min || null, budget_max, bedrooms_min || null, area_min_sqm || null,
        move_in_date || null, additional_requirements || null,
      ]
    );

    res.status(201).json({ id: result.rows[0].id, message: 'Request submitted' });
  } catch (err) {
    console.error('Request create error:', err);
    res.status(500).json({ error: 'Failed to create request' });
  }
});

// Broker respond with offer (RM-003)
router.post('/:id/offers', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { property_id, message } = req.body;

    if (!property_id) {
      return res.status(400).json({ error: 'property_id required' });
    }

    await query(
      `INSERT INTO request_offers (request_id, broker_id, property_id, message)
       VALUES ($1, $2, $3, $4)`,
      [id, req.user!.userId, property_id, message || null]
    );

    await query(
      'UPDATE property_requests SET offers_count = offers_count + 1, status = $1 WHERE id = $2',
      ['offers_received', id]
    );

    res.status(201).json({ message: 'Offer sent' });
  } catch (err) {
    console.error('Offer create error:', err);
    res.status(500).json({ error: 'Failed to send offer' });
  }
});

export default router;
