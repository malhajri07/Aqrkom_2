import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { transactions } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { HiOutlineArrowRight } from 'react-icons/hi2';

export function TransactionDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [tx, setTx] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (id) {
      transactions.get(id).then((r) => setTx(r as Record<string, unknown>)).catch(() => setTx(null));
    }
  }, [id]);

  if (!tx) return <div className="p-8">{t('جاري التحميل...', 'Loading...')}</div>;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">{t('تفاصيل الصفقة', 'Transaction Details')}</h1>
        <Link to="/transactions" className="text-primary-600 flex items-center gap-1"><HiOutlineArrowRight className="w-4 h-4 rtl:rotate-180" />{t('العودة', 'Back')}</Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow space-y-4">
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
      </div>
    </div>
  );
}
