import { useLanguage } from '../context/LanguageContext';

export function Settings() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('الإعدادات', 'Settings')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {t('تخصيص اللغة والتفضيلات', 'Language and preferences')}
        </p>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          {t('اللغة', 'Language')}
        </h2>
        <div className="flex gap-4">
          <button
            onClick={() => setLanguage('ar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              language === 'ar'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            العربية
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              language === 'en'
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
}
