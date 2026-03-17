import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { query } from '../db.js';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';
import { validateRegaLicense } from '../integrations/rega/rega.service.js';
import { addPropertyPhotosJob } from '../queues/index.js';
import { propertyCreateSchema, propertyUpdateSchema } from '@aqarkom/shared';

const router: Router = Router();
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'properties');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (/\.(jpg|jpeg|png|webp|gif)$/i.test(file.originalname)) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
});

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
      WHERE p.deleted_at IS NULL
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

// Upload photos (PM-004) - must be before /:id
router.post('/:id/photos', requireRole('admin', 'broker', 'agent'), upload.array('photos', 50), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const files = (req as unknown as { files: Express.Multer.File[] }).files;
    if (!files?.length) return res.status(400).json({ error: 'No photos uploaded' });

    const r = await query<{ photos: unknown; listing_agent_id: string }>('SELECT photos, listing_agent_id FROM properties WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Property not found' });
    if (req.user?.role !== 'admin' && r.rows[0].listing_agent_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const baseUrl = '/uploads/properties/';
    const existing = (r.rows[0].photos as string[]) || [];
    const newUrls = files.map((f) => baseUrl + f.filename);
    const updated = [...existing, ...newUrls];

    await query('UPDATE properties SET photos = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(updated), id]);
    addPropertyPhotosJob(id, newUrls);
    res.json({ photos: updated, added: newUrls.length });
  } catch (err) {
    console.error('Photo upload error:', err);
    res.status(500).json({ error: 'Failed to upload photos' });
  }
});

// Delete single photo (PM-004)
router.delete('/:id/photos/:photoId', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id, photoId } = req.params;
    const r = await query<{ photos: string[]; listing_agent_id: string }>('SELECT photos, listing_agent_id FROM properties WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Property not found' });
    if (req.user?.role !== 'admin' && r.rows[0].listing_agent_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const photos = (r.rows[0].photos as string[]) || [];
    const filtered = photos.filter((p) => p !== photoId && !p.endsWith(photoId) && p !== `/uploads/properties/${photoId}`);
    if (filtered.length === photos.length) return res.status(404).json({ error: 'Photo not found' });
    await query('UPDATE properties SET photos = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(filtered), id]);
    res.json({ photos: filtered, message: 'Photo removed' });
  } catch (err) {
    console.error('Photo delete error:', err);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// Reorder photos (PM-004)
router.put('/:id/photos/reorder', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { photos } = req.body as { photos: string[] };
    if (!Array.isArray(photos)) return res.status(400).json({ error: 'photos array required' });

    const r = await query('SELECT listing_agent_id FROM properties WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Property not found' });
    if (req.user?.role !== 'admin' && r.rows[0].listing_agent_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await query('UPDATE properties SET photos = $1, updated_at = NOW() WHERE id = $2', [JSON.stringify(photos), id]);
    res.json({ photos, message: 'Photos reordered' });
  } catch (err) {
    console.error('Photo reorder error:', err);
    res.status(500).json({ error: 'Failed to reorder photos' });
  }
});

// Map GeoJSON (PM-006) - must be before /:id
router.get('/map', async (req: AuthRequest, res) => {
  try {
    const { city, status = 'active' } = req.query;
    let sql = `SELECT id, title_ar, title_en, city, district, price, property_type, transaction_type, latitude, longitude, photos
               FROM properties WHERE status = $1 AND deleted_at IS NULL AND latitude IS NOT NULL AND longitude IS NOT NULL`;
    const params: unknown[] = [status];
    if (city) {
      sql += ` AND city = $2`;
      params.push(city);
    }
    const result = await query(sql, params);
    const features = result.rows.map((r) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [Number(r.longitude), Number(r.latitude)] },
      properties: {
        id: r.id,
        title_ar: r.title_ar,
        title_en: r.title_en,
        city: r.city,
        district: r.district,
        price: r.price,
        property_type: r.property_type,
        transaction_type: r.transaction_type,
        photos: r.photos,
      },
    }));
    res.json({ type: 'FeatureCollection', features });
  } catch (err) {
    console.error('Properties map error:', err);
    res.status(500).json({ error: 'Failed to fetch map data' });
  }
});

