import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactions } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { formatDualDate } from '../components/common/HijriDatePicker';
import { HiOutlineHomeModern, HiOutlineExclamationTriangle } from 'react-icons/hi2';

export function RentRoll() {
  const { t, language } = useLanguage();
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    transactions.list({ transaction_type: 'lease' }).then((r) => setList(r as Record<string, unknown>[])).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{t('سجل الإيجار', 'Rent Roll')}</h1>
        <p className="text-slate-600 mt-1">{t('إدارة المستأجرين ودفعات الإيجار', 'Tenant & rent payment management')}</p>
      </header>

      {loading ? (
        <div className="text-center py-12">{t('جاري التحميل...', 'Loading...')}</div>
      ) : list.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow">
          <HiOutlineHomeModern className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold">{t('لا توجد عقود إيجار', 'No lease transactions')}</h3>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="text-right py-3 px-4">{t('العقار', 'Property')}</th>
                <th className="text-right py-3 px-4">{t('المستأجر', 'Tenant')}</th>
                <th className="text-right py-3 px-4">{t('الإيجار الشهري', 'Monthly Rent')}</th>
                <th className="text-right py-3 px-4">{t('بداية العقد', 'Lease Start')}</th>
                <th className="text-right py-3 px-4">{t('نهاية العقد', 'Lease End')}</th>
                <th className="text-right py-3 px-4">{t('الحالة', 'Status')}</th>
                <th className="text-right py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((tx) => {
                const leaseEnd = tx.lease_end ? new Date(tx.lease_end as string) : null;
                const isExpiringSoon = leaseEnd && (leaseEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24) < 60;
                return (
                  <tr key={String(tx.id)} className={`border-t ${isExpiringSoon ? 'bg-amber-50/50' : ''}`}>
                    <td className="py-3 px-4">{String(tx.property_title)}</td>
                    <td className="py-3 px-4">{String(tx.client_first_name)} {String(tx.client_last_name)}</td>
                    <td className="py-3 px-4">{Number(tx.lease_monthly_rent || 0).toLocaleString('ar-SA')} ر.س</td>
                    <td className="py-3 px-4">{tx.lease_start ? formatDualDate(String(tx.lease_start), language) : '-'}</td>
                    <td className="py-3 px-4">
                      {tx.lease_end ? (
                        <span className={isExpiringSoon ? 'text-amber-600 flex items-center gap-1' : ''}>
                          {isExpiringSoon && <HiOutlineExclamationTriangle className="w-4 h-4" />}
                          {formatDualDate(String(tx.lease_end), language)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${tx.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {String(tx.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link to={`/transactions/${tx.id}`} className="text-primary-600">{t('عرض', 'View')}</Link>
                    </td>
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
