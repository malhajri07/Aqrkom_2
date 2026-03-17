import { useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { PhoneInput } from '../components/common/PhoneInput';
import { PriceInput } from '../components/common/PriceInput';
import {
  HiOutlineClipboardDocumentList,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineCurrencyDollar,
  HiOutlineHomeModern,
} from 'react-icons/hi2';

const REQUEST_TYPES = [
  { value: 'buy', ar: 'شراء', en: 'Buy' },
  { value: 'rent', ar: 'إيجار', en: 'Rent' },
];

const PROPERTY_TYPES = [
  { value: 'apartment', ar: 'شقة', en: 'Apartment' },
  { value: 'villa', ar: 'فيلا', en: 'Villa' },
  { value: 'land', ar: 'أرض', en: 'Land' },
  { value: 'office', ar: 'مكتب', en: 'Office' },
  { value: 'building', ar: 'عمارة', en: 'Building' },
  { value: 'warehouse', ar: 'مستودع', en: 'Warehouse' },
  { value: 'shop', ar: 'محل', en: 'Shop' },
];

export function PublicRequest() {
  const { t, isRtl, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    request_type: 'buy',
    property_type: 'apartment',
    city: '',
    min_budget: '',
    max_budget: '',
    bedrooms: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/public/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg = body?.error?.message || body?.error || t('حدث خطأ أثناء إرسال الطلب', 'Request submission failed');
        throw new Error(msg);
      }

      const body = await res.json();
      const data = body?.data ?? body;
      setReferenceNumber(data?.reference || data?.reference_number || data?.id || 'REQ-' + Date.now());
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('حدث خطأ', 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-holly-50 flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="bg-white rounded-2xl shadow-sm border border-holly-100 p-8 max-w-md w-full text-center" data-testid="request-success">
          <div className="w-16 h-16 rounded-full bg-holly-100 text-holly-600 flex items-center justify-center mx-auto mb-4">
            <HiOutlineCheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {t('تم إرسال الطلب بنجاح!', 'Request Submitted!')}
          </h2>
          <p className="text-sm text-slate-500 mb-3">
            {t('سيتم مراجعة طلبك والتواصل معك قريباً', 'Your request will be reviewed and we\'ll contact you soon')}
          </p>
          <div className="bg-holly-50 rounded-lg p-3 mb-6">
            <p className="text-xs text-slate-500">{t('رقم المرجع', 'Reference Number')}</p>
            <p className="text-lg font-bold text-holly-700 font-mono">{referenceNumber}</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-holly-600 text-white rounded-lg hover:bg-holly-700 transition-colors font-medium text-sm"
            >
              {t('الرئيسية', 'Home')}
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-holly-200 text-holly-700 rounded-lg hover:bg-holly-50 transition-colors font-medium text-sm"
            >
              {t('استعراض العقارات', 'Browse Properties')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-holly-50 py-8 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-holly-100 p-8" data-testid="public-request-form">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-holly-100 text-holly-600 flex items-center justify-center mx-auto mb-3">
              <HiOutlineClipboardDocumentList className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t('طلب عقاري', 'Property Request')}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t('أرسل طلبك وسيقوم وسيط معتمد بالتواصل معك', 'Submit your request and a certified broker will contact you')}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <HiOutlineUser className="w-4 h-4 inline me-1" />
                  {t('الاسم', 'Name')}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  data-testid="request-name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <HiOutlinePhone className="w-4 h-4 inline me-1" />
                  {t('رقم الجوال', 'Phone')}
                </label>
                <PhoneInput
                  required
                  data-testid="request-phone"
                  value={form.phone}
                  onChange={(v) => setForm({ ...form, phone: v })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <HiOutlineEnvelope className="w-4 h-4 inline me-1" />
                {t('البريد الإلكتروني', 'Email')}
              </label>
              <input
                type="email"
                name="email"
                data-testid="request-email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('نوع الطلب', 'Request Type')}
                </label>
                <select
                  name="request_type"
                  data-testid="request-type"
                  value={form.request_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                >
                  {REQUEST_TYPES.map((rt) => (
                    <option key={rt.value} value={rt.value}>{t(rt.ar, rt.en)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <HiOutlineHomeModern className="w-4 h-4 inline me-1" />
                  {t('نوع العقار', 'Property Type')}
                </label>
                <select
                  name="property_type"
                  data-testid="request-property-type"
                  value={form.property_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt.value} value={pt.value}>{t(pt.ar, pt.en)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('المدينة', 'City')}
              </label>
              <input
                type="text"
                name="city"
                required
                data-testid="request-city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                placeholder={t('الرياض', 'Riyadh')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <HiOutlineCurrencyDollar className="w-4 h-4 inline me-1" />
                  {t('أقل ميزانية', 'Min Budget')}
                </label>
                <PriceInput
                  data-testid="request-min-budget"
                  value={form.min_budget ? Number(form.min_budget) : undefined}
                  onChange={(v) => setForm({ ...form, min_budget: v != null ? String(v) : '' })}
                  locale={language}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('أعلى ميزانية', 'Max Budget')}
                </label>
                <PriceInput
                  data-testid="request-max-budget"
                  value={form.max_budget ? Number(form.max_budget) : undefined}
                  onChange={(v) => setForm({ ...form, max_budget: v != null ? String(v) : '' })}
                  locale={language}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('غرف النوم', 'Bedrooms')}
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={form.bedrooms}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('وصف إضافي', 'Description')}
              </label>
              <textarea
                name="description"
                data-testid="request-description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500 resize-none"
                placeholder={t('أي تفاصيل إضافية عن طلبك...', 'Any additional details about your request...')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="request-submit"
              className="w-full py-3 bg-holly-600 text-white font-semibold rounded-lg hover:bg-holly-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('جاري الإرسال...', 'Submitting...') : t('إرسال الطلب', 'Submit Request')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <Link to="/" className="text-holly-600 hover:text-holly-700 font-medium">
              {t('الرئيسية', 'Home')}
            </Link>
            {' · '}
            <Link to="/search" className="text-holly-600 hover:text-holly-700 font-medium">
              {t('استعراض العقارات', 'Browse Properties')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
