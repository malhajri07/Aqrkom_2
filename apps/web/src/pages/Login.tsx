import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { loginSchema, type LoginInput } from '@aqarkom/shared';

export function Login() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const err = searchParams.get('error');
    if (err === 'nafath_failed') setError('فشل التحقق من نفاذ');
  }, [searchParams]);
  const { login } = useAuth();
  const { t: tAuth } = useTranslation('auth');
  const { t: tCommon } = useTranslation('common');
  const { toggleLanguage, isRtl } = useLanguage();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginInput) => {
    setError('');
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-holly-50 dark:bg-slate-900 p-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-holly-700">عقاركم</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {tAuth('login')}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div role="alert" className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm" data-testid="login-error">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {tAuth('email')}
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 aria-invalid:border-red-500"
                data-testid="login-email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {tAuth('password')}
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 aria-invalid:border-red-500"
                data-testid="login-password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600" role="alert">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3"
              data-testid="login-submit"
            >
              {loading ? tCommon('labels.loading') : tAuth('login')}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            <Button
              type="button"
              variant="outline"
              className="w-full py-2.5"
              data-testid="nafath-login-btn"
              disabled={loading}
              onClick={async () => {
                setError('');
                setLoading(true);
                try {
                  const { auth } = await import('../lib/api');
                  const { nafathUrl } = await auth.nafathInit();
                  window.location.href = nafathUrl;
                } catch (err) {
                  setError(err instanceof Error ? err.message : 'Nafath غير متاح');
                  setLoading(false);
                }
              }}
            >
              {tAuth('loginWithNafath')}
            </Button>
            <p className="text-center text-xs text-slate-500">{tAuth('orUseEmail')}</p>
            <p className="text-center text-sm text-slate-500">
              {tAuth('demoCredentials')}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={toggleLanguage}
          className="mt-4 w-full py-2 text-sm text-muted-foreground hover:text-foreground"
        >
          {isRtl ? 'English' : 'العربية'}
        </Button>
      </div>
    </div>
  );
}
