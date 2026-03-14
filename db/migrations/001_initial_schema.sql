-- Aqarkom Initial Schema
-- Based on PRD Data Model (Sheet 6) - RealEstate_CRM_PRD_Saudi_Comprehensive.xlsx

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enums from PRD
CREATE TYPE property_type_enum AS ENUM (
  'apartment', 'villa', 'land', 'building', 'floor', 'shop', 'office',
  'restHouse', 'chalet', 'farm', 'warehouse', 'room', 'camp', 'other'
);

CREATE TYPE transaction_type_enum AS ENUM (
  'sale', 'annual_rent', 'monthly_rent', 'daily_rent', 'sale_and_rent'
);

CREATE TYPE property_status_enum AS ENUM (
  'active', 'pending', 'under_contract', 'sold', 'leased', 'withdrawn', 'expired'
);

CREATE TYPE price_type_enum AS ENUM ('total', 'per_sqm', 'yearly', 'monthly', 'daily');

CREATE TYPE furnished_enum AS ENUM ('unfurnished', 'partially', 'fully');

CREATE TYPE user_role_enum AS ENUM (
  'admin', 'broker', 'agent', 'assistant', 'viewer', 'seeker', 'owner'
);

CREATE TYPE contact_type_enum AS ENUM (
  'buyer', 'seller', 'tenant', 'landlord', 'vendor', 'investor'
);

CREATE TYPE lead_source_enum AS ENUM (
  'aqar', 'dealapp', 'website', 'whatsapp', 'walkin', 'social', 'referral'
);

CREATE TYPE lead_status_enum AS ENUM (
  'new', 'contacted', 'qualified', 'nurture', 'lost', 'converted'
);

CREATE TYPE request_type_enum AS ENUM ('buy', 'rent_annual', 'rent_monthly', 'rent_daily');

CREATE TYPE request_status_enum AS ENUM (
  'open', 'offers_received', 'in_review', 'in_negotiation', 'closed', 'expired'
);

CREATE TYPE transaction_status_enum AS ENUM (
  'initiated', 'active', 'under_contract', 'pending_close', 'closed', 'cancelled'
);

-- Brokerages (for multi-office support)
CREATE TABLE brokerages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  rega_license VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Teams
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brokerage_id UUID REFERENCES brokerages(id),
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users (المستخدمين)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role_enum NOT NULL,
  nafath_verified BOOLEAN NOT NULL DEFAULT FALSE,
  first_name_ar VARCHAR(100) NOT NULL,
  last_name_ar VARCHAR(100) NOT NULL,
  rega_license_number VARCHAR(50),
  rega_license_expiry DATE,
  brokerage_id UUID REFERENCES brokerages(id),
  team_id UUID REFERENCES teams(id),
  active_neighborhoods JSONB,
  rating_avg DECIMAL(2,1),
  rating_count INT DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  preferred_language VARCHAR(2) NOT NULL DEFAULT 'ar',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_brokerage ON users(brokerage_id);

-- Contacts (العملاء)
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_type contact_type_enum NOT NULL,
  first_name_ar VARCHAR(100) NOT NULL,
  last_name_ar VARCHAR(100) NOT NULL,
  first_name_en VARCHAR(100),
  last_name_en VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  whatsapp VARCHAR(20),
  national_id VARCHAR(20),
  company VARCHAR(255),
  lead_source lead_source_enum,
  lead_score INT,
  lead_status lead_status_enum,
  assigned_agent_id UUID REFERENCES users(id),
  tags JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_type ON contacts(contact_type);
CREATE INDEX idx_contacts_phone ON contacts(phone);
CREATE INDEX idx_contacts_agent ON contacts(assigned_agent_id);

-- Properties (العقارات)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rega_ad_license VARCHAR(30) NOT NULL,
  property_type property_type_enum NOT NULL,
  transaction_type transaction_type_enum NOT NULL,
  status property_status_enum NOT NULL,
  title_ar VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  description_ar TEXT,
  description_en TEXT,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  street VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  price DECIMAL(15,2) NOT NULL,
  price_type price_type_enum NOT NULL,
  area_sqm DECIMAL(10,2),
  bedrooms INT,
  bathrooms DECIMAL(3,1),
  living_rooms INT,
  floor_number INT,
  total_floors INT,
  year_built INT,
  street_width_m INT,
  furnished furnished_enum,
  features JSONB,
  photos JSONB,
  video_url VARCHAR(500),
  virtual_tour_url VARCHAR(500),
  is_promoted BOOLEAN NOT NULL DEFAULT FALSE,
  promotion_expires TIMESTAMP,
  listing_agent_id UUID NOT NULL REFERENCES users(id),
  owner_contact_id UUID REFERENCES contacts(id),
  views_count INT NOT NULL DEFAULT 0,
  inquiries_count INT NOT NULL DEFAULT 0,
  listing_date DATE NOT NULL,
  expiration_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_district ON properties(district);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_agent ON properties(listing_agent_id);
CREATE INDEX idx_properties_listing_date ON properties(listing_date);

-- Property requests (طلبات عقارية - DealApp)
CREATE TABLE property_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seeker_id UUID NOT NULL REFERENCES users(id),
  request_type request_type_enum NOT NULL,
  property_type property_type_enum NOT NULL,
  city VARCHAR(100) NOT NULL,
  districts JSONB NOT NULL,
  budget_min DECIMAL(15,2),
  budget_max DECIMAL(15,2) NOT NULL,
  bedrooms_min INT,
  area_min_sqm DECIMAL(10,2),
  move_in_date DATE,
  additional_requirements TEXT,
  status request_status_enum NOT NULL,
  offers_count INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_property_requests_city ON property_requests(city);
CREATE INDEX idx_property_requests_status ON property_requests(status);
CREATE INDEX idx_property_requests_seeker ON property_requests(seeker_id);

-- Request offers (عروض على الطلبات)
CREATE TABLE request_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES property_requests(id),
  broker_id UUID NOT NULL REFERENCES users(id),
  property_id UUID NOT NULL REFERENCES properties(id),
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_request_offers_request ON request_offers(request_id);
CREATE INDEX idx_request_offers_broker ON request_offers(broker_id);

-- Transactions (الصفقات)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type VARCHAR(20) NOT NULL,
  status transaction_status_enum NOT NULL,
  property_id UUID NOT NULL REFERENCES properties(id),
  primary_agent_id UUID NOT NULL REFERENCES users(id),
  client_contact_id UUID NOT NULL REFERENCES contacts(id),
  co_agent_id UUID REFERENCES users(id),
  list_price DECIMAL(15,2),
  final_price DECIMAL(15,2),
  commission_rate DECIMAL(5,4),
  commission_amount DECIMAL(12,2),
  vat_amount DECIMAL(10,2),
  contract_date DATE,
  closing_date DATE,
  ejar_contract_number VARCHAR(50),
  lease_start DATE,
  lease_end DATE,
  lease_monthly_rent DECIMAL(10,2),
  deposit_amount DECIMAL(10,2),
  source_request_id UUID REFERENCES property_requests(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_property ON transactions(property_id);
CREATE INDEX idx_transactions_agent ON transactions(primary_agent_id);
