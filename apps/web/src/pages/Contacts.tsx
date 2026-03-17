import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { contacts } from '../lib/api';
import { useContactsList, useContactCreate, useContactImport } from '../features/contacts/api';
import { useLanguage } from '../context/LanguageContext';
import { CONTACT_TYPES, LEAD_SOURCES } from '@aqarkom/shared';
import {
  HiOutlineUsers,
  HiOutlinePlusCircle,
  HiOutlineMagnifyingGlass,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineFunnel,
  HiOutlineArrowDownTray,
  HiOutlineArrowUpTray,
} from 'react-icons/hi2';
import { FaWhatsapp } from 'react-icons/fa';
import { PhoneInput } from '../components/common/PhoneInput';

export function Contacts() {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [form, setForm] = useState({ contact_type: 'buyer', first_name_ar: '', last_name_ar: '', phone: '', email: '', lead_source: 'website' });

  const queryFilters = useMemo(() => {
    const params: Record<string, string> = {};
    if (typeFilter) params.contact_type = typeFilter;
    if (sourceFilter) params.lead_source = sourceFilter;
    return params;
  }, [typeFilter, sourceFilter]);

  const { data: list = [], isLoading: loading } = useContactsList(queryFilters);
  const createMutation = useContactCreate();
  const importMutation = useContactImport();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      const headers = lines[0]?.split(',').map((h) => h.trim().replace(/^"|"$/g, '')) || [];
      const rows = lines.slice(1).map((line) => {
        const values = line.match(/(".*?"|[^,]+)/g)?.map((v) => v.replace(/^"|"$/g, '').trim()) || [];
        return headers.reduce((acc, h, i) => ({ ...acc, [h]: values[i] || '' }), {} as Record<string, string>);
      });
      await importMutation.mutateAsync({
        rows,
        fieldMapping: {
          first_name_ar: headers.find((h) => /first|اسم|name/i.test(h)) || 'first_name_ar',
          last_name_ar: headers.find((h) => /last|عائلة|family/i.test(h)) || 'last_name_ar',
          phone: headers.find((h) => /phone|هاتف|mobile/i.test(h)) || 'phone',
          email: headers.find((h) => /email|بريد/i.test(h)) || 'email',
        },
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Import failed');
    } finally {
      e.target.value = '';
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(form);
      setShowForm(false);
      setForm({ contact_type: 'buyer', first_name_ar: '', last_name_ar: '', phone: '', email: '', lead_source: 'website' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  const filteredList = (list as Record<string, unknown>[]).filter((c) => {
    const matchesSearch = !searchQuery || String(c.first_name_ar || '').includes(searchQuery) || String(c.last_name_ar || '').includes(searchQuery) || String(c.phone || '').includes(searchQuery);
    const matchesType = !typeFilter || c.contact_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const TYPE_COLORS: Record<string, string> = {
    buyer: 'bg-blue-50 text-blue-700', seller: 'bg-amber-50 text-amber-700', tenant: 'bg-purple-50 text-purple-700',
    landlord: 'bg-holly-50 text-holly-700', vendor: 'bg-orange-50 text-orange-700', investor: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <div className="space-y-6" data-testid="contacts-page">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('العملاء', 'Contacts')}</h1>
          <p className="text-slate-500 mt-1">{t('إدارة جهات الاتصال والعملاء المحتملين', 'Manage contacts & leads')} ({filteredList.length})</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-4 py-2 bg-holly-600 text-white rounded-lg text-sm font-medium hover:bg-holly-700 transition-colors">
          <HiOutlinePlusCircle className="w-4 h-4" />
          {showForm ? t('إلغاء', 'Cancel') : t('إضافة عميل', 'Add Contact')}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-bold text-slate-900">{t('عميل جديد', 'New Contact')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('النوع', 'Type')}</label>
              <select value={form.contact_type} onChange={(e) => setForm({ ...form, contact_type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                {Object.entries(CONTACT_TYPES).map(([k, v]) => (<option key={k} value={k}>{t(v.ar, v.en)}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('الاسم الأول', 'First Name')}</label>
              <input required value={form.first_name_ar} onChange={(e) => setForm({ ...form, first_name_ar: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('اسم العائلة', 'Last Name')}</label>
              <input required value={form.last_name_ar} onChange={(e) => setForm({ ...form, last_name_ar: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('الهاتف', 'Phone')}</label>
              <PhoneInput required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('البريد', 'Email')}</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">{t('مصدر العميل', 'Lead Source')}</label>
              <select value={form.lead_source} onChange={(e) => setForm({ ...form, lead_source: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                {Object.entries(LEAD_SOURCES).map(([k, v]) => (<option key={k} value={k}>{t(v.ar, v.en)}</option>))}
              </select>
            </div>
          </div>
          <button type="submit" disabled={createMutation.isPending} className="px-4 py-2 bg-holly-600 text-white rounded-lg text-sm font-medium hover:bg-holly-700 disabled:opacity-50">{t('حفظ', 'Save')}</button>
        </form>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineMagnifyingGlass className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('بحث بالاسم أو الهاتف...', 'Search by name or phone...')} className="w-full pr-10 pl-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-holly-200 focus:border-holly-400 outline-none" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm">
            <option value="">{t('كل الأنواع', 'All Types')}</option>
            {Object.entries(CONTACT_TYPES).map(([k, v]) => (<option key={k} value={k}>{t(v.ar, v.en)}</option>))}
          </select>
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm">
            <option value="">{t('كل المصادر', 'All Sources')}</option>
            {Object.entries(LEAD_SOURCES).map(([k, v]) => (<option key={k} value={k}>{t(v.ar, v.en)}</option>))}
          </select>
          <button type="button" onClick={async () => { try { await contacts.export(); } catch { alert('Export failed'); } }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">
            <HiOutlineArrowDownTray className="w-4 h-4" />
            {t('تصدير', 'Export')}
          </button>
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50 cursor-pointer">
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} disabled={importMutation.isPending} />
            <HiOutlineArrowUpTray className="w-4 h-4" />
            {importMutation.isPending ? t('جاري...', 'Importing...') : t('استيراد', 'Import')}
          </label>
          {importMutation.data && (
            <span className="text-sm text-slate-600">
              {t('تم استيراد', 'Imported')} {importMutation.data.imported}, {t('تم تخطي', 'Skipped')} {importMutation.data.skipped}
            </span>
          )}
        </div>
      </div>

      {/* Contact List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (<div key={i} className="bg-white rounded-xl h-20 animate-pulse border border-slate-100" />))}
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-slate-100">
          <HiOutlineUsers className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h3 className="text-lg font-semibold text-slate-800">{t('لا يوجد عملاء', 'No contacts')}</h3>
          <button onClick={() => setShowForm(true)} className="mt-4 px-6 py-2.5 bg-holly-600 text-white rounded-lg text-sm font-medium hover:bg-holly-700">{t('إضافة أول عميل', 'Add First Contact')}</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">{t('العميل', 'Contact')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">{t('النوع', 'Type')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">{t('الهاتف', 'Phone')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">{t('المصدر', 'Source')}</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase">{t('إجراءات', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((c) => {
                const typeLabel = CONTACT_TYPES[c.contact_type as keyof typeof CONTACT_TYPES] as { ar: string; en: string } | undefined;
                const typeColor = TYPE_COLORS[String(c.contact_type)] || 'bg-slate-50 text-slate-600';
                return (
                  <tr key={String(c.id)} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <Link to={`/contacts/${c.id}`} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-holly-100 text-holly-700 flex items-center justify-center text-sm font-bold">
                          {String(c.first_name_ar || '').charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{String(c.first_name_ar)} {String(c.last_name_ar)}</p>
                          {c.email && <p className="text-xs text-slate-400">{String(c.email)}</p>}
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColor}`}>
                        {typeLabel ? t(typeLabel.ar, typeLabel.en) : String(c.contact_type)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">{String(c.phone)}</td>
                    <td className="py-3 px-4 text-xs text-slate-400">{String(c.lead_source || '-')}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <a href={`tel:${String(c.phone)}`} className="p-1.5 rounded-lg bg-holly-50 text-holly-600 hover:bg-holly-100 transition-colors"><HiOutlinePhone className="w-3.5 h-3.5" /></a>
                        <a href={`https://wa.me/${String(c.phone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"><FaWhatsapp className="w-3.5 h-3.5" /></a>
                        {c.email && <a href={`mailto:${String(c.email)}`} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"><HiOutlineEnvelope className="w-3.5 h-3.5" /></a>}
                        <Link to={`/contacts/${c.id}`} className="text-xs text-holly-600 hover:text-holly-700 font-medium ms-2">{t('عرض', 'View')}</Link>
                      </div>
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
