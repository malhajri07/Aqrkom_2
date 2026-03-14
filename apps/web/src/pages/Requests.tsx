import { useLanguage } from '../context/LanguageContext';

export function Requests() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('طلبات العقارات', 'Property Requests')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t('صندوق الوارد - نمط ديل أب', 'Request inbox - DealApp style')}
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          {t('طلب عقاري جديد', 'New Property Request')}
        </button>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow-sm border border-slate-200 dark:border-slate-700">
        <p className="text-6xl mb-4">📥</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t('لا توجد طلبات في منطقتك', 'No requests in your area')}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
          {t(
            'عندما يقدم طالب عقار طلباً في أحيائك النشطة، سيظهر هنا. تأكد من تحديث أحيائك في الإعدادات.',
            'When a seeker submits a request in your active neighborhoods, it will appear here. Update your neighborhoods in settings.'
          )}
        </p>
      </div>
    </div>
  );
}
