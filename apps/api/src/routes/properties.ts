import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth.js';

const router: Router = Router();

router.use(authMiddleware);

// List properties with filters (PM-006)
router.get('/', async (req: AuthRequest, res) => {
  try {
    const {
      city,
      district,
      status,
      property_type,
      transaction_type,
      min_price,
      max_price,
      bedrooms,
      limit = 50,
      offset = 0,
    } = req.query;

    let sql = `
      SELECT p.*, u.first_name_ar as agent_first_name, u.last_name_ar as agent_last_name
      FROM properties p
      JOIN users u ON p.listing_agent_id = u.id
      WHERE 1=1
    `;
    const params: unknown[] = [];
    let paramIndex = 1;

    if (city) {
      sql += ` AND p.city = $${paramIndex++}`;
      params.push(city);
    }
    if (district) {
      sql += ` AND p.district = $${paramIndex++}`;
      params.push(district);
    }
    if (status) {
      sql += ` AND p.status = $${paramIndex++}`;
      params.push(status);
    }
    if (property_type) {
      sql += ` AND p.property_type = $${paramIndex++}`;
      params.push(property_type);
    }
    if (transaction_type) {
      sql += ` AND p.transaction_type = $${paramIndex++}`;
      params.push(transaction_type);
    }
    if (min_price) {
      sql += ` AND p.price >= $${paramIndex++}`;
      params.push(Number(min_price));
    }
    if (max_price) {
      sql += ` AND p.price <= $${paramIndex++}`;
      params.push(Number(max_price));
    }
    if (bedrooms) {
      sql += ` AND p.bedrooms >= $${paramIndex++}`;
      params.push(Number(bedrooms));
    }

    // Filter by broker's listings unless admin
    if (req.user?.role !== 'admin') {
      sql += ` AND p.listing_agent_id = $${paramIndex++}`;
      params.push(req.user!.userId);
    }

    sql += ` ORDER BY p.created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex}`;
    params.push(Number(limit), Number(offset));

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Properties list error:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property (PM-001)
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT p.*, u.first_name_ar as agent_first_name, u.last_name_ar as agent_last_name, u.phone as agent_phone
       FROM properties p
       JOIN users u ON p.listing_agent_id = u.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment view count
    await query('UPDATE properties SET views_count = views_count + 1 WHERE id = $1', [id]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Property get error:', err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create property (PM-001, PM-002, PM-003, PM-008)
router.post('/', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const {
      rega_ad_license,
      property_type,
      transaction_type,
      title_ar,
      title_en,
      description_ar,
      description_en,
      city,
      district,
      street,
      latitude,
      longitude,
      price,
      price_type = 'total',
      area_sqm,
      bedrooms,
      bathrooms,
      living_rooms,
      floor_number,
      total_floors,
      year_built,
      furnished,
      features,
      photos,
      video_url,
      virtual_tour_url,
      owner_contact_id,
    } = req.body;

    if (!rega_ad_license || !property_type || !transaction_type || !title_ar || !city || !district || !price) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['rega_ad_license', 'property_type', 'transaction_type', 'title_ar', 'city', 'district', 'price'],
      });
    }

    const result = await query<{ id: string }>(
      `INSERT INTO properties (
        rega_ad_license, property_type, transaction_type, status, title_ar, title_en,
        description_ar, description_en, city, district, street, latitude, longitude,
        price, price_type, area_sqm, bedrooms, bathrooms, living_rooms,
        floor_number, total_floors, year_built, furnished, features, photos,
        video_url, virtual_tour_url, listing_agent_id, owner_contact_id, listing_date
      ) VALUES ($1, $2, $3, 'active', $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, CURRENT_DATE)
      RETURNING id`,
      [
        rega_ad_license, property_type, transaction_type, title_ar, title_en || null,
        description_ar || null, description_en || null, city, district, street || null,
        latitude || null, longitude || null, price, price_type, area_sqm || null,
        bedrooms || null, bathrooms || null, living_rooms || null, floor_number || null,
        total_floors || null, year_built || null, furnished || null,
        features ? JSON.stringify(features) : null, photos ? JSON.stringify(photos || []) : null,
        video_url || null, virtual_tour_url || null, req.user!.userId, owner_contact_id || null,
      ]
    );

    res.status(201).json({ id: result.rows[0].id, message: 'Property created' });
  } catch (err) {
    console.error('Property create error:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
router.put('/:id', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowed = [
      'status', 'title_ar', 'title_en', 'description_ar', 'description_en',
      'city', 'district', 'street', 'latitude', 'longitude', 'price', 'price_type',
      'area_sqm', 'bedrooms', 'bathrooms', 'living_rooms', 'furnished', 'features',
      'photos', 'video_url', 'virtual_tour_url', 'expiration_date',
    ];

    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        if (key === 'features' || key === 'photos') {
          setClauses.push(`${key} = $${paramIndex++}`);
          values.push(JSON.stringify(updates[key]));
        } else {
          setClauses.push(`${key} = $${paramIndex++}`);
          values.push(updates[key]);
        }
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No valid updates' });
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(id);

    await query(
      `UPDATE properties SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    res.json({ message: 'Property updated' });
  } catch (err) {
    console.error('Property update error:', err);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
router.delete('/:id', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE properties SET status = $1 WHERE id = $2', ['withdrawn', id]);
    res.json({ message: 'Property withdrawn' });
  } catch (err) {
    console.error('Property delete error:', err);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

export default router;
