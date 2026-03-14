/**
 * Aqarkom API - Saudi Real Estate CRM Backend
 * Based on PRD: RealEstate_CRM_PRD_Saudi_Comprehensive.xlsx
 */

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import propertiesRoutes from './routes/properties.js';
import contactsRoutes from './routes/contacts.js';
import requestsRoutes from './routes/requests.js';
import transactionsRoutes from './routes/transactions.js';
import tasksRoutes from './routes/tasks.js';
import activitiesRoutes from './routes/activities.js';
import dashboardRoutes from './routes/dashboard.js';

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

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/requests', requestsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Aqarkom API running at http://localhost:${PORT}`);
});
