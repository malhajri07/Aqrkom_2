import { useLanguage } from '../context/LanguageContext';

export function Contacts() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('العملاء', 'Contacts')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t('إدارة جهات الاتصال والعملاء', 'Contact and client management')}
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          {t('إضافة عميل', 'Add Contact')}
        </button>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow-sm border border-slate-200 dark:border-slate-700">
        <p className="text-6xl mb-4">👥</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t('لا يوجد عملاء بعد', 'No contacts yet')}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
          {t(
            'أضف عملاءك من استفسارات عقار، طلبات ديل أب، أو يدوياً. دعم الأسماء العربية وأرقام السعودية.',
            'Add clients from Aqar inquiries, DealApp requests, or manually. Arabic names and Saudi phone support.'
          )}
        </p>
      </div>
    </div>
  );
}
