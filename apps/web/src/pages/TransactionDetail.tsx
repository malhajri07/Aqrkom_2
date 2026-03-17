import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE, transactions, unwrapEnvelope } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { HiOutlineArrowRight, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';

const CLOSING_CHECKLIST = [
  { key: 'title_deed', ar: 'صك الملكية', en: 'Title Deed' },
  { key: 'id_copy', ar: 'نسخة الهوية', en: 'ID Copy' },
  { key: 'rega_license', ar: 'ترخيص REGA', en: 'REGA License' },
  { key: 'ejar_contract', ar: 'عقد إيجار', en: 'Ejar Contract' },
  { key: 'power_of_attorney', ar: 'الوكالة', en: 'Power of Attorney' },
  { key: 'nin', ar: 'رقم الهوية الوطنية', en: 'NIN' },
];

export function TransactionDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [tx, setTx] = useState<Record<string, unknown> | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'rent'>('overview');
  const [rentPayments, setRentPayments] = useState<Record<string, unknown>[]>([]);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id) {
      transactions.get(id).then((r) => setTx(r as Record<string, unknown>)).catch(() => setTx(null));
      fetch(`${API_BASE}/transactions/${id}/rent-payments`, { headers: { Authorization: `Bearer ${localStorage.getItem('aqarkom_token')}` } })
        .then((r) => (r.ok ? r.json() : []))
        .then((b) => setRentPayments(Array.isArray(unwrapEnvelope(b)) ? (unwrapEnvelope(b) as Record<string, unknown>[]) : []))
        .catch(() => setRentPayments([]));
    }
  }, [id]);

  if (!tx) return <div className="p-8">{t('جاري التحميل...', 'Loading...')}</div>;

  const toggleChecklist = (key: string) => setChecklist((c) => ({ ...c, [key]: !c[key] }));
  const isLease = tx.transaction_type === 'lease';

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">{t('تفاصيل الصفقة', 'Transaction Details')}</h1>
        <Link to="/transactions" className="text-primary-600 flex items-center gap-1"><HiOutlineArrowRight className="w-4 h-4 rtl:rotate-180" />{t('العودة', 'Back')}</Link>
      </div>

      <div className="flex gap-2 mb-4">
        {(['overview', 'checklist', 'rent'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg ${activeTab === tab ? 'bg-primary-600 text-white' : 'bg-slate-100'}`}>
            {tab === 'overview' && t('نظرة عامة', 'Overview')}
            {tab === 'checklist' && t('قائمة الإغلاق', 'Closing Checklist')}
            {tab === 'rent' && t('إيجار', 'Rent')}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow space-y-4">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-500 text-sm">{t('النوع', 'Type')}</span>
                <p className="font-medium">{String(tx.transaction_type)}</p>
              </div>
              <div>
                <span className="text-slate-500 text-sm">{t('الحالة', 'Status')}</span>
                <p className="font-medium">{String(tx.status)}</p>
              </div>
              <div>
                <span className="text-slate-500 text-sm">{t('العقار', 'Property')}</span>
                <p className="font-medium">{String(tx.property_title)}</p>
              </div>
              <div>
                <span className="text-slate-500 text-sm">{t('العميل', 'Client')}</span>
                <p className="font-medium">{String(tx.client_first_name)} {String(tx.client_last_name)}</p>
              </div>
            </div>

            {(tx.final_price || tx.list_price) && (
              <div>
                <span className="text-slate-500 text-sm">{t('السعر', 'Price')}</span>
                <p className="text-xl font-bold text-primary-600">
                  {Number(tx.final_price || tx.list_price).toLocaleString('ar-SA')} ر.س
                </p>
              </div>
            )}

            {(tx.commission_amount || tx.vat_amount) && (
              <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <h4 className="font-semibold mb-2">{t('العمولة', 'Commission')}</h4>
                <p>{Number(tx.commission_amount || 0).toLocaleString('ar-SA')} ر.س</p>
                {tx.vat_amount && <p className="text-sm text-slate-500">VAT: {Number(tx.vat_amount).toLocaleString('ar-SA')} ر.س</p>}
              </div>
            )}
          </>
        )}

        {activeTab === 'checklist' && (
          <div>
            <h4 className="font-semibold mb-4">{t('قائمة الإغلاق - المستندات المطلوبة', 'Closing Checklist - Required Documents')}</h4>
            <div className="space-y-2">
              {CLOSING_CHECKLIST.map((item) => (
                <div key={item.key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                  <button type="button" onClick={() => toggleChecklist(item.key)}>
                    {checklist[item.key] ? <HiOutlineCheckCircle className="w-6 h-6 text-green-600" /> : <HiOutlineXCircle className="w-6 h-6 text-slate-300" />}
                  </button>
                  <span className={checklist[item.key] ? 'line-through text-slate-500' : ''}>{t(item.ar, item.en)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rent' && (
          <div>
            <h4 className="font-semibold mb-4">{t('سجل الإيجار', 'Rent Roll')}</h4>
            {rentPayments.length === 0 ? (
              <p className="text-slate-500">{t('لا توجد دفعات مسجلة', 'No payment records')}</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2">{t('التاريخ', 'Date')}</th>
                    <th className="text-right py-2">{t('المبلغ', 'Amount')}</th>
                    <th className="text-right py-2">{t('الحالة', 'Status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rentPayments.map((p) => (
                    <tr key={String(p.id)} className="border-b">
                      <td className="py-2">{String(p.payment_date)}</td>
                      <td className="py-2">{Number(p.amount).toLocaleString('ar-SA')} ر.س</td>
                      <td className="py-2">{String(p.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
