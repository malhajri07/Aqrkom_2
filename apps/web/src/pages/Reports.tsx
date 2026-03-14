import { useState, useEffect } from 'react';
import { dashboard } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { PROPERTY_TYPES } from '@aqarkom/shared';
import {
  HiOutlineChartBar,
  HiOutlineBuildingOffice2,
  HiOutlineBanknotes,
  HiOutlineMapPin,
} from 'react-icons/hi2';

interface ReportsData {
  propertiesByType: { property_type: string; count: number }[];
  propertiesByCity: { city: string; count: number }[];
  transactionsByType: { transaction_type: string; count: number }[];
  transactionsByStatus: { status: string; count: number }[];
  monthlyRevenue: { month: string; deals: number; revenue: number; commission: number }[];
}

export function Reports() {
  const { t } = useLanguage();
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboard.reportsSummary()
      .then((d) => setData(d as ReportsData))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-slate-900">{t('التقارير', 'Reports')}</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (<div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-slate-100" />))}
        </div>
      </div>
    );
  }

  const maxPropertyCount = Math.max(...(data?.propertiesByType || []).map((d) => d.count), 1);
  const maxCityCount = Math.max(...(data?.propertiesByCity || []).map((d) => d.count), 1);

  const TX_STATUS_COLORS: Record<string, string> = {
    initiated: 'bg-slate-400', active: 'bg-blue-400', under_contract: 'bg-amber-400',
    pending_close: 'bg-purple-400', closed: 'bg-holly-400', cancelled: 'bg-red-400',
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{t('التقارير والتحليلات', 'Reports & Analytics')}</h1>
        <p className="text-slate-500 mt-1">{t('تحليلات وأداء المبيعات', 'Sales analytics and performance')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Properties by Type */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-holly-50 text-holly-600 flex items-center justify-center">
              <HiOutlineBuildingOffice2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{t('العقارات حسب النوع', 'Properties by Type')}</h3>
              <p className="text-xs text-slate-500">{t('توزيع العقارات', 'Distribution of properties')}</p>
            </div>
          </div>
          <div className="space-y-3">
            {(data?.propertiesByType || []).map((item) => {
              const label = PROPERTY_TYPES[item.property_type as keyof typeof PROPERTY_TYPES];
              const pct = (item.count / maxPropertyCount) * 100;
              return (
                <div key={item.property_type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{label ? t(label.ar, label.en) : item.property_type}</span>
                    <span className="font-bold text-slate-800">{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-holly-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {(!data?.propertiesByType || data.propertiesByType.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-8">{t('لا توجد بيانات', 'No data')}</p>
            )}
          </div>
        </div>

        {/* Properties by City */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <HiOutlineMapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{t('العقارات حسب المدينة', 'Properties by City')}</h3>
              <p className="text-xs text-slate-500">{t('التوزيع الجغرافي', 'Geographic distribution')}</p>
            </div>
          </div>
          <div className="space-y-3">
            {(data?.propertiesByCity || []).map((item) => {
              const pct = (item.count / maxCityCount) * 100;
              return (
                <div key={item.city}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{item.city}</span>
                    <span className="font-bold text-slate-800">{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
            {(!data?.propertiesByCity || data.propertiesByCity.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-8">{t('لا توجد بيانات', 'No data')}</p>
            )}
          </div>
        </div>

        {/* Transaction Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <HiOutlineBanknotes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{t('الصفقات حسب الحالة', 'Deals by Status')}</h3>
              <p className="text-xs text-slate-500">{t('توزيع الصفقات', 'Deal distribution')}</p>
            </div>
          </div>
          {(data?.transactionsByStatus && data.transactionsByStatus.length > 0) ? (
            <div className="space-y-4">
              <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
                {data.transactionsByStatus.map((item) => {
                  const total = data.transactionsByStatus.reduce((s, i) => s + i.count, 0);
                  const pct = total > 0 ? (item.count / total) * 100 : 0;
                  return pct > 0 ? <div key={item.status} className={`${TX_STATUS_COLORS[item.status] || 'bg-slate-300'} transition-all`} style={{ width: `${pct}%` }} title={`${item.status}: ${item.count}`} /> : null;
                })}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {data.transactionsByStatus.map((item) => (
                  <div key={item.status} className="flex items-center gap-2 text-sm">
                    <span className={`w-3 h-3 rounded-full ${TX_STATUS_COLORS[item.status] || 'bg-slate-300'}`} />
                    <span className="text-slate-600">{item.status}</span>
                    <span className="font-bold text-slate-800 ms-auto">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">{t('لا توجد صفقات', 'No deals yet')}</p>
          )}
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HiOutlineChartBar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{t('الإيرادات الشهرية', 'Monthly Revenue')}</h3>
              <p className="text-xs text-slate-500">{t('آخر 12 شهر', 'Last 12 months')}</p>
            </div>
          </div>
          {(data?.monthlyRevenue && data.monthlyRevenue.length > 0) ? (
            <div className="space-y-3">
              {data.monthlyRevenue.map((item) => {
                const maxRev = Math.max(...data.monthlyRevenue.map((r) => r.revenue), 1);
                const pct = (item.revenue / maxRev) * 100;
                const monthLabel = new Date(item.month).toLocaleDateString('ar-SA', { month: 'short', year: 'numeric' });
                return (
                  <div key={item.month}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{monthLabel}</span>
                      <span className="font-bold text-slate-800">{Number(item.revenue).toLocaleString()} ر.س</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">{t('لا توجد إيرادات', 'No revenue data')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
