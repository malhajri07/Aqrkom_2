import { useLanguage } from '../context/LanguageContext';

export function Properties() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('قائمة العقارات', 'Property List')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {t('إدارة إعلاناتك العقارية - نمط عقار', 'Manage your property listings - Aqar style')}
          </p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          {t('إضافة إعلان', 'Add Listing')}
        </button>
      </header>

      {/* Search & filters placeholder - PM-006 */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap gap-4">
          <input
            type="search"
            placeholder={t('بحث بالمدينة، الحي، السعر...', 'Search by city, neighborhood, price...')}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
          />
          <select className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
            <option>{t('نوع العقار', 'Property Type')}</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700">
            <option>{t('نوع المعاملة', 'Transaction Type')}</option>
          </select>
        </div>
      </div>

      {/* Empty state */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center shadow-sm border border-slate-200 dark:border-slate-700">
        <p className="text-6xl mb-4">🏢</p>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t('لا توجد إعلانات بعد', 'No listings yet')}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-md mx-auto">
          {t(
            'ابدأ بإضافة أول إعلان عقاري. ادخل التفاصيل، الصور، والموقع على الخريطة.',
            'Start by adding your first property listing. Enter details, photos, and map location.'
          )}
        </p>
        <button className="mt-6 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          {t('إضافة أول إعلان', 'Add First Listing')}
        </button>
      </div>
    </div>
  );
}
