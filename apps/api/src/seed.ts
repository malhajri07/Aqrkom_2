/**
 * Seed development database - run with: pnpm db:seed
 * Users (password: Test123!):
 *   admin@aqarkom.com, broker@aqarkom.com, broker2@aqarkom.com, broker3@aqarkom.com
 */
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { query } from './db.js';

const BROKERAGE_ID = 'a0000000-0000-0000-0000-000000000001';
const ADMIN_ID = 'b0000000-0000-0000-0000-000000000001';
const BROKER_ID = 'b0000000-0000-0000-0000-000000000002';
const BROKER2_ID = 'b0000000-0000-0000-0000-000000000003';
const BROKER3_ID = 'b0000000-0000-0000-0000-000000000004';
const SEEKER_ID = 'b0000000-0000-0000-0000-000000000005';

const uuid = (n: number, prefix: string) =>
  `${prefix}${n.toString(16).padStart(7, '0')}-0000-4000-8000-${n.toString(16).padStart(12, '0')}`;

async function seed() {
  const hash = await bcrypt.hash('Test123!', 10);

  // Brokerage
  await query(`
    INSERT INTO brokerages (id, name_ar, name_en) VALUES
      ($1, 'مكتب عقاركم', 'Aqarkom Office')
    ON CONFLICT (id) DO NOTHING
  `, [BROKERAGE_ID]);

  // Users: admin, broker, broker2, broker3, seeker
  await query(
    `INSERT INTO users (id, email, phone, password_hash, role, first_name_ar, last_name_ar, nafath_verified, brokerage_id)
     VALUES ($1, $2, $3, $4, 'admin', 'مدير', 'النظام', false, $5)
     ON CONFLICT (email) DO NOTHING`,
    [ADMIN_ID, 'admin@aqarkom.com', '+966500000001', hash, BROKERAGE_ID]
  );
  await query(
    `INSERT INTO users (id, email, phone, password_hash, role, first_name_ar, last_name_ar, rega_license_number, nafath_verified, brokerage_id, active_neighborhoods)
     VALUES ($1, $2, $3, $4, 'broker', 'أحمد', 'الوسيط', 'REGA-BROKER-001', false, $5, '["النرجس", "الروضة", "العليا"]'::jsonb)
     ON CONFLICT (email) DO NOTHING`,
    [BROKER_ID, 'broker@aqarkom.com', '+966500000002', hash, BROKERAGE_ID]
  );
  await query(
    `INSERT INTO users (id, email, phone, password_hash, role, first_name_ar, last_name_ar, rega_license_number, nafath_verified, brokerage_id, active_neighborhoods)
     VALUES ($1, $2, $3, $4, 'broker', 'سارة', 'المحمد', 'REGA-BROKER-002', false, $5, '["الملقا", "الورود", "الياسمين"]'::jsonb)
     ON CONFLICT (email) DO NOTHING`,
    [BROKER2_ID, 'broker2@aqarkom.com', '+966500000003', hash, BROKERAGE_ID]
  );
  await query(
    `INSERT INTO users (id, email, phone, password_hash, role, first_name_ar, last_name_ar, rega_license_number, nafath_verified, brokerage_id, active_neighborhoods)
     VALUES ($1, $2, $3, $4, 'broker', 'خالد', 'العتيبي', 'REGA-BROKER-003', false, $5, '["النسيم", "الروابي", "الخليج"]'::jsonb)
     ON CONFLICT (email) DO NOTHING`,
    [BROKER3_ID, 'broker3@aqarkom.com', '+966500000004', hash, BROKERAGE_ID]
  );
  await query(
    `INSERT INTO users (id, email, phone, password_hash, role, first_name_ar, last_name_ar, nafath_verified, brokerage_id)
     VALUES ($1, $2, $3, $4, 'seeker', 'محمد', 'الباحث', false, $5)
     ON CONFLICT (email) DO NOTHING`,
    [SEEKER_ID, 'seeker@aqarkom.com', '+966500000005', hash, BROKERAGE_ID]
  );

  // Pipeline stages (if not exist)
  const stages = await query<{ id: string }>(`SELECT id FROM pipeline_stages LIMIT 1`);
  let stageIds: string[] = [];
  if (stages.rows.length === 0) {
    const ins = await query<{ id: string }>(`
      INSERT INTO pipeline_stages (name_ar, name_en, stage_order, color) VALUES
        ('جديد', 'New', 1, '#3b82f6'),
        ('تم التواصل', 'Contacted', 2, '#8b5cf6'),
        ('مؤهل', 'Qualified', 3, '#06b6d4'),
        ('عرض', 'Showing', 4, '#f59e0b'),
        ('عرض مقدم', 'Offer', 5, '#10b981'),
        ('مغلق/خاسر', 'Closed/Lost', 6, '#6b7280')
      RETURNING id
    `);
    stageIds = ins.rows.map((r) => r.id);
  } else {
    const all = await query<{ id: string }>(`SELECT id FROM pipeline_stages ORDER BY stage_order`);
    stageIds = all.rows.map((r) => r.id);
  }
  const newStageId = stageIds[0] || null;
  const qualifiedStageId = stageIds[2] || stageIds[0] || null;

  // Contacts
  const contactIds: string[] = [];
  const contactsData = [
    { type: 'buyer' as const, first: 'عبدالله', last: 'الراشد', phone: '+966501111111', agent: BROKER_ID },
    { type: 'seller' as const, first: 'فاطمة', last: 'السعيد', phone: '+966502222222', agent: BROKER_ID },
    { type: 'tenant' as const, first: 'نورة', last: 'الغامدي', phone: '+966503333333', agent: BROKER2_ID },
    { type: 'landlord' as const, first: 'عمر', last: 'الزهراني', phone: '+966504444444', agent: BROKER2_ID },
    { type: 'buyer' as const, first: 'ريم', last: 'القحطاني', phone: '+966505555555', agent: BROKER3_ID },
    { type: 'investor' as const, first: 'سعود', last: 'الدوسري', phone: '+966506666666', agent: BROKER3_ID },
  ];
  for (let i = 0; i < contactsData.length; i++) {
    const c = contactsData[i];
    const id = uuid(i + 1, 'c');
    await query(
      `INSERT INTO contacts (id, contact_type, first_name_ar, last_name_ar, phone, lead_source, lead_status, assigned_agent_id, pipeline_stage_id)
       VALUES ($1, $2, $3, $4, $5, 'website', 'qualified', $6, $7)
       ON CONFLICT (id) DO NOTHING`,
      [id, c.type, c.first, c.last, c.phone, c.agent, i % 2 === 0 ? newStageId : qualifiedStageId]
    );
    contactIds.push(id);
  }

  // Properties
  const propertyIds: string[] = [];
  const propsData = [
    { title: 'شقة فاخرة في النرجس', city: 'الرياض', district: 'النرجس', type: 'apartment', trans: 'sale', price: 850000, area: 120, beds: 3, agent: BROKER_ID },
    { title: 'فيلا مستقلة بالروضة', city: 'الرياض', district: 'الروضة', type: 'villa', trans: 'sale', price: 2100000, area: 350, beds: 5, agent: BROKER_ID },
    { title: 'شقة للإيجار السنوي - العليا', city: 'الرياض', district: 'العليا', type: 'apartment', trans: 'annual_rent', price: 60000, area: 95, beds: 2, agent: BROKER2_ID },
    { title: 'أرض سكنية - الملقا', city: 'الرياض', district: 'الملقا', type: 'land', trans: 'sale', price: 450000, area: 500, beds: 0, agent: BROKER2_ID },
    { title: 'مكتب تجاري - الورود', city: 'الرياض', district: 'الورود', type: 'office', trans: 'monthly_rent', price: 8000, area: 80, beds: 0, agent: BROKER2_ID },
    { title: 'شاليه - الخليج', city: 'الدمام', district: 'الخليج', type: 'chalet', trans: 'daily_rent', price: 1500, area: 150, beds: 4, agent: BROKER3_ID },
    { title: 'عمارة كاملة - النسيم', city: 'جدة', district: 'النسيم', type: 'building', trans: 'sale', price: 5500000, area: 1200, beds: 0, agent: BROKER3_ID },
    { title: 'شقة عائلية - الروابي', city: 'الرياض', district: 'الروابي', type: 'apartment', trans: 'annual_rent', price: 72000, area: 140, beds: 4, agent: BROKER3_ID },
  ];
  for (let i = 0; i < propsData.length; i++) {
    const p = propsData[i];
    const id = uuid(i + 1, '1');
    await query(
      `INSERT INTO properties (id, rega_ad_license, property_type, transaction_type, status, title_ar, city, district, price, price_type, area_sqm, bedrooms, listing_agent_id, listing_date)
       VALUES ($1, $2, $3, $4, 'active', $5, $6, $7, $8, 'total', $9, $10, $11, CURRENT_DATE)
       ON CONFLICT (id) DO NOTHING`,
      [id, `REGA-${1000 + i}`, p.type, p.trans, p.title, p.city, p.district, p.price, p.area || null, p.beds || null, p.agent]
    );
    propertyIds.push(id);
  }

  // Property requests (from seeker)
  const requestIds: string[] = [];
  const reqsData = [
    { type: 'buy', propType: 'apartment', city: 'الرياض', budgetMax: 900000, beds: 3 },
    { type: 'rent_annual', propType: 'villa', city: 'الرياض', budgetMax: 100000, beds: 4 },
  ];
  for (let i = 0; i < reqsData.length; i++) {
    const r = reqsData[i];
    const id = uuid(i + 1, '3');
    await query(
      `INSERT INTO property_requests (id, seeker_id, request_type, property_type, city, districts, budget_max, bedrooms_min, status)
       VALUES ($1, $2, $3, $4, $5, '["النرجس","الروضة"]'::jsonb, $6, $7, 'open')
       ON CONFLICT (id) DO NOTHING`,
      [id, SEEKER_ID, r.type, r.propType, r.city, r.budgetMax, r.beds]
    );
    requestIds.push(id);
  }

  // Transactions
  const transIds: string[] = [];
  const transData = [
    { propIdx: 0, contactIdx: 0, agent: BROKER_ID, status: 'closed' as const, finalPrice: 820000 },
    { propIdx: 2, contactIdx: 2, agent: BROKER2_ID, status: 'active' as const, finalPrice: 58000 },
    { propIdx: 5, contactIdx: 3, agent: BROKER3_ID, status: 'under_contract' as const, finalPrice: null },
  ];
  for (let i = 0; i < transData.length; i++) {
    const t = transData[i];
    const id = uuid(i + 1, '4');
    const transType = t.propIdx === 1 ? 'rent' : 'sale';
    await query(
      `INSERT INTO transactions (id, transaction_type, status, property_id, primary_agent_id, client_contact_id, list_price, final_price, commission_rate, commission_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 0.025, $9)
       ON CONFLICT (id) DO NOTHING`,
      [
        id,
        transType,
        t.status,
        propertyIds[t.propIdx],
        t.agent,
        contactIds[t.contactIdx],
        t.finalPrice || 0,
        t.finalPrice,
        t.finalPrice ? Math.round((t.finalPrice || 0) * 0.025) : 0,
      ]
    );
    transIds.push(id);
  }

  // Activities
  for (let i = 0; i < 4; i++) {
    await query(
      `INSERT INTO activities (contact_id, activity_type, subject, created_by)
       VALUES ($1, $2, $3, $4)`,
      [contactIds[i % contactIds.length], ['call', 'whatsapp', 'showing', 'note'][i], `نشاط تجريبي ${i + 1}`, BROKER_ID]
    );
  }

  // Tasks
  const taskTitles = ['متابعة عميل - عبدالله', 'ترتيب معاينة - فاطمة', 'إرسال عقد - نورة', 'تحديث السعر - شقة النرجس'];
  for (let i = 0; i < taskTitles.length; i++) {
    await query(
      `INSERT INTO tasks (title, status, priority, assigned_to, contact_id, created_by)
       VALUES ($1, 'pending', 'medium', $2, $3, $2)`,
      [taskTitles[i], i % 2 === 0 ? BROKER_ID : BROKER2_ID, contactIds[i % contactIds.length]]
    );
  }

  // Rent payment (for transaction 2 - rental)
  await query(
    `INSERT INTO rent_payments (transaction_id, amount, payment_date, status)
     VALUES ($1, 4833, (CURRENT_DATE - INTERVAL '15 days')::date, 'paid')`,
    [transIds[1]]
  );

  console.log(`
Seed complete!

Users (password: Test123!):
  - admin@aqarkom.com
  - broker@aqarkom.com
  - broker2@aqarkom.com
  - broker3@aqarkom.com
  - seeker@aqarkom.com (property seeker)

Data: ${contactsData.length} contacts, ${propsData.length} properties, ${reqsData.length} requests, ${transData.length} transactions, activities, tasks
`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
