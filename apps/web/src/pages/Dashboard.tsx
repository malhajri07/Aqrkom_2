import { useLanguage } from '../context/LanguageContext';

export function Dashboard() {
  const { t } = useLanguage();

  const kpis = [
    {
      labelAr: 'إعلانات نشطة',
      labelEn: 'Active Listings',
      value: 0,
      icon: '🏢',
    },
    {
      labelAr: 'طلبات مفتوحة',
      labelEn: 'Open Requests',
      value: 0,
      icon: '📥',
    },
    {
      labelAr: 'قيمة الصفقات',
      labelEn: 'Pipeline Value',
      value: '0 ر.س',
      icon: '💰',
    },
    {
      labelAr: 'عمولة محققة',
      labelEn: 'Commission Earned',
      value: '0 ر.س',
      icon: '📈',
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('لوحة التحكم', 'Dashboard')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {t(
            'مرحباً بك في عقاركم - منصة إدارة العقارات والوسطاء',
            'Welcome to Aqarkom - Real Estate & Broker Management Platform'
          )}
        </p>
      </header>

      {/* KPI Cards - SCR-010 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.labelEn}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t(kpi.labelAr, kpi.labelEn)}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {kpi.value}
                </p>
              </div>
              <span className="text-3xl">{kpi.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          {t('بدء سريع', 'Quick Start')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/properties"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <span className="text-2xl">➕</span>
            <span>{t('إضافة إعلان عقاري', 'Add Property Listing')}</span>
          </a>
          <a
            href="/requests"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <span className="text-2xl">📋</span>
            <span>{t('عرض الطلبات', 'View Requests')}</span>
          </a>
          <a
            href="/contacts"
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <span className="text-2xl">👤</span>
            <span>{t('إضافة عميل', 'Add Contact')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
