/**
 * Seed development database - run with: pnpm db:seed
 * Login: admin@aqarkom.com / Test123!
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { query } from './db.js';

async function seed() {
  const hash = await bcrypt.hash('Test123!', 10);

  await query(`
    INSERT INTO brokerages (id, name_ar, name_en) VALUES
      ('a0000000-0000-0000-0000-000000000001', 'مكتب عقاركم', 'Aqarkom Office')
    ON CONFLICT (id) DO NOTHING
  `);

  await query(
    `INSERT INTO users (id, email, phone, password_hash, role, first_name_ar, last_name_ar, nafath_verified, brokerage_id)
     VALUES ($1, $2, $3, $4, 'admin', 'مدير', 'النظام', false, 'a0000000-0000-0000-0000-000000000001')
     ON CONFLICT (email) DO NOTHING`,
    ['b0000000-0000-0000-0000-000000000001', 'admin@aqarkom.com', '+966500000001', hash]
  );

  await query(
    `INSERT INTO users (id, email, phone, password_hash, role, first_name_ar, last_name_ar, rega_license_number, nafath_verified, brokerage_id, active_neighborhoods)
     VALUES ($1, $2, $3, $4, 'broker', 'أحمد', 'الوسيط', 'REGA-BROKER-001', false, 'a0000000-0000-0000-0000-000000000001', '["النرجس", "الروضة", "العليا"]'::jsonb)
     ON CONFLICT (email) DO NOTHING`,
    ['b0000000-0000-0000-0000-000000000002', 'broker@aqarkom.com', '+966500000002', hash]
  );

  console.log('Seed complete. Login: admin@aqarkom.com / Test123!');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
