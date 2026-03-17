import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '../context/LanguageContext';
import { registerSchema, type RegisterInput } from '@aqarkom/shared';
import { Button } from '../components/ui/button';
import { PhoneInput } from '../components/common/PhoneInput';
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
  const [success, setSuccess] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      first_name_ar: '',
      last_name_ar: '',
      role: 'broker',
      rega_license_number: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, role: data.role || 'broker' }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = body?.error?.message || body?.error || t('حدث خطأ أثناء التسجيل', 'Registration failed');
      setError('root', { message: msg });
      return;
    }

    setSuccess(true);
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errors.root && (
            <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {errors.root.message}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name_ar" className="block text-sm font-medium text-slate-700 mb-1">
                <HiOutlineUser className="w-4 h-4 inline me-1" />
                {t('الاسم الأول', 'First Name')}
              </label>
              <input
                id="first_name_ar"
                type="text"
                {...register('first_name_ar')}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500 aria-invalid:border-red-500"
                placeholder={t('محمد', 'Mohammed')}
              />
              {errors.first_name_ar && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.first_name_ar.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="last_name_ar" className="block text-sm font-medium text-slate-700 mb-1">
                <HiOutlineUser className="w-4 h-4 inline me-1" />
                {t('اسم العائلة', 'Last Name')}
              </label>
              <input
                id="last_name_ar"
                type="text"
                {...register('last_name_ar')}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500 aria-invalid:border-red-500"
                placeholder={t('العقاري', 'Al-Aqari')}
              />
              {errors.last_name_ar && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.last_name_ar.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              <HiOutlineEnvelope className="w-4 h-4 inline me-1" />
              {t('البريد الإلكتروني', 'Email')}
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500 aria-invalid:border-red-500"
              placeholder="broker@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600" role="alert">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              <HiOutlinePhone className="w-4 h-4 inline me-1" />
              {t('رقم الجوال', 'Phone')}
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  id="phone"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500 aria-invalid:border-red-500"
                />
              )}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600" role="alert">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              <HiOutlineLockClosed className="w-4 h-4 inline me-1" />
              {t('كلمة المرور', 'Password')}
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500 aria-invalid:border-red-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600" role="alert">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="rega_license_number" className="block text-sm font-medium text-slate-700 mb-1">
              <HiOutlineIdentification className="w-4 h-4 inline me-1" />
              {t('رقم رخصة هيئة العقار (REGA)', 'REGA License Number')}
            </label>
            <input
              id="rega_license_number"
              type="text"
              {...register('rega_license_number')}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-holly-500 focus:border-holly-500"
              placeholder={t('اختياري', 'Optional')}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3"
          >
            {isSubmitting ? t('جاري التسجيل...', 'Registering...') : t('سجل كوسيط', 'Register as Broker')}
          </Button>
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
