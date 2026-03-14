import { useLanguage } from '../context/LanguageContext';

export function Transactions() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('الصفقات', 'Transactions')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {t('بيع، شراء، إيجار - خط أنابيب الصفقات', 'Sale, purchase, lease - transaction pipeline')}
        </p>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow-sm border border-slate-200 dark:border-slate-700">
        <p className="text-6xl mb-4">🤝</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t('لا توجد صفقات نشطة', 'No active transactions')}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
          {t(
            'عندما تبدأ صفقة بيع أو إيجار، ستظهر هنا مع لوحة كانبان للتتبع.',
            'When you start a sale or lease deal, it will appear here with a Kanban board for tracking.'
          )}
        </p>
      </div>
    </div>
  );
}
