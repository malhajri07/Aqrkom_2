/**
 * Aqarkom Constants - Saudi Real Estate CRM
 * From PRD: Property types, transaction types, enums
 */

// Saudi property types (Aqar-style) - PM-002
export const PROPERTY_TYPES = {
  apartment: { ar: 'شقة', en: 'Apartment' },
  villa: { ar: 'فيلا', en: 'Villa' },
  duplex: { ar: 'دوبلكس', en: 'Duplex' },
  townhouse: { ar: 'تاون هاوس', en: 'Townhouse' },
  penthouse: { ar: 'بنتهاوس', en: 'Penthouse' },
  compound: { ar: 'مجمع سكني', en: 'Compound' },
  tower: { ar: 'برج', en: 'Tower' },
  house: { ar: 'منزل', en: 'House' },
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

// Lead sources - CRM-002
export const LEAD_SOURCES = {
  aqar: { ar: 'عقار', en: 'Aqar' },
  dealapp: { ar: 'ديل أب', en: 'DealApp' },
  website: { ar: 'الموقع', en: 'Website' },
  whatsapp: { ar: 'واتساب', en: 'WhatsApp' },
  walkin: { ar: 'زيارة مكتب', en: 'Walk-in' },
  social: { ar: 'السوشيال', en: 'Social Media' },
  referral: { ar: 'إحالة', en: 'Referral' },
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

// Saudi cities with neighborhood hierarchy - PM-007 City & Neighborhood Navigation
export const SAUDI_NEIGHBORHOODS: Record<string, { ar: string; en: string }[]> = {
  riyadh: [
    { ar: 'النرجس', en: 'Al Narjis' },
    { ar: 'الروضة', en: 'Al Rawdah' },
    { ar: 'العليا', en: 'Al Olaya' },
    { ar: 'الملقا', en: 'Al Malqa' },
    { ar: 'النسيم', en: 'Al Naseem' },
    { ar: 'اليرموك', en: 'Al Yarmouk' },
    { ar: 'الملز', en: 'Al Malaz' },
    { ar: 'الشميسي', en: 'Al Shumaisi' },
    { ar: 'الرياض الجديدة', en: 'Riyadh New' },
    { ar: 'الخبراء', en: 'Al Khabra' },
    { ar: 'الدرعية', en: 'Al Diriyah' },
    { ar: 'حي النخيل', en: 'Al Nakheel' },
    { ar: 'حي الياسمين', en: 'Al Yasmeen' },
    { ar: 'حي الورود', en: 'Al Wurud' },
  ],
  jeddah: [
    { ar: 'الحمراء', en: 'Al Hamra' },
    { ar: 'الروضة', en: 'Al Rawdah' },
    { ar: 'الزهراء', en: 'Al Zahra' },
    { ar: 'السلامة', en: 'Al Salamah' },
    { ar: 'الشرفية', en: 'Al Sharafiyah' },
    { ar: 'العزيزية', en: 'Al Aziziyah' },
    { ar: 'البحر الأحمر', en: 'Red Sea' },
    { ar: 'النسيم', en: 'Al Naseem' },
    { ar: 'الورود', en: 'Al Wurud' },
  ],
  dammam: [
    { ar: 'الفيصلية', en: 'Al Faisaliyah' },
    { ar: 'الروضة', en: 'Al Rawdah' },
    { ar: 'النسيم', en: 'Al Naseem' },
    { ar: 'الخليج', en: 'Al Khaleej' },
    { ar: 'المنطقة الصناعية', en: 'Industrial Area' },
    { ar: 'الفيصلية الشمالية', en: 'North Faisaliyah' },
  ],
  mecca: [
    { ar: 'العزيزية', en: 'Al Aziziyah' },
    { ar: 'الشوقية', en: 'Al Shaqqiyah' },
    { ar: 'الرصيفة', en: 'Al Rasifah' },
    { ar: 'النسيم', en: 'Al Naseem' },
  ],
  medina: [
    { ar: 'العزيزية', en: 'Al Aziziyah' },
    { ar: 'المناخة', en: 'Al Manakhah' },
    { ar: 'قباء', en: 'Quba' },
    { ar: 'العوالي', en: 'Al Awali' },
  ],
  khobar: [
    { ar: 'الروضة', en: 'Al Rawdah' },
    { ar: 'الفيصلية', en: 'Al Faisaliyah' },
    { ar: 'الخبر الشمالية', en: 'North Khobar' },
    { ar: 'الجلوية', en: 'Al Jalawiyah' },
  ],
  dhahran: [
    { ar: 'الظهران', en: 'Dhahran' },
    { ar: 'الظهران الشمالية', en: 'North Dhahran' },
  ],
  taif: [
    { ar: 'الشوقية', en: 'Al Shaqqiyah' },
    { ar: 'النسيم', en: 'Al Naseem' },
    { ar: 'الحوية', en: 'Al Hawiyah' },
  ],
  buraidah: [
    { ar: 'الروضة', en: 'Al Rawdah' },
    { ar: 'النسيم', en: 'Al Naseem' },
    { ar: 'العليا', en: 'Al Olaya' },
  ],
  tabuk: [
    { ar: 'الروضة', en: 'Al Rawdah' },
    { ar: 'النسيم', en: 'Al Naseem' },
    { ar: 'العليا', en: 'Al Olaya' },
  ],
};

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

// Get neighborhoods for a city (PM-007)
export function getNeighborhoodsForCity(cityCode: string): { ar: string; en: string }[] {
  return SAUDI_NEIGHBORHOODS[cityCode] || [];
}

// Navigation structure - SCR-011
export const NAV_ITEMS = [
  { id: 'dashboard', path: '/', ar: 'لوحة التحكم', en: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'properties', path: '/properties', ar: 'عقارات', en: 'Properties', icon: 'building' },
  { id: 'requests', path: '/requests', ar: 'طلبات', en: 'Requests', icon: 'inbox' },
  { id: 'contacts', path: '/contacts', ar: 'عملاء', en: 'Contacts', icon: 'users' },
  { id: 'pipeline', path: '/pipeline', ar: 'خط الأنابيب', en: 'Pipeline', icon: 'kanban' },
  { id: 'transactions', path: '/transactions', ar: 'صفقات', en: 'Transactions', icon: 'handshake' },
  { id: 'rent-roll', path: '/rent-roll', ar: 'سجل الإيجار', en: 'Rent Roll', icon: 'home' },
  { id: 'documents', path: '/documents', ar: 'المستندات', en: 'Documents', icon: 'document' },
  { id: 'reports', path: '/reports', ar: 'تقارير', en: 'Reports', icon: 'bar-chart' },
  { id: 'settings', path: '/settings', ar: 'الإعدادات', en: 'Settings', icon: 'settings' },
] as const;
