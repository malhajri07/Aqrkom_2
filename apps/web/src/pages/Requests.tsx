import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requests } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { HiOutlineInboxArrowDown } from 'react-icons/hi2';

export function Requests() {
  const { t } = useLanguage();
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requests.list().then((r) => setList(r as Record<string, unknown>[])).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('طلبات العقارات', 'Property Requests')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{t('صندوق الوارد - نمط ديل أب', 'Request inbox - DealApp style')}</p>
        </div>
        <Link to="/requests/new" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
          {t('طلب عقاري جديد', 'New Property Request')}
        </Link>
      </header>

      {loading ? (
        <div className="text-center py-12">{t('جاري التحميل...', 'Loading...')}</div>
      ) : list.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow">
          <HiOutlineInboxArrowDown className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold">{t('لا توجد طلبات', 'No requests')}</h3>
          <Link to="/requests/new" className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg">
            {t('إضافة طلب', 'Submit Request')}
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="text-right py-3 px-4">{t('المدينة', 'City')}</th>
                <th className="text-right py-3 px-4">{t('الميزانية', 'Budget')}</th>
                <th className="text-right py-3 px-4">{t('الحالة', 'Status')}</th>
                <th className="text-right py-3 px-4">{t('العروض', 'Offers')}</th>
                <th className="text-right py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={String(r.id)} className="border-t">
                  <td className="py-3 px-4">{String(r.city)}</td>
                  <td className="py-3 px-4">{Number(r.budget_max).toLocaleString('ar-SA')} ر.س</td>
                  <td className="py-3 px-4">{String(r.status)}</td>
                  <td className="py-3 px-4">{Number(r.offers_count || 0)}</td>
                  <td className="py-3 px-4">
                    <Link to={`/requests/${r.id}`} className="text-primary-600">{t('عرض', 'View')}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