// Neighborhood stats (PM-006)
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const { city } = req.query;
    let sql = `
      SELECT city, district,
             COUNT(*)::int as count,
             ROUND(AVG(price)::numeric, 0) as avg_price,
             MIN(price) as min_price,
             MAX(price) as max_price
      FROM properties
      WHERE status = 'active' AND deleted_at IS NULL
    `;
    const params: unknown[] = [];
    if (city) {
      sql += ` AND city = $1`;
      params.push(city);
    }
    sql += ` GROUP BY city, district ORDER BY count DESC`;
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Properties stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Full-text Arabic search (PM-006)
router.get('/search', async (req: AuthRequest, res) => {
  try {
    const { q, city, limit = 20 } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query required (min 2 chars)' });
    }
    const term = `%${String(q).trim()}%`;
    let sql = `
      SELECT p.id, p.title_ar, p.title_en, p.city, p.district, p.price, p.property_type, p.transaction_type, p.status, p.photos
      FROM properties p
      WHERE p.status = 'active' AND p.deleted_at IS NULL
        AND (p.title_ar ILIKE $1 OR p.title_en ILIKE $1 OR p.description_ar ILIKE $1 OR p.city ILIKE $1 OR p.district ILIKE $1)
    `;
    const params: unknown[] = [term];
    let idx = 2;
    if (city) {
      sql += ` AND p.city = $${idx++}`;
      params.push(city);
    }
    sql += ` ORDER BY p.listing_date DESC LIMIT $${idx}`;
    params.push(Number(limit));
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Properties search error:', err);
    res.status(500).json({ error: 'Failed to search properties' });
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
       WHERE p.id = $1 AND p.deleted_at IS NULL`,
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
router.post('/', requireRole('admin', 'broker', 'agent'), auditLog('property.create', 'property'), async (req: AuthRequest, res) => {
  try {
    const parsed = propertyCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg, message_en: msg });
    }
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
      video_url,
      virtual_tour_url,
    } = parsed.data;
    const { photos, owner_contact_id } = req.body as { photos?: unknown; owner_contact_id?: string };

    const regaCheck = await validateRegaLicense(rega_ad_license);
    if (!regaCheck.valid) {
      return res.status(400).json({ error: regaCheck.error, message_en: regaCheck.error });
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

// PATCH status only (PM-008)
router.patch('/:id/status', requireRole('admin', 'broker', 'agent'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status?: string };
    const valid = ['active', 'pending', 'under_contract', 'sold', 'leased', 'withdrawn', 'expired'];
    if (!status || !valid.includes(status)) {
      return res.status(400).json({ error: 'Invalid status', valid });
    }
    const r = await query<{ listing_agent_id: string }>('SELECT listing_agent_id FROM properties WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (!r.rows[0]) return res.status(404).json({ error: 'Property not found' });
    if (req.user?.role !== 'admin' && r.rows[0].listing_agent_id !== req.user?.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await query('UPDATE properties SET status = $1, updated_at = NOW() WHERE id = $2', [status, id]);
    res.json({ status, message: 'Status updated' });
  } catch (err) {
    console.error('Property status error:', err);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Update property
router.put('/:id', requireRole('admin', 'broker', 'agent'), auditLog('property.update', 'property'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const parsed = propertyUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg, message_en: msg });
    }
    const updates = parsed.data as Record<string, unknown>;

    const allowed = [
      'status', 'title_ar', 'title_en', 'description_ar', 'description_en',
      'city', 'district', 'street', 'latitude', 'longitude', 'price', 'price_type',
      'area_sqm', 'bedrooms', 'bathrooms', 'living_rooms', 'furnished', 'features',
      'photos', 'video_url', 'virtual_tour_url', 'expiration_date', 'rega_ad_license',
    ];

    if (updates.rega_ad_license !== undefined) {
      const regaCheck = await validateRegaLicense(String(updates.rega_ad_license));
      if (!regaCheck.valid) {
        return res.status(400).json({ error: regaCheck.error, message_en: regaCheck.error });
      }
    }

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
router.delete('/:id', requireRole('admin', 'broker', 'agent'), auditLog('property.withdraw', 'property'), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await query('UPDATE properties SET status = $1, deleted_at = NOW(), updated_at = NOW() WHERE id = $2', ['withdrawn', id]);
    res.json({ message: 'Property withdrawn' });
  } catch (err) {
    console.error('Property delete error:', err);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

export default router;
