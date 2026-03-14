import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  HiOutlineShieldCheck,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineIdentification,
  HiOutlineCheckCircle,
  HiOutlineArrowRight,
} from 'react-icons/hi2';

export function BrokerRegister() {
  const { t, isRtl } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    email: '',
    phone: '',
    password: '',
    first_name_ar: '',
    last_name_ar: '',
    rega_license_number: '',
    role: 'broker',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('حدث خطأ أثناء التسجيل', 'Registration failed'));
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
            {t('تم التسجيل بنجاح!', 'Registration Successful!')}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {t(
              'تم إرسال طلب التسجيل كوسيط. سيتم مراجعته والتواصل معك قريباً.',
              'Your broker registration request has been submitted. It will be reviewed shortly.'
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
    <div className="min-h-screen bg-holly-50 flex items-center justify-center p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-sm border border-holly-100 p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-holly-100 text-holly-600 flex items-center justify-center mx-auto mb-3">
            <HiOutlineShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('تسجيل وسيط عقاري', 'Broker Registration')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {t('أنشئ حسابك كوسيط عقاري معتمد', 'Create your authorized broker account')}
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
                {t('الاسم الأول', 'First Name')}
              </label>
              <input
                type="text"
                name="first_name_ar"
                required
                value={form.first_name_ar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                placeholder={t('محمد', 'Mohammed')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <HiOutlineUser className="w-4 h-4 inline me-1" />
                {t('اسم العائلة', 'Last Name')}
              </label>
              <input
                type="text"
                name="last_name_ar"
                required
                value={form.last_name_ar}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
                placeholder={t('العقاري', 'Al-Aqari')}
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
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
              placeholder="broker@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <HiOutlinePhone className="w-4 h-4 inline me-1" />
              {t('رقم الجوال', 'Phone')}
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
              placeholder="+966 5x xxx xxxx"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <HiOutlineLockClosed className="w-4 h-4 inline me-1" />
              {t('كلمة المرور', 'Password')}
            </label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <HiOutlineIdentification className="w-4 h-4 inline me-1" />
              {t('رقم رخصة هيئة العقار (REGA)', 'REGA License Number')}
            </label>
            <input
              type="text"
              name="rega_license_number"
              value={form.rega_license_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
              placeholder={t('اختياري', 'Optional')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-holly-600 text-white font-semibold rounded-lg hover:bg-holly-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('جاري التسجيل...', 'Registering...') : t('سجل كوسيط', 'Register as Broker')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          {t('لديك حساب؟', 'Already have an account?')}{' '}
          <Link to="/login" className="text-holly-600 hover:text-holly-700 font-medium">
            {t('تسجيل الدخول', 'Sign In')}
          </Link>
          {' · '}
          <Link to="/" className="text-holly-600 hover:text-holly-700 font-medium">
            {t('الرئيسية', 'Home')}
          </Link>
        </div>
      </div>
    </div>
  );
}
