-- Seed data for development
-- Run after migrations

-- Default brokerage
INSERT INTO brokerages (id, name_ar, name_en, rega_license) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'مكتب عقاركم', 'Aqarkom Office', 'REGA-001')
ON CONFLICT DO NOTHING;

-- Admin user (password: admin123)
INSERT INTO users (id, email, phone, password_hash, role, first_name_ar, last_name_ar, nafath_verified, brokerage_id)
SELECT
  'b0000000-0000-0000-0000-000000000001',
  'admin@aqarkom.com',
  '+966500000001',
  '$2a$10$rQZ8K8K8K8K8K8K8K8K8KuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
  'admin',
  'مدير',
  'النظام',
  false,
  'a0000000-0000-0000-0000-000000000001'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@aqarkom.com');

-- Broker user (password: broker123)
INSERT INTO users (id, email, phone, password_hash, role, first_name_ar, last_name_ar, rega_license_number, nafath_verified, brokerage_id, active_neighborhoods)
SELECT
  'b0000000-0000-0000-0000-000000000002',
  'broker@aqarkom.com',
  '+966500000002',
  '$2a$10$rQZ8K8K8K8K8K8K8K8K8KuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
  'broker',
  'أحمد',
  'الوسيط',
  'REGA-BROKER-001',
  false,
  'a0000000-0000-0000-0000-000000000001',
  '["النرجس", "الروضة", "العليا"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'broker@aqarkom.com');
