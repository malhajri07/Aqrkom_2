/**
 * Seed development database with test user
 * Password: Test123!
 */
import bcrypt from 'bcryptjs';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://aqarkom:aqarkom@localhost:5432/aqarkom',
});

async function seed() {
  const client = await pool.connect();
  try {
    const hash = await bcrypt.hash('Test123!', 10);

    await client.query(`
      INSERT INTO brokerages (id, name_ar, name_en) VALUES
        ('a0000000-0000-0000-0000-000000000001', 'مكتب عقاركم', 'Aqarkom Office')
      ON CONFLICT DO NOTHING
    `);

    await client.query(`
      INSERT INTO users (id, email, phone, password_hash, role, first_name_ar, last_name_ar, nafath_verified, brokerage_id)
      VALUES (
        'b0000000-0000-0000-0000-000000000001',
        'admin@aqarkom.com',
        '+966500000001',
        $1,
        'admin',
        'مدير',
        'النظام',
        false,
        'a0000000-0000-0000-0000-000000000001'
      )
      ON CONFLICT (email) DO NOTHING
    `, [hash]);

    await client.query(`
      INSERT INTO users (id, email, phone, password_hash, role, first_name_ar, last_name_ar, rega_license_number, nafath_verified, brokerage_id, active_neighborhoods)
      VALUES (
        'b0000000-0000-0000-0000-000000000002',
        'broker@aqarkom.com',
        '+966500000002',
        $1,
        'broker',
        'أحمد',
        'الوسيط',
        'REGA-BROKER-001',
        false,
        'a0000000-0000-0000-0000-000000000001',
        '["النرجس", "الروضة", "العليا"]'::jsonb
      )
      ON CONFLICT (email) DO NOTHING
    `, [hash]);

    console.log('Seed complete. Login: admin@aqarkom.com / Test123!');
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);
