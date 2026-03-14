import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware, AuthRequest, requireRole } from '../middleware/auth.js';

const router: Router = Router();

router.use(authMiddleware);
router.use(requireRole('admin'));

router.get('/stats', async (_req, res) => {
  try {
    const [users, properties, transactions, requests, contacts, unverified] = await Promise.all([
      query('SELECT COUNT(*)::int as count FROM users'),
      query('SELECT COUNT(*)::int as count FROM properties'),
      query('SELECT COUNT(*)::int as count FROM transactions'),
      query('SELECT COUNT(*)::int as count FROM property_requests'),
      query('SELECT COUNT(*)::int as count FROM contacts'),
      query(`SELECT COUNT(*)::int as count FROM contacts WHERE notes LIKE '%[UNVERIFIED LISTING]%'`),
    ]);

    res.json({
      totalUsers: Number((users.rows[0] as Record<string, unknown>)?.count ?? 0),
      totalProperties: Number((properties.rows[0] as Record<string, unknown>)?.count ?? 0),
      totalTransactions: Number((transactions.rows[0] as Record<string, unknown>)?.count ?? 0),
      totalRequests: Number((requests.rows[0] as Record<string, unknown>)?.count ?? 0),
      totalContacts: Number((contacts.rows[0] as Record<string, unknown>)?.count ?? 0),
      unverifiedListings: Number((unverified.rows[0] as Record<string, unknown>)?.count ?? 0),
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/users', async (_req, res) => {
  try {
    const result = await query(
      'SELECT id, email, phone, role, first_name_ar, last_name_ar, is_active, created_at FROM users ORDER BY created_at DESC LIMIT 50'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Admin users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/unverified-listings', async (_req, res) => {
  try {
    const result = await query(
      `SELECT id, first_name_ar, last_name_ar, phone, email, notes, created_at
       FROM contacts WHERE notes LIKE '%[UNVERIFIED LISTING]%'
       ORDER BY created_at DESC LIMIT 50`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Admin unverified listings error:', err);
    res.status(500).json({ error: 'Failed to fetch unverified listings' });
  }
});

export default router;
