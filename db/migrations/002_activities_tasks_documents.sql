-- Activities, Tasks, Documents, Offers, Pipeline - PRD CRM-004, CRM-005, DOC-001, TM-004

-- Activities (CRM-004 - Activity Timeline)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- call, whatsapp, email, showing, note, meeting
  subject VARCHAR(500),
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_activities_contact ON activities(contact_id);
CREATE INDEX idx_activities_created ON activities(created_at);

-- Tasks (CRM-005 - Task Management)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, overdue, cancelled
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
  due_date TIMESTAMPTZ,
  assigned_to UUID REFERENCES users(id),
  contact_id UUID REFERENCES contacts(id),
  property_id UUID REFERENCES properties(id),
  transaction_id UUID REFERENCES transactions(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_tasks_due ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);

-- Pipeline stages for leads (CRM-006)
CREATE TABLE pipeline_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100),
  stage_order INT NOT NULL,
  color VARCHAR(20)
);

INSERT INTO pipeline_stages (name_ar, name_en, stage_order, color) VALUES
  ('جديد', 'New', 1, '#3b82f6'),
  ('تم التواصل', 'Contacted', 2, '#8b5cf6'),
  ('مؤهل', 'Qualified', 3, '#06b6d4'),
  ('عرض', 'Showing', 4, '#f59e0b'),
  ('عرض مقدم', 'Offer', 5, '#10b981'),
  ('مغلق/خاسر', 'Closed/Lost', 6, '#6b7280');

-- Lead pipeline (link contacts to stages)
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS pipeline_stage_id UUID REFERENCES pipeline_stages(id);
CREATE INDEX IF NOT EXISTS idx_contacts_pipeline ON contacts(pipeline_stage_id);

-- Property offers (TM-004 - Offer Management)
CREATE TABLE property_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  transaction_id UUID REFERENCES transactions(id),
  buyer_contact_id UUID NOT NULL REFERENCES contacts(id),
  offer_amount DECIMAL(15,2) NOT NULL,
  offer_type VARCHAR(20) DEFAULT 'purchase', -- purchase, lease
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, accepted, rejected, countered, expired
  counter_amount DECIMAL(15,2),
  counter_notes TEXT,
  expiry_date DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_property_offers_property ON property_offers(property_id);
CREATE INDEX idx_property_offers_status ON property_offers(status);

-- Documents (DOC-001)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  file_path VARCHAR(1000) NOT NULL,
  file_type VARCHAR(100),
  file_size INT,
  entity_type VARCHAR(50) NOT NULL, -- contact, property, transaction
  entity_id UUID NOT NULL,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);

-- Rent payments (FIN-002 - Rent Payment Tracking)
CREATE TABLE rent_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  period_start DATE,
  period_end DATE,
  status VARCHAR(20) DEFAULT 'paid', -- paid, pending, overdue, partial
  payment_method VARCHAR(50),
  receipt_url VARCHAR(500),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rent_payments_transaction ON rent_payments(transaction_id);

-- Showings (for calendar)
CREATE TABLE showings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES properties(id),
  contact_id UUID REFERENCES contacts(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 30,
  status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_showings_property ON showings(property_id);
CREATE INDEX idx_showings_scheduled ON showings(scheduled_at);

-- Audit log (ADM-007)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
