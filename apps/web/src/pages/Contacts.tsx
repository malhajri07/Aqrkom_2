import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contacts } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { CONTACT_TYPES } from '@aqarkom/shared';
import { HiOutlineUsers } from 'react-icons/hi2';

export function Contacts() {
  const { t } = useLanguage();
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    contact_type: 'buyer',
    first_name_ar: '',
    last_name_ar: '',
    phone: '',
    email: '',
    lead_source: 'website',
  });

  useEffect(() => {
    contacts.list().then((r) => setList(r as Record<string, unknown>[])).catch(() => setList([])).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contacts.create(form);
      setList([...list, form as Record<string, unknown>]);
      setShowForm(false);
      setForm({ contact_type: 'buyer', first_name_ar: '', last_name_ar: '', phone: '', email: '', lead_source: 'website' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('العملاء', 'Contacts')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{t('إدارة جهات الاتصال', 'Contact management')}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium">
          {showForm ? t('إلغاء', 'Cancel') : t('إضافة عميل', 'Add Contact')}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('النوع', 'Type')}</label>
              <select value={form.contact_type} onChange={(e) => setForm({ ...form, contact_type: e.target.value })} className="w-full px-4 py-2 rounded-lg border">
                {Object.entries(CONTACT_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{t(v.ar, v.en)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('الاسم (عربي)', 'Name (Arabic)')}</label>
              <div className="flex gap-2">
                <input required value={form.first_name_ar} onChange={(e) => setForm({ ...form, first_name_ar: e.target.value })} placeholder={t('الاسم الأول', 'First')} className="flex-1 px-4 py-2 rounded-lg border" />
                <input required value={form.last_name_ar} onChange={(e) => setForm({ ...form, last_name_ar: e.target.value })} placeholder={t('العائلة', 'Last')} className="flex-1 px-4 py-2 rounded-lg border" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('الهاتف', 'Phone')}</label>
              <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+966..." className="w-full px-4 py-2 rounded-lg border" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t('البريد', 'Email')}</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2 rounded-lg border" />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">{t('حفظ', 'Save')}</button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12">{t('جاري التحميل...', 'Loading...')}</div>
      ) : list.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow">
          <HiOutlineUsers className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold">{t('لا يوجد عملاء بعد', 'No contacts yet')}</h3>
          <button onClick={() => setShowForm(true)} className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg">
            {t('إضافة أول عميل', 'Add First Contact')}
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="text-right py-3 px-4">{t('الاسم', 'Name')}</th>
                <th className="text-right py-3 px-4">{t('النوع', 'Type')}</th>
                <th className="text-right py-3 px-4">{t('الهاتف', 'Phone')}</th>
                <th className="text-right py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => (
                <tr key={String(c.id)} className="border-t">
                  <td className="py-3 px-4 font-medium">{String(c.first_name_ar)} {String(c.last_name_ar)}</td>
                  <td className="py-3 px-4">{CONTACT_TYPES[c.contact_type as keyof typeof CONTACT_TYPES] ? t((CONTACT_TYPES[c.contact_type as keyof typeof CONTACT_TYPES] as { ar: string; en: string }).ar, (CONTACT_TYPES[c.contact_type as keyof typeof CONTACT_TYPES] as { ar: string; en: string }).en) : String(c.contact_type)}</td>
                  <td className="py-3 px-4">{String(c.phone)}</td>
                  <td className="py-3 px-4">
                    <Link to={`/contacts/${c.id}`} className="text-primary-600">{t('عرض', 'View')}</Link>
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
