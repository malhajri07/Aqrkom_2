import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { properties } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { PROPERTY_TYPES, TRANSACTION_TYPES } from '@aqarkom/shared';

export function Properties() {
  const { t } = useLanguage();
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', status: '', property_type: '', transaction_type: '' });

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.city) params.city = filters.city;
    if (filters.status) params.status = filters.status;
    if (filters.property_type) params.property_type = filters.property_type;
    if (filters.transaction_type) params.transaction_type = filters.transaction_type;
    properties.list(params).then((r) => setList(r as Record<string, unknown>[])).catch(() => setList([])).finally(() => setLoading(false));
  }, [filters]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('قائمة العقارات', 'Property List')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{t('إدارة إعلاناتك العقارية', 'Manage your property listings')}</p>
        </div>
        <Link to="/properties/new" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
          {t('إضافة إعلان', 'Add Listing')}
        </Link>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <input
            type="search"
            placeholder={t('بحث...', 'Search...')}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 rounded-lg border"
          >
            <option value="">{t('الحالة', 'Status')}</option>
            <option value="active">{t('نشط', 'Active')}</option>
            <option value="sold">{t('تم البيع', 'Sold')}</option>
            <option value="leased">{t('تم التأجير', 'Leased')}</option>
          </select>
          <select
            value={filters.property_type}
            onChange={(e) => setFilters({ ...filters, property_type: e.target.value })}
            className="px-4 py-2 rounded-lg border"
          >
            <option value="">{t('نوع العقار', 'Property Type')}</option>
            {Object.entries(PROPERTY_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{t(v.ar, v.en)}</option>
            ))}
          </select>
          <select
            value={filters.transaction_type}
            onChange={(e) => setFilters({ ...filters, transaction_type: e.target.value })}
            className="px-4 py-2 rounded-lg border"
          >
            <option value="">{t('نوع المعاملة', 'Transaction Type')}</option>
            {Object.entries(TRANSACTION_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{t(v.ar, v.en)}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">{t('جاري التحميل...', 'Loading...')}</div>
      ) : list.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow-sm">
          <p className="text-6xl mb-4">🏢</p>
          <h3 className="text-lg font-semibold">{t('لا توجد إعلانات بعد', 'No listings yet')}</h3>
          <Link to="/properties/new" className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg">
            {t('إضافة أول إعلان', 'Add First Listing')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((p) => (
            <Link key={String(p.id)} to={`/properties/${p.id}`} className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow">
              {Array.isArray(p.photos) && p.photos[0] ? (
                <img src={p.photos[0] as string} alt="" className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-slate-200 flex items-center justify-center text-4xl">🏢</div>
              )}
              <div className="p-4">
                <p className="font-medium truncate">{String(p.title_ar)}</p>
                <p className="text-primary-600 font-bold">{Number(p.price).toLocaleString('ar-SA')} ر.س</p>
                <p className="text-sm text-slate-500">{String(p.district)}, {String(p.city)}</p>
                {p.area_sqm != null && <span className="text-sm">{String(p.area_sqm)} م²</span>}
                {p.bedrooms != null && <span className="text-sm"> • {String(p.bedrooms)} {t('غرفة', 'bed')}</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
