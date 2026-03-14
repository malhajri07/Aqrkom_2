/**
 * Aqarkom Shared Types
 * Based on PRD Data Model (Sheet 6)
 */

export interface Property {
  id: string;
  rega_ad_license: string;
  property_type: PropertyType;
  transaction_type: TransactionType;
  status: PropertyStatus;
  title_ar: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  city: string;
  district: string;
  street?: string;
  latitude?: number;
  longitude?: number;
  price: number;
  price_type: PriceType;
  area_sqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  living_rooms?: number;
  floor_number?: number;
  total_floors?: number;
  year_built?: number;
  furnished?: FurnishedType;
  features?: Record<string, boolean>;
  photos?: string[];
  video_url?: string;
  virtual_tour_url?: string;
  is_promoted: boolean;
  promotion_expires?: Date;
  listing_agent_id: string;
  owner_contact_id?: string;
  views_count: number;
  inquiries_count: number;
  listing_date: Date;
  expiration_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export type PropertyType =
  | 'apartment'
  | 'villa'
  | 'land'
  | 'building'
  | 'floor'
  | 'shop'
  | 'office'
  | 'restHouse'
  | 'chalet'
  | 'farm'
  | 'warehouse'
  | 'room'
  | 'camp'
  | 'other';

export type TransactionType =
  | 'sale'
  | 'annual_rent'
  | 'monthly_rent'
  | 'daily_rent'
  | 'sale_and_rent';

export type PropertyStatus =
  | 'active'
  | 'pending'
  | 'under_contract'
  | 'sold'
  | 'leased'
  | 'withdrawn'
  | 'expired';

export type PriceType = 'total' | 'per_sqm' | 'yearly' | 'monthly' | 'daily';

export type FurnishedType = 'unfurnished' | 'partially' | 'fully';

export interface PropertyRequest {
  id: string;
  seeker_id: string;
  request_type: RequestType;
  property_type: PropertyType;
  city: string;
  districts: string[];
  budget_min?: number;
  budget_max: number;
  bedrooms_min?: number;
  area_min_sqm?: number;
  move_in_date?: Date;
  additional_requirements?: string;
  status: RequestStatus;
  offers_count: number;
  expires_at?: Date;
  created_at: Date;
}

export type RequestType = 'buy' | 'rent_annual' | 'rent_monthly' | 'rent_daily';

export type RequestStatus =
  | 'open'
  | 'offers_received'
  | 'in_review'
  | 'in_negotiation'
  | 'closed'
  | 'expired';

export interface Contact {
  id: string;
  contact_type: ContactType;
  first_name_ar: string;
  last_name_ar: string;
  first_name_en?: string;
  last_name_en?: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  national_id?: string;
  company?: string;
  lead_source?: LeadSource;
  lead_score?: number;
  lead_status?: LeadStatus;
  assigned_agent_id?: string;
  tags?: string[];
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export type ContactType =
  | 'buyer'
  | 'seller'
  | 'tenant'
  | 'landlord'
  | 'vendor'
  | 'investor';

export type LeadSource =
  | 'aqar'
  | 'dealapp'
  | 'website'
  | 'whatsapp'
  | 'walkin'
  | 'social'
  | 'referral';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'nurture'
  | 'lost'
  | 'converted';

export interface User {
  id: string;
  email: string;
  phone: string;
  role: UserRole;
  nafath_verified: boolean;
  first_name_ar: string;
  last_name_ar: string;
  rega_license_number?: string;
  rega_license_expiry?: Date;
  brokerage_id?: string;
  team_id?: string;
  active_neighborhoods?: string[];
  rating_avg?: number;
  rating_count?: number;
  is_active: boolean;
  preferred_language: 'ar' | 'en';
  created_at: Date;
}

export type UserRole =
  | 'admin'
  | 'broker'
  | 'agent'
  | 'assistant'
  | 'viewer'
  | 'seeker'
  | 'owner';

export interface Transaction {
  id: string;
  transaction_type: 'sale' | 'purchase' | 'lease';
  status: TransactionStatus;
  property_id: string;
  primary_agent_id: string;
  client_contact_id: string;
  co_agent_id?: string;
  list_price?: number;
  final_price?: number;
  commission_rate?: number;
  commission_amount?: number;
  vat_amount?: number;
  contract_date?: Date;
  closing_date?: Date;
  ejar_contract_number?: string;
  lease_start?: Date;
  lease_end?: Date;
  lease_monthly_rent?: number;
  deposit_amount?: number;
  source_request_id?: string;
  created_at: Date;
  updated_at: Date;
}

export type TransactionStatus =
  | 'initiated'
  | 'active'
  | 'under_contract'
  | 'pending_close'
  | 'closed'
  | 'cancelled';
