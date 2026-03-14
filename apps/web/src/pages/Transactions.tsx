import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactions } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export function Transactions() {
  const { t } = useLanguage();
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [properties, setProperties] = useState<unknown[]>([]);
  const [contactsList, setContactsList] = useState<unknown[]>([]);
  const [form, setForm] = useState({
    transaction_type: 'sale',
    property_id: '',
    client_contact_id: '',
    list_price: '',
  });

  useEffect(() => {
    transactions.list().then((r) => setList(r as Record<string, unknown>[])).catch(() => setList([])).finally(() => setLoading(false));
    import('../lib/api').then(({ properties: p, contacts: c }) => {
      p.list().then((r: unknown) => setProperties(r as unknown[]));
      c.list().then((r: unknown) => setContactsList(r as unknown[]));
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await import('../lib/api').then((m) => m.transactions.create({
        ...form,
        list_price: form.list_price ? Number(form.list_price) : undefined,
      }));
      setList([]);
      transactions.list().then(setList);
      setShowForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('الصفقات', 'Transactions')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{t('بيع، شراء، إيجار', 'Sale, purchase, lease')}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
          {showForm ? t('إلغاء', 'Cancel') : t('صفقة جديدة', 'New Transaction')}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('نوع الصفقة', 'Type')}</label>
            <select value={form.transaction_type} onChange={(e) => setForm({ ...form, transaction_type: e.target.value })} className="w-full px-4 py-2 rounded-lg border">
              <option value="sale">{t('بيع', 'Sale')}</option>
              <option value="purchase">{t('شراء', 'Purchase')}</option>
              <option value="lease">{t('إيجار', 'Lease')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('العقار', 'Property')}</label>
            <select required value={form.property_id} onChange={(e) => setForm({ ...form, property_id: e.target.value })} className="w-full px-4 py-2 rounded-lg border">
              <option value="">{t('اختر عقار', 'Select')}</option>
              {(properties as Record<string, unknown>[]).map((p: Record<string, unknown>) => (
                <option key={String(p.id)} value={String(p.id)}>{String(p?.title_ar ?? '')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('العميل', 'Client')}</label>
            <select required value={form.client_contact_id} onChange={(e) => setForm({ ...form, client_contact_id: e.target.value })} className="w-full px-4 py-2 rounded-lg border">
              <option value="">{t('اختر عميل', 'Select')}</option>
              {(contactsList as Record<string, unknown>[]).map((c: Record<string, unknown>) => (
                <option key={String(c.id)} value={String(c.id)}>{String(c?.first_name_ar ?? '')} {String(c?.last_name_ar ?? '')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('السعر (ر.س)', 'Price')}</label>
            <input type="number" value={form.list_price} onChange={(e) => setForm({ ...form, list_price: e.target.value })} className="w-full px-4 py-2 rounded-lg border" />
          </div>
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">{t('إنشاء', 'Create')}</button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12">{t('جاري التحميل...', 'Loading...')}</div>
      ) : list.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow">
          <p className="text-6xl mb-4">🤝</p>
          <h3 className="text-lg font-semibold">{t('لا توجد صفقات', 'No transactions')}</h3>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="text-right py-3 px-4">{t('العقار', 'Property')}</th>
                <th className="text-right py-3 px-4">{t('العميل', 'Client')}</th>
                <th className="text-right py-3 px-4">{t('النوع', 'Type')}</th>
                <th className="text-right py-3 px-4">{t('الحالة', 'Status')}</th>
                <th className="text-right py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((tx) => (
                <tr key={String(tx.id)} className="border-t">
                  <td className="py-3 px-4">{String(tx.property_title)}</td>
                  <td className="py-3 px-4">{String(tx.client_first_name)} {String(tx.client_last_name)}</td>
                  <td className="py-3 px-4">{String(tx.transaction_type)}</td>
                  <td className="py-3 px-4">{String(tx.status)}</td>
                  <td className="py-3 px-4">
                    <Link to={`/transactions/${tx.id}`} className="text-primary-600">{t('عرض', 'View')}</Link>
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
