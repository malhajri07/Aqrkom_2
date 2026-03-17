import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router: Router = Router();

router.use(authMiddleware);

router.get('/kpis', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const isAdmin = req.user!.role === 'admin';
    const agentFilter = isAdmin ? '' : 'AND listing_agent_id = $1';
    const txAgentFilter = isAdmin ? '' : 'AND primary_agent_id = $1';
    const params = isAdmin ? [] : [userId];

    const [listingsResult, requestsResult, pipelineResult, commissionResult, contactsResult, tasksResult] = await Promise.all([
      query(`SELECT COUNT(*)::int as count FROM properties WHERE status = 'active' AND deleted_at IS NULL ${agentFilter}`, params),
      query(`SELECT COUNT(*)::int as count FROM property_requests WHERE status = 'open' AND deleted_at IS NULL`, []),
      query(`SELECT COALESCE(SUM(final_price), 0)::float as value FROM transactions WHERE status IN ('active', 'under_contract', 'pending_close') AND deleted_at IS NULL ${txAgentFilter}`, params),
      query(`SELECT COALESCE(SUM(commission_amount), 0)::float as earned FROM transactions WHERE status = 'closed' AND deleted_at IS NULL ${txAgentFilter}`, params),
      query(`SELECT COUNT(*)::int as count FROM contacts WHERE deleted_at IS NULL`, []),
      query(`SELECT COUNT(*)::int as count FROM tasks WHERE status IN ('pending', 'in_progress') ${isAdmin ? '' : 'AND (assigned_to = $1 OR assigned_to IS NULL)'}`, params),
    ]);

    res.json({
      activeListings: Number((listingsResult.rows[0] as Record<string, unknown>)?.count ?? 0),
      openRequests: Number((requestsResult.rows[0] as Record<string, unknown>)?.count ?? 0),
      pipelineValue: Number((pipelineResult.rows[0] as Record<string, unknown>)?.value ?? 0),
      commissionEarned: Number((commissionResult.rows[0] as Record<string, unknown>)?.earned ?? 0),
      totalContacts: Number((contactsResult.rows[0] as Record<string, unknown>)?.count ?? 0),
      pendingTasks: Number((tasksResult.rows[0] as Record<string, unknown>)?.count ?? 0),
    });
  } catch (err) {
    console.error('Dashboard KPIs error:', err);
    res.status(500).json({ error: 'Failed to fetch KPIs' });
  }
});

router.get('/pipeline-stages', async (_req, res) => {
  try {
    const result = await query('SELECT * FROM pipeline_stages ORDER BY stage_order');
    res.json(result.rows);
  } catch (err) {
    console.error('Pipeline stages error:', err);
    res.status(500).json({ error: 'Failed to fetch stages' });
  }
});

router.get('/pipeline-summary', async (_req, res) => {
  try {
    const result = await query(`
      SELECT ps.id, ps.name_ar, ps.name_en, ps.stage_order, ps.color,
             COUNT(c.id)::int as contact_count
      FROM pipeline_stages ps
      LEFT JOIN contacts c ON c.pipeline_stage_id = ps.id AND c.deleted_at IS NULL
      GROUP BY ps.id, ps.name_ar, ps.name_en, ps.stage_order, ps.color
      ORDER BY ps.stage_order
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Pipeline summary error:', err);
    res.status(500).json({ error: 'Failed to fetch pipeline summary' });
  }
});

router.get('/recent-activities', async (req: AuthRequest, res) => {
  try {
    const result = await query(`
      SELECT a.*, c.first_name_ar, c.last_name_ar, c.phone
      FROM activities a
      LEFT JOIN contacts c ON a.contact_id = c.id
      ORDER BY a.created_at DESC LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Recent activities error:', err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

router.get('/recent-properties', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const isAdmin = req.user!.role === 'admin';
    const filter = isAdmin ? '' : 'AND p.listing_agent_id = $1';
    const params = isAdmin ? [] : [userId];

    const result = await query(`
      SELECT p.id, p.title_ar, p.city, p.district, p.price, p.status, p.property_type,
             p.bedrooms, p.area_sqm, p.created_at
      FROM properties p
      WHERE p.deleted_at IS NULL ${filter}
      ORDER BY p.created_at DESC LIMIT 5
    `, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Recent properties error:', err);
    res.status(500).json({ error: 'Failed to fetch recent properties' });
  }
});

router.get('/reports-summary', async (req: AuthRequest, res) => {
  try {
    const [propertiesByType, propertiesByCity, transactionsByType, transactionsByStatus, monthlyRevenue] = await Promise.all([
      query(`SELECT property_type, COUNT(*)::int as count FROM properties WHERE deleted_at IS NULL GROUP BY property_type ORDER BY count DESC`),
      query(`SELECT city, COUNT(*)::int as count FROM properties WHERE deleted_at IS NULL GROUP BY city ORDER BY count DESC LIMIT 10`),
      query(`SELECT transaction_type, COUNT(*)::int as count FROM transactions WHERE deleted_at IS NULL GROUP BY transaction_type`),
      query(`SELECT status, COUNT(*)::int as count FROM transactions WHERE deleted_at IS NULL GROUP BY status`),
      query(`
        SELECT date_trunc('month', created_at) as month,
               COUNT(*)::int as deals,
               COALESCE(SUM(final_price), 0)::float as revenue,
               COALESCE(SUM(commission_amount), 0)::float as commission
        FROM transactions
        WHERE deleted_at IS NULL AND created_at >= NOW() - INTERVAL '12 months'
        GROUP BY month ORDER BY month
      `),
    ]);

    res.json({
      propertiesByType: propertiesByType.rows,
      propertiesByCity: propertiesByCity.rows,
      transactionsByType: transactionsByType.rows,
      transactionsByStatus: transactionsByStatus.rows,
      monthlyRevenue: monthlyRevenue.rows,
    });
  } catch (err) {
    console.error('Reports summary error:', err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

export default router;
