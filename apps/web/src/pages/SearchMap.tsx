import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { useLanguage } from '../context/LanguageContext';
import { unwrapEnvelope } from '../lib/api';
import {
  HiOutlineMagnifyingGlass,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineHomeModern,
  HiOutlineSquare3Stack3D,
  HiOutlineXMark,
  HiOutlineMap,
  HiOutlineSquares2X2,
} from 'react-icons/hi2';

const SAUDI_CENTER = { lat: 24.7136, lng: 46.6753 };

interface Property {
  id: string;
  title_ar?: string;
  title_en?: string;
  price: number;
  city: string;
  district: string;
  property_type: string;
  transaction_type: string;
  bedrooms: number;
  area_sqm?: number;
  area?: number;
  status: string;
  latitude?: number;
  longitude?: number;
  photos?: string[];
}

const PROPERTY_TYPES = [
  { value: '', ar: 'الكل', en: 'All' },
  { value: 'apartment', ar: 'شقة', en: 'Apartment' },
  { value: 'villa', ar: 'فيلا', en: 'Villa' },
  { value: 'land', ar: 'أرض', en: 'Land' },
  { value: 'office', ar: 'مكتب', en: 'Office' },
  { value: 'building', ar: 'عمارة', en: 'Building' },
  { value: 'warehouse', ar: 'مستودع', en: 'Warehouse' },
  { value: 'shop', ar: 'محل', en: 'Shop' },
];

const TRANSACTION_TYPES = [
  { value: '', ar: 'الكل', en: 'All' },
  { value: 'sale', ar: 'بيع', en: 'Sale' },
  { value: 'rent', ar: 'إيجار', en: 'Rent' },
];

