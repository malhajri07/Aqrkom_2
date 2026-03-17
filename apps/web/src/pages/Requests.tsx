import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRequestsList } from '../features/requests/api';
import { HiOutlineInboxArrowDown } from 'react-icons/hi2';

export function Requests() {
  const { t } = useTranslation('requests');
  const { data: list = [], isLoading: loading } = useRequestsList();

  return (
    <div className="space-y-6" data-testid="requests-page">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('listTitle')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{t('subtitle')}</p>
        </div>
        <Link to="/requests/new" className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
          {t('newRequest')}
        </Link>
      </header>

      {loading ? (
        <div className="text-center py-12">{t('loading')}</div>
      ) : list.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow">
          <HiOutlineInboxArrowDown className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold">{t('noRequests')}</h3>
          <Link to="/requests/new" className="mt-6 inline-block px-6 py-3 bg-primary-600 text-white rounded-lg">
            {t('submitRequest')}
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="text-right py-3 px-4">{t('city')}</th>
                <th className="text-right py-3 px-4">{t('budget')}</th>
                <th className="text-right py-3 px-4">{t('status')}</th>
                <th className="text-right py-3 px-4">{t('offers')}</th>
                <th className="text-right py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {(list as Record<string, unknown>[]).map((r) => (
                <tr key={String(r.id)} className="border-t">
                  <td className="py-3 px-4">{String(r.city)}</td>
                  <td className="py-3 px-4">{Number(r.budget_max).toLocaleString('ar-SA')} ر.س</td>
                  <td className="py-3 px-4">{String(r.status)}</td>
                  <td className="py-3 px-4">{Number(r.offers_count || 0)}</td>
                  <td className="py-3 px-4">
                    <Link to={`/requests/${r.id}`} className="text-primary-600">{t('view')}</Link>
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
