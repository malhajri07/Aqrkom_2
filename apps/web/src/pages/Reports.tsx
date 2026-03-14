import { useLanguage } from '../context/LanguageContext';

export function Reports() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('التقارير', 'Reports')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {t('تحليلات وأداء المبيعات', 'Sales analytics and performance')}
        </p>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow-sm border border-slate-200 dark:border-slate-700">
        <p className="text-6xl mb-4">📈</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t('التقارير قريباً', 'Reports coming soon')}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {t('لوحة التحليلات ستكون متاحة في المرحلة الثانية', 'Analytics dashboard in Phase 2')}
        </p>
      </div>
    </div>
  );
}
