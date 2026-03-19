import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTransactionsList, useTransactionCreate, useTransactionFormData } from '../features/transactions/api';
import { HiOutlineCurrencyDollar } from 'react-icons/hi2';
import { PriceInput } from '../components/common/PriceInput';

export function Transactions() {
  const { t } = useTranslation('transactions');
  const { t: tCommon } = useTranslation('common');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    transaction_type: 'sale',
    property_id: '',
    client_contact_id: '',
    list_price: '',
  });

  const { data: list = [], isLoading: loading } = useTransactionsList();
  const { properties, contacts: contactsList, isLoading: formLoading } = useTransactionFormData();
  const createMutation = useTransactionCreate();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        ...form,
        list_price: form.list_price ? Number(form.list_price) : undefined,
      });
      setShowForm(false);
      setForm({ transaction_type: 'sale', property_id: '', client_contact_id: '', list_price: '' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <div className="space-y-6" data-testid="transactions-page">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{t('subtitle')}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium" data-testid="transaction-new-btn">
          {showForm ? tCommon('buttons.cancel') : t('newTransaction')}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('type')}</label>
            <select value={form.transaction_type} onChange={(e) => setForm({ ...form, transaction_type: e.target.value })} className="w-full px-4 py-2 rounded-lg border">
              <option value="sale">{t('typeSale')}</option>
              <option value="purchase">{t('typePurchase')}</option>
              <option value="lease">{t('typeLease')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('property')}</label>
            <select required value={form.property_id} onChange={(e) => setForm({ ...form, property_id: e.target.value })} className="w-full px-4 py-2 rounded-lg border">
              <option value="">{t('selectProperty')}</option>
              {(properties as Record<string, unknown>[]).map((p: Record<string, unknown>) => (
                <option key={String(p.id)} value={String(p.id)}>{String(p.title_ar ?? '')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('client')}</label>
            <select required value={form.client_contact_id} onChange={(e) => setForm({ ...form, client_contact_id: e.target.value })} className="w-full px-4 py-2 rounded-lg border" disabled={formLoading}>
              <option value="">{t('selectClient')}</option>
              {contactsList.map((c) => (
                <option key={String(c.id)} value={String(c.id)}>{String(c.first_name_ar ?? '')} {String(c.last_name_ar ?? '')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('price')}</label>
            <PriceInput
              value={form.list_price ? Number(form.list_price) : undefined}
              onChange={(v) => setForm({ ...form, list_price: v != null ? String(v) : '' })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-primary-600 text-white rounded-lg disabled:opacity-50">{t('create')}</button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12">{t('loading')}</div>
      ) : list.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow">
          <HiOutlineCurrencyDollar className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold">{t('noTransactions')}</h3>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="text-right py-3 px-4">{t('property')}</th>
                <th className="text-right py-3 px-4">{t('client')}</th>
                <th className="text-right py-3 px-4">{t('type')}</th>
                <th className="text-right py-3 px-4">{t('status')}</th>
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
                    <Link to={`/transactions/${tx.id}`} className="text-primary-600">{t('view')}</Link>
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
