import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  HiOutlineDocumentText,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineHomeModern,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
} from 'react-icons/hi2';

const PROPERTY_TYPES = [
  { value: 'apartment', ar: 'شقة', en: 'Apartment' },
  { value: 'villa', ar: 'فيلا', en: 'Villa' },
  { value: 'land', ar: 'أرض', en: 'Land' },
  { value: 'office', ar: 'مكتب', en: 'Office' },
  { value: 'building', ar: 'عمارة', en: 'Building' },
  { value: 'warehouse', ar: 'مستودع', en: 'Warehouse' },
  { value: 'shop', ar: 'محل', en: 'Shop' },
];

const TRANSACTION_TYPES = [
  { value: 'sale', ar: 'بيع', en: 'Sale' },
  { value: 'rent', ar: 'إيجار', en: 'Rent' },
];

export function SubmitListing() {
  const { t, isRtl } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    property_type: 'apartment',
    transaction_type: 'sale',
    city: '',
    district: '',
    description: '',
    estimated_price: '',
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
      const res = await fetch('/api/listings/unverified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          estimated_price: form.estimated_price ? Number(form.estimated_price) : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('حدث خطأ أثناء إرسال القائمة', 'Listing submission failed'));
      }

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
        <div className="bg-white rounded-2xl shadow-sm border border-holly-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-holly-100 text-holly-600 flex items-center justify-center mx-auto mb-4">
            <HiOutlineCheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {t('تم إرسال القائمة بنجاح!', 'Listing Submitted!')}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {t(
              'تم استلام معلومات عقارك. سيتواصل معك وسيط معتمد قريباً للتحقق وإدراج عقارك.',
              'Your property information has been received. A certified broker will contact you soon to verify and list your property.'
            )}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-holly-600 text-white rounded-lg hover:bg-holly-700 transition-colors font-medium text-sm"
          >
            {t('العودة للرئيسية', 'Back to Home')}
            <HiOutlineArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-holly-50 py-8 px-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-holly-100 p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <HiOutlineDocumentText className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t('أضف عقارك', 'Submit Your Property')}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t('أضف عقارك وسيتواصل معك وسيط معتمد', 'Add your property and a certified broker will contact you')}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-holly-50 rounded-xl border border-holly-100 mb-2">
              <h3 className="text-sm font-semibold text-holly-800 mb-3">
                {t('معلومات المالك', 'Owner Information')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <HiOutlineUser className="w-4 h-4 inline me-1" />
                    {t('اسم المالك', 'Owner Name')}
                  </label>
                  <input
                    type="text"
                    name="owner_name"
                    required
                    value={form.owner_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <HiOutlinePhone className="w-4 h-4 inline me-1" />
                    {t('رقم الجوال', 'Phone')}
                  </label>
                  <input
                    type="tel"
                    name="owner_phone"
                    required
                    value={form.owner_phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <HiOutlineEnvelope className="w-4 h-4 inline me-1" />
                  {t('البريد الإلكتروني', 'Email')}
                </label>
                <input
                  type="email"
                  name="owner_email"
                  value={form.owner_email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <HiOutlineHomeModern className="w-4 h-4 inline me-1" />
                  {t('نوع العقار', 'Property Type')}
                </label>
                <select
                  name="property_type"
                  value={form.property_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                >
                  {PROPERTY_TYPES.map((pt) => (
                    <option key={pt.value} value={pt.value}>{t(pt.ar, pt.en)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('نوع الصفقة', 'Transaction Type')}
                </label>
                <select
                  name="transaction_type"
                  value={form.transaction_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                >
                  {TRANSACTION_TYPES.map((tt) => (
                    <option key={tt.value} value={tt.value}>{t(tt.ar, tt.en)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  <HiOutlineMapPin className="w-4 h-4 inline me-1" />
                  {t('المدينة', 'City')}
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                  placeholder={t('الرياض', 'Riyadh')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {t('الحي', 'District')}
                </label>
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <HiOutlineCurrencyDollar className="w-4 h-4 inline me-1" />
                {t('السعر التقديري (ريال)', 'Estimated Price (SAR)')}
              </label>
              <input
                type="number"
                name="estimated_price"
                value={form.estimated_price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('وصف العقار', 'Property Description')}
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500 resize-none"
                placeholder={t('وصف تفصيلي للعقار...', 'Detailed property description...')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-holly-600 text-white font-semibold rounded-lg hover:bg-holly-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('جاري الإرسال...', 'Submitting...') : t('إرسال القائمة', 'Submit Listing')}
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
