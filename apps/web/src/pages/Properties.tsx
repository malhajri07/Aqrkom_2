import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { properties } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { PROPERTY_TYPES, TRANSACTION_TYPES, PROPERTY_STATUS, SAUDI_CITIES } from '@aqarkom/shared';
import {
  HiOutlineBuildingOffice2,
  HiOutlinePlusCircle,
  HiOutlineSquares2X2,
  HiOutlineListBullet,
  HiOutlineFunnel,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineHomeModern,
} from 'react-icons/hi2';

export function Properties() {
  const { t } = useLanguage();
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ city: '', status: '', property_type: '', transaction_type: '' });

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.city) params.city = filters.city;
    if (filters.status) params.status = filters.status;
    if (filters.property_type) params.property_type = filters.property_type;
    if (filters.transaction_type) params.transaction_type = filters.transaction_type;
    setLoading(true);
    properties.list(params)
      .then((r) => setList(r as Record<string, unknown>[]))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [filters]);

  const filteredList = searchQuery
    ? list.filter((p) => String(p.title_ar || '').includes(searchQuery) || String(p.title_en || '').toLowerCase().includes(searchQuery.toLowerCase()) || String(p.district || '').includes(searchQuery) || String(p.city || '').includes(searchQuery))
    : list;

  const statusColor = (s: string) => {
    const map: Record<string, string> = { active: 'bg-holly-100 text-holly-700', pending: 'bg-yellow-100 text-yellow-700', sold: 'bg-red-100 text-red-700', leased: 'bg-blue-100 text-blue-700', under_contract: 'bg-purple-100 text-purple-700' };
    return map[s] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('قائمة العقارات', 'Property Listings')}</h1>
          <p className="text-slate-500 mt-1">{t('إدارة إعلاناتك العقارية', 'Manage your property listings')} ({filteredList.length})</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-holly-700' : 'text-slate-400'}`}>
              <HiOutlineSquares2X2 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-holly-700' : 'text-slate-400'}`}>
              <HiOutlineListBullet className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm ${showFilters ? 'bg-holly-50 border-holly-200 text-holly-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            <HiOutlineFunnel className="w-4 h-4" />
            {t('فلاتر', 'Filters')}
          </button>
          <Link to="/properties/new" className="flex items-center gap-1.5 px-4 py-2 bg-holly-600 text-white rounded-lg text-sm font-medium hover:bg-holly-700 transition-colors">
            <HiOutlinePlusCircle className="w-4 h-4" />
            {t('إضافة إعلان', 'Add Listing')}
          </Link>
        </div>
      </header>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-4">
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('بحث بالعنوان أو الحي أو المدينة...', 'Search by title, district, or city...')} className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-holly-200 focus:border-holly-400 outline-none" />
        </div>
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm">
              <option value="">{t('كل الحالات', 'All Statuses')}</option>
              {Object.entries(PROPERTY_STATUS).map(([k, v]) => (<option key={k} value={k}>{t(v.ar, v.en)}</option>))}
            </select>
            <select value={filters.property_type} onChange={(e) => setFilters({ ...filters, property_type: e.target.value })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm">
              <option value="">{t('كل الأنواع', 'All Types')}</option>
              {Object.entries(PROPERTY_TYPES).map(([k, v]) => (<option key={k} value={k}>{t(v.ar, v.en)}</option>))}
            </select>
            <select value={filters.transaction_type} onChange={(e) => setFilters({ ...filters, transaction_type: e.target.value })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm">
              <option value="">{t('كل المعاملات', 'All Transactions')}</option>
              {Object.entries(TRANSACTION_TYPES).map(([k, v]) => (<option key={k} value={k}>{t(v.ar, v.en)}</option>))}
            </select>
            <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} className="px-3 py-2 rounded-lg border border-slate-200 text-sm">
              <option value="">{t('كل المدن', 'All Cities')}</option>
              {SAUDI_CITIES.map((c) => (<option key={c.code} value={c.ar}>{t(c.ar, c.en)}</option>))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (<div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-slate-100" />))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-slate-100">
          <HiOutlineBuildingOffice2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-800">{t('لا توجد إعلانات', 'No listings found')}</h3>
          <p className="text-sm text-slate-500 mt-1">{t('أضف أول إعلان عقاري', 'Add your first property listing')}</p>
          <Link to="/properties/new" className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-holly-600 text-white rounded-lg font-medium hover:bg-holly-700">
            <HiOutlinePlusCircle className="w-4 h-4" />
            {t('إضافة إعلان', 'Add Listing')}
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((p) => {
            const typeLabel = PROPERTY_TYPES[p.property_type as keyof typeof PROPERTY_TYPES];
            return (
              <Link key={String(p.id)} to={`/properties/${p.id}`} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-holly-200 transition-all group">
                <div className="w-full h-44 bg-slate-100 flex items-center justify-center relative">
                  {Array.isArray(p.photos) && p.photos[0] ? (
                    <img src={p.photos[0] as string} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <HiOutlineHomeModern className="w-12 h-12 text-slate-300" />
                  )}
                  <span className={`absolute top-3 start-3 text-xs px-2 py-1 rounded-full font-medium ${statusColor(String(p.status))}`}>
                    {PROPERTY_STATUS[p.status as keyof typeof PROPERTY_STATUS] ? t(PROPERTY_STATUS[p.status as keyof typeof PROPERTY_STATUS].ar, PROPERTY_STATUS[p.status as keyof typeof PROPERTY_STATUS].en) : String(p.status)}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <p className="font-semibold text-slate-900 truncate group-hover:text-holly-700 transition-colors">{String(p.title_ar)}</p>
                  <p className="text-lg font-bold text-holly-600">{Number(p.price).toLocaleString()} ر.س</p>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <HiOutlineMapPin className="w-3.5 h-3.5" />
                    <span>{String(p.district)}, {String(p.city)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 border-t border-slate-50">
                    {typeLabel && <span className="px-2 py-0.5 bg-slate-50 rounded">{t(typeLabel.ar, typeLabel.en)}</span>}
                    {p.area_sqm != null && <span>{String(p.area_sqm)} م²</span>}
                    {p.bedrooms != null && <span>{String(p.bedrooms)} {t('غرفة', 'bed')}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">{t('العقار', 'Property')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">{t('النوع', 'Type')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">{t('السعر', 'Price')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">{t('الموقع', 'Location')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">{t('الحالة', 'Status')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase"></th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((p) => {
                const typeLabel = PROPERTY_TYPES[p.property_type as keyof typeof PROPERTY_TYPES];
                return (
                  <tr key={String(p.id)} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <HiOutlineBuildingOffice2 className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800 truncate max-w-[200px]">{String(p.title_ar)}</p>
                          {p.bedrooms != null && <span className="text-xs text-slate-400">{String(p.bedrooms)} {t('غرفة', 'bed')} • {String(p.area_sqm || '')} م²</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{typeLabel ? t(typeLabel.ar, typeLabel.en) : String(p.property_type)}</td>
                    <td className="py-3 px-4 text-sm font-bold text-holly-600">{Number(p.price).toLocaleString()} ر.س</td>
                    <td className="py-3 px-4 text-sm text-slate-500">{String(p.district)}, {String(p.city)}</td>
                    <td className="py-3 px-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(String(p.status))}`}>{String(p.status)}</span></td>
                    <td className="py-3 px-4"><Link to={`/properties/${p.id}`} className="text-sm text-holly-600 hover:text-holly-700 font-medium">{t('عرض', 'View')}</Link></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
