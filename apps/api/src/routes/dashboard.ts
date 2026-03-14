import { Router } from 'express';
import { query } from '../db.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router: Router = Router();

router.use(authMiddleware);

// RPT-001: Broker Dashboard KPIs
router.get('/kpis', async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.userId;
    const isAdmin = req.user!.role === 'admin';

    const agentFilter = isAdmin ? '' : 'AND listing_agent_id = $1';
    const params = isAdmin ? [] : [userId];

    const [listingsResult, requestsResult, pipelineResult, commissionResult] = await Promise.all([
      query(
        `SELECT COUNT(*)::int as count FROM properties WHERE status = 'active' ${agentFilter}`,
        params
      ),
      query(
        `SELECT COUNT(*)::int as count FROM property_requests WHERE status = 'open'`,
        []
      ),
      query(
        `SELECT COALESCE(SUM(final_price), 0)::float as value FROM transactions 
         WHERE status IN ('active', 'under_contract', 'pending_close') ${isAdmin ? '' : 'AND primary_agent_id = $1'}`,
        params
      ),
      query(
        `SELECT COALESCE(SUM(commission_amount), 0)::float as earned FROM transactions 
         WHERE status = 'closed' ${isAdmin ? '' : 'AND primary_agent_id = $1'}`,
        params
      ),
    ]);

    const lr = listingsResult.rows[0] as { count?: number } | undefined;
    const rr = requestsResult.rows[0] as { count?: number } | undefined;
    const pr = pipelineResult.rows[0] as { value?: number } | undefined;
    const cr = commissionResult.rows[0] as { earned?: number } | undefined;
    res.json({
      activeListings: Number(lr?.count ?? 0),
      openRequests: Number(rr?.count ?? 0),
      pipelineValue: Number(pr?.value ?? 0),
      commissionEarned: Number(cr?.earned ?? 0),
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

export default router;