function PropertyMarker({
  property,
  formatPrice,
  t,
}: {
  property: Property;
  formatPrice: (p: number) => string;
  t: (ar: string, en: string) => string;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(false);
  const handleMarkerClick = useCallback(() => setInfoOpen((o) => !o), []);
  const handleClose = useCallback(() => setInfoOpen(false), []);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: property.latitude!, lng: property.longitude! }}
        onClick={handleMarkerClick}
      />
      {infoOpen && marker && (
        <InfoWindow anchor={marker} onClose={handleClose}>
          <div className="min-w-[200px] p-1">
            <h3 className="font-semibold text-sm mb-1">{property.title_ar || property.title_en}</h3>
            <p className="text-holly-600 font-bold">{formatPrice(property.price)}</p>
            <p className="text-xs text-slate-500">{property.district}, {property.city}</p>
            <Link to={`/login?redirect=/properties/${property.id}`} className="text-xs text-holly-600 hover:underline mt-2 block">
              {t('تسجيل الدخول لعرض التفاصيل', 'Login to view details')}
            </Link>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function SearchMap() {
  const { t, isRtl } = useLanguage();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    property_type: '',
    transaction_type: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/public/properties');
      if (res.ok) {
        const body = await res.json();
        const data = unwrapEnvelope<Property[]>(body);
        setProperties(Array.isArray(data) ? data : []);
      }
    } catch {
      // silently handle fetch errors
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = useMemo(() => properties.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const title = (p.title_ar || p.title_en || '').toLowerCase();
      if (!title.includes(q) && !p.city?.toLowerCase().includes(q) && !p.district?.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filters.property_type && p.property_type !== filters.property_type) return false;
    if (filters.transaction_type && p.transaction_type !== filters.transaction_type) return false;
    if (filters.min_price && p.price < Number(filters.min_price)) return false;
    if (filters.max_price && p.price > Number(filters.max_price)) return false;
    if (filters.bedrooms && (p.bedrooms || 0) < Number(filters.bedrooms)) return false;
    return true;
  }), [properties, searchQuery, filters]);

  const propertiesWithCoords = filteredProperties.filter((p) => p.latitude != null && p.longitude != null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-holly-50" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Search bar */}
      <div className="bg-white border-b border-holly-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <HiOutlineMagnifyingGlass className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('ابحث بالمدينة أو الحي...', 'Search by city or district...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-10 pe-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-holly-500 focus:border-holly-500 text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-holly-50 hover:border-holly-300 transition-colors"
            >
              <HiOutlineAdjustmentsHorizontal className="w-5 h-5" />
              {t('الفلاتر', 'Filters')}
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-holly-50 rounded-xl border border-holly-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-holly-800">{t('تصفية النتائج', 'Filter Results')}</h3>
                <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600">
                  <HiOutlineXMark className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <select
                  value={filters.property_type}
                  onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt.value} value={pt.value}>{t(pt.ar, pt.en)}</option>
                  ))}
                </select>
                <select
                  value={filters.transaction_type}
                  onChange={(e) => setFilters({ ...filters, transaction_type: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500"
                >
                  {TRANSACTION_TYPES.map((tt) => (
                    <option key={tt.value} value={tt.value}>{t(tt.ar, tt.en)}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder={t('أقل سعر', 'Min Price')}
                  value={filters.min_price}
                  onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500"
                />
                <input
                  type="number"
                  placeholder={t('أعلى سعر', 'Max Price')}
                  value={filters.max_price}
                  onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500"
                />
                <input
                  type="number"
                  placeholder={t('غرف النوم', 'Bedrooms')}
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Properties grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            {t('العقارات المتاحة', 'Available Properties')}
            <span className="ms-2 text-sm font-normal text-slate-500">
              ({filteredProperties.length})
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-holly-100 text-holly-700' : 'text-slate-500 hover:bg-slate-100'}`}
              title={t('عرض شبكي', 'Grid view')}
            >
              <HiOutlineSquares2X2 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-holly-100 text-holly-700' : 'text-slate-500 hover:bg-slate-100'}`}
              title={t('عرض الخريطة', 'Map view')}
            >
              <HiOutlineMap className="w-5 h-5" />
            </button>
            <Link to="/" className="text-sm text-holly-600 hover:text-holly-700 font-medium ms-2">
              {t('الرئيسية', 'Home')}
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-holly-200 border-t-holly-600 rounded-full animate-spin" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <HiOutlineBuildingOffice2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-medium">{t('لا توجد عقارات', 'No properties found')}</p>
            <p className="text-sm mt-1">{t('جرب تغيير معايير البحث', 'Try adjusting your search criteria')}</p>
          </div>
        ) : viewMode === 'map' ? (
          <div className="h-[600px] rounded-xl overflow-hidden border border-slate-200">
            {(() => {
              const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
              if (!apiKey || apiKey === 'your-google-maps-api-key') {
                return (
                  <div className="h-full flex flex-col items-center justify-center bg-slate-100 text-slate-600 p-6">
                    <HiOutlineMap className="w-16 h-16 mb-4 text-slate-400" />
                    <p className="text-lg font-medium mb-2">
                      {t('إعداد خرائط جوجل', 'Google Maps Setup')}
                    </p>
                    <p className="text-sm text-center max-w-md mb-4">
                      {t(
                        'أضف مفتاح Google Maps API إلى ملف .env كـ VITE_GOOGLE_MAPS_API_KEY لتفعيل الخريطة.',
                        'Add your Google Maps API key to .env as VITE_GOOGLE_MAPS_API_KEY to enable the map.'
                      )}
                    </p>
                    <a
                      href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-holly-600 hover:underline text-sm"
                    >
                      {t('الحصول على مفتاح API', 'Get API Key')}
                    </a>
                  </div>
                );
              }
              return (
                <APIProvider apiKey={apiKey}>
                  <Map
                    defaultCenter={SAUDI_CENTER}
                    defaultZoom={5}
                    gestureHandling="greedy"
                    style={{ width: '100%', height: '100%' }}
                    mapId="DEMO_MAP_ID"
                  >
                    {propertiesWithCoords.map((property) => (
                      <PropertyMarker
                        key={property.id}
                        property={property}
                        formatPrice={formatPrice}
                        t={t}
                      />
                    ))}
                  </Map>
                </APIProvider>
              );
            })()}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-xl border border-slate-100 hover:border-holly-200 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="h-40 bg-gradient-to-br from-holly-100 to-holly-50 flex items-center justify-center">
                  <HiOutlineHomeModern className="w-12 h-12 text-holly-300" />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-slate-900 mb-1 line-clamp-1">
                    {property.title_ar || property.title_en}
                  </h3>
                  <p className="text-lg font-bold text-holly-600 mb-2">
                    {formatPrice(property.price)}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                    <HiOutlineMapPin className="w-3.5 h-3.5" />
                    <span>{property.city}{property.district ? ` - ${property.district}` : ''}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-holly-50 text-holly-700 rounded-md">
                      {property.property_type}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                      {property.transaction_type === 'sale' ? t('بيع', 'Sale') : t('إيجار', 'Rent')}
                    </span>
                    {(property.bedrooms || 0) > 0 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                        {property.bedrooms} {t('غرف', 'BR')}
                      </span>
                    )}
                    {((property.area_sqm ?? property.area) || 0) > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                        <HiOutlineSquare3Stack3D className="w-3 h-3" />
                        {property.area_sqm ?? property.area} {t('م²', 'sqm')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
