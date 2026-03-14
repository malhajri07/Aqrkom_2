/**
 * Aqarkom API - Saudi Real Estate CRM Backend
 * Based on PRD: RealEstate_CRM_PRD_Saudi_Comprehensive.xlsx
 */

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    app: 'Aqarkom API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API info
app.get('/api', (_req, res) => {
  res.json({
    name: 'Aqarkom API',
    description: 'Arabic-first Saudi Real Estate CRM',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      properties: '/api/properties (coming soon)',
      requests: '/api/requests (coming soon)',
      contacts: '/api/contacts (coming soon)',
    },
  });
});

app.listen(PORT, () => {
  console.log(`Aqarkom API running at http://localhost:${PORT}`);
});
