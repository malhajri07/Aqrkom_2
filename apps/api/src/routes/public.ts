import { Router } from 'express';
import { query } from '../db.js';
import { publicRequestSubmitSchema } from '@aqarkom/shared';

const router: Router = Router();

router.get('/properties', async (req, res) => {
  try {
    const { city, district, property_type, transaction_type, min_price, max_price, bedrooms } = req.query;
    let sql = `SELECT id, title_ar, title_en, city, district, price, price_type, property_type, transaction_type,
               area_sqm, bedrooms, bathrooms, status, photos, latitude, longitude, listing_date
               FROM properties WHERE status = 'active' AND deleted_at IS NULL`;
    const params: unknown[] = [];
    let idx = 1;

    if (city) { sql += ` AND city = $${idx++}`; params.push(city); }
    if (district) { sql += ` AND district ILIKE $${idx++}`; params.push(`%${district}%`); }
    if (property_type) { sql += ` AND property_type = $${idx++}`; params.push(property_type); }
    if (transaction_type) { sql += ` AND transaction_type = $${idx++}`; params.push(transaction_type); }
    if (min_price) { sql += ` AND price >= $${idx++}`; params.push(Number(min_price)); }
    if (max_price) { sql += ` AND price <= $${idx++}`; params.push(Number(max_price)); }
    if (bedrooms) { sql += ` AND bedrooms >= $${idx++}`; params.push(Number(bedrooms)); }

    sql += ' ORDER BY listing_date DESC LIMIT 100';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Public properties error:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

router.post('/requests', async (req, res) => {
  try {
    const parsed = publicRequestSubmitSchema.safeParse(req.body);
    if (!parsed.success) {
      const msg = parsed.error.errors.map((e) => e.message).join('; ');
      return res.status(400).json({ error: msg, message_en: msg });
    }
    const { name, phone, email, request_type, property_type, city, districts, budget_min, budget_max, bedrooms_min, description } = parsed.data;

    const result = await query<{ id: string }>(
      `INSERT INTO property_requests (seeker_id, request_type, property_type, city, districts, budget_min, budget_max, bedrooms_min, additional_requirements, status)
       VALUES ((SELECT id FROM users LIMIT 1), $1, $2, $3, $4, $5, $6, $7, $8, 'open')
       RETURNING id`,
      [
        request_type ?? 'buy',
        property_type ?? 'apartment',
        city ?? 'الرياض',
        JSON.stringify(Array.isArray(districts) ? districts : districts ? [districts] : [city ?? 'الرياض']),
        budget_min ? Number(budget_min) : null,
        Number(budget_max),
        bedrooms_min ? Number(bedrooms_min) : null,
        `${name} | ${phone} | ${email || ''} | ${description || ''}`,
      ]
    );

    res.status(201).json({ id: result.rows[0].id, message: 'Request submitted', reference: result.rows[0].id.slice(0, 8).toUpperCase() });
  } catch (err) {
    console.error('Public request error:', err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

router.post('/unverified-listings', async (req, res) => {
  try {
    const { owner_name, owner_phone, owner_email, property_type, transaction_type, city, district, description, estimated_price } = req.body;
    if (!owner_name || !owner_phone || !city) {
      return res.status(400).json({ error: 'owner_name, owner_phone, city required' });
    }

    const result = await query<{ id: string }>(
      `INSERT INTO contacts (contact_type, first_name_ar, last_name_ar, phone, email, lead_source, notes)
       VALUES ('seller', $1, $2, $3, $4, 'website', $5)
       RETURNING id`,
      [
        owner_name.split(' ')[0] || owner_name,
        owner_name.split(' ').slice(1).join(' ') || '-',
        owner_phone,
        owner_email || null,
        `[UNVERIFIED LISTING] ${property_type || 'unknown'} | ${transaction_type || 'sale'} | ${city} ${district || ''} | ${estimated_price || 'N/A'} SAR | ${description || ''}`,
      ]
    );

    res.status(201).json({ id: result.rows[0].id, message: 'Listing submitted. A broker will contact you.', reference: result.rows[0].id.slice(0, 8).toUpperCase() });
  } catch (err) {
    console.error('Unverified listing error:', err);
    res.status(500).json({ error: 'Failed to submit listing' });
  }
});

export default router;
