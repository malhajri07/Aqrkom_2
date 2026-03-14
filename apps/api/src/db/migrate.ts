/**
 * Run migrations - execute SQL files in order
 */
import 'dotenv/config';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://aqarkom:aqarkom@localhost:5432/aqarkom',
});

async function migrate() {
  const client = await pool.connect();
  const migrationsDir = join(process.cwd(), '../../db/migrations');
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    console.log(`Running ${file}...`);
    const sql = readFileSync(join(migrationsDir, file), 'utf-8');
    try {
      await client.query(sql);
      console.log(`  OK`);
    } catch (err) {
      console.error(`  Error:`, err);
      throw err;
    }
  }

  client.release();
  await pool.end();
  console.log('Migrations complete.');
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
