import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { requests, properties } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { HiOutlineArrowRight } from 'react-icons/hi2';

export function RequestDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [req, setReq] = useState<Record<string, unknown> & { offers?: unknown[] } | null>(null);
  const [myProperties, setMyProperties] = useState<unknown[]>([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (id) {
      requests.get(id).then((r: unknown) => setReq(r as Record<string, unknown> & { offers?: unknown[] })).catch(() => setReq(null));
      if (user?.role && ['broker', 'agent', 'admin'].includes(user.role)) {
        properties.list({ status: 'active' }).then((r) => setMyProperties(r as unknown[]));
      }
    }
  }, [id, user?.role]);

  const sendOffer = async () => {
    if (!selectedProperty || !id) return;
    setSending(true);
    try {
      await requests.addOffer(id, selectedProperty, message);
      setReq(null);
      requests.get(id).then(setReq);
      setSelectedProperty('');
      setMessage('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setSending(false);
    }
  };

  if (!req) return <div className="p-8">{t('جاري التحميل...', 'Loading...')}</div>;

  const isBroker = user?.role && ['broker', 'agent', 'admin'].includes(user.role);

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">{t('تفاصيل الطلب', 'Request Details')}</h1>
        <Link to="/requests" className="text-primary-600 flex items-center gap-1"><HiOutlineArrowRight className="w-4 h-4 rtl:rotate-180" />{t('العودة', 'Back')}</Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-slate-500 text-sm">{t('المدينة', 'City')}</span>
            <p className="font-medium">{String(req.city)}</p>
          </div>
          <div>
            <span className="text-slate-500 text-sm">{t('الميزانية', 'Budget')}</span>
            <p className="font-medium">
              {req.budget_min ? `${Number(req.budget_min).toLocaleString()} - ` : ''}
              {Number(req.budget_max).toLocaleString()} ر.س
            </p>
          </div>
          <div>
            <span className="text-slate-500 text-sm">{t('الحالة', 'Status')}</span>
            <p className="font-medium">{String(req.status)}</p>
          </div>
          <div>
            <span className="text-slate-500 text-sm">{t('عدد العروض', 'Offers')}</span>
            <p className="font-medium">{Number(req.offers_count ?? 0)}</p>
          </div>
        </div>

        {req.additional_requirements != null && String(req.additional_requirements) && (
          <div>
            <span className="text-slate-500 text-sm">{t('متطلبات إضافية', 'Additional Requirements')}</span>
            <p>{String(req.additional_requirements)}</p>
          </div>
        )}

        {Array.isArray(req.offers) && req.offers.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-4">{t('العروض المستلمة', 'Received Offers')}</h3>
            <div className="space-y-4">
              {(req.offers as Record<string, unknown>[]).map((offer) => (
                <Link
                  key={String(offer.id)}
                  to={`/properties/${offer.property_id}`}
                  className="block p-4 border rounded-lg hover:border-primary-500"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{String(offer.title_ar)}</span>
                    <span className="text-primary-600">{Number(offer.price).toLocaleString()} ر.س</span>
                  </div>
                  <p className="text-sm text-slate-500">{String(offer.district)}, {String(offer.city)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {isBroker && myProperties.length > 0 && (
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <h3 className="font-semibold mb-4">{t('إرسال عرض', 'Send Offer')}</h3>
            <div className="space-y-4">
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
              >
                <option value="">{t('اختر عقار', 'Select property')}</option>
                {(myProperties as Record<string, unknown>[]).map((p) => (
                  <option key={String(p.id)} value={String(p.id)}>
                    {String(p.title_ar)} - {Number(p.price).toLocaleString()} ر.س
                  </option>
                ))}
              </select>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('رسالة للطالب', 'Message to seeker')}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border"
              />
              <button
                onClick={sendOffer}
                disabled={!selectedProperty || sending}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg"
              >
                {sending ? t('جاري...', 'Sending...') : t('إرسال العرض', 'Send Offer')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
