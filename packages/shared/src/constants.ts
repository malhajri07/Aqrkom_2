/**
 * Aqarkom Constants - Saudi Real Estate CRM
 * From PRD: Property types, transaction types, enums
 */

// Saudi property types (Aqar-style) - PM-002
export const PROPERTY_TYPES = {
  apartment: { ar: 'شقة', en: 'Apartment' },
  villa: { ar: 'فيلا', en: 'Villa' },
  land: { ar: 'أرض', en: 'Land' },
  building: { ar: 'عمارة', en: 'Building' },
  floor: { ar: 'دور', en: 'Floor' },
  shop: { ar: 'محل', en: 'Shop' },
  office: { ar: 'مكتب', en: 'Office' },
  restHouse: { ar: 'استراحة', en: 'Rest House' },
  chalet: { ar: 'شاليه', en: 'Chalet' },
  farm: { ar: 'مزرعة', en: 'Farm' },
  warehouse: { ar: 'مستودع', en: 'Warehouse' },
  room: { ar: 'غرفة', en: 'Room' },
  camp: { ar: 'مخيم', en: 'Camp' },
  other: { ar: 'أخرى', en: 'Other' },
} as const;

export type PropertyTypeKey = keyof typeof PROPERTY_TYPES;

// Transaction types - PM-003
export const TRANSACTION_TYPES = {
  sale: { ar: 'بيع', en: 'Sale' },
  annual_rent: { ar: 'إيجار سنوي', en: 'Annual Rent' },
  monthly_rent: { ar: 'إيجار شهري', en: 'Monthly Rent' },
  daily_rent: { ar: 'إيجار يومي', en: 'Daily Rent' },
  sale_and_rent: { ar: 'بيع وإيجار', en: 'Sale & Rent' },
} as const;

export type TransactionTypeKey = keyof typeof TRANSACTION_TYPES;

// Property status - PM-008
export const PROPERTY_STATUS = {
  active: { ar: 'نشط', en: 'Active' },
  pending: { ar: 'قيد المراجعة', en: 'Pending' },
  under_contract: { ar: 'تحت العقد', en: 'Under Contract' },
  sold: { ar: 'تم البيع', en: 'Sold' },
  leased: { ar: 'تم التأجير', en: 'Leased' },
  withdrawn: { ar: 'مسحوب', en: 'Withdrawn' },
  expired: { ar: 'منتهي', en: 'Expired' },
} as const;

// Contact types - CRM-001
export const CONTACT_TYPES = {
  buyer: { ar: 'مشتري', en: 'Buyer' },
  seller: { ar: 'بائع', en: 'Seller' },
  tenant: { ar: 'مستأجر', en: 'Tenant' },
  landlord: { ar: 'مالك', en: 'Landlord' },
  vendor: { ar: 'مورد', en: 'Vendor' },
  investor: { ar: 'مستثمر', en: 'Investor' },
} as const;

// User roles - RBAC
export const USER_ROLES = {
  admin: { ar: 'مدير النظام', en: 'Admin' },
  broker: { ar: 'وسيط عقاري', en: 'Broker' },
  agent: { ar: 'وكيل', en: 'Agent' },
  assistant: { ar: 'مساعد', en: 'Assistant' },
  viewer: { ar: 'مشاهد', en: 'Viewer' },
  seeker: { ar: 'طالب عقار', en: 'Seeker' },
  owner: { ar: 'مالك عقار', en: 'Owner' },
} as const;

// Saudi cities (major) - for city/neighborhood navigation
export const SAUDI_CITIES = [
  { code: 'riyadh', ar: 'الرياض', en: 'Riyadh' },
  { code: 'jeddah', ar: 'جدة', en: 'Jeddah' },
  { code: 'dammam', ar: 'الدمام', en: 'Dammam' },
  { code: 'mecca', ar: 'مكة المكرمة', en: 'Mecca' },
  { code: 'medina', ar: 'المدينة المنورة', en: 'Medina' },
  { code: 'khobar', ar: 'الخبر', en: 'Khobar' },
  { code: 'dhahran', ar: 'الظهران', en: 'Dhahran' },
  { code: 'taif', ar: 'الطائف', en: 'Taif' },
  { code: 'buraidah', ar: 'بريدة', en: 'Buraidah' },
  { code: 'tabuk', ar: 'تبوك', en: 'Tabuk' },
] as const;

// Navigation structure - SCR-011
export const NAV_ITEMS = [
  { id: 'dashboard', path: '/', ar: 'لوحة التحكم', en: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'properties', path: '/properties', ar: 'عقارات', en: 'Properties', icon: 'building' },
  { id: 'requests', path: '/requests', ar: 'طلبات', en: 'Requests', icon: 'inbox' },
  { id: 'contacts', path: '/contacts', ar: 'عملاء', en: 'Contacts', icon: 'users' },
  { id: 'transactions', path: '/transactions', ar: 'صفقات', en: 'Transactions', icon: 'handshake' },
  { id: 'reports', path: '/reports', ar: 'تقارير', en: 'Reports', icon: 'bar-chart' },
  { id: 'settings', path: '/settings', ar: 'الإعدادات', en: 'Settings', icon: 'settings' },
] as const;
