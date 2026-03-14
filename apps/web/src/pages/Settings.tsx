import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineGlobeAlt,
  HiOutlineUserCircle,
  HiOutlineBellAlert,
  HiOutlineCog6Tooth,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';

export function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{t('الإعدادات', 'Settings')}</h1>
        <p className="text-slate-500 mt-1">{t('تخصيص حسابك وتفضيلاتك', 'Customize your account and preferences')}</p>
      </header>

      {/* Profile */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-holly-50 text-holly-600 flex items-center justify-center">
            <HiOutlineUserCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">{t('الملف الشخصي', 'Profile')}</h2>
            <p className="text-xs text-slate-500">{t('معلومات حسابك', 'Your account information')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t('البريد الإلكتروني', 'Email')}</label>
            <p className="px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-800">{user?.email || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t('الدور', 'Role')}</label>
            <p className="px-3 py-2 bg-slate-50 rounded-lg text-sm text-slate-800">{user?.role || '-'}</p>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <HiOutlineGlobeAlt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">{t('اللغة', 'Language')}</h2>
            <p className="text-xs text-slate-500">{t('اختر لغة الواجهة', 'Choose interface language')}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setLanguage('ar')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${language === 'ar' ? 'bg-holly-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            العربية
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all text-sm ${language === 'en' ? 'bg-holly-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            English
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <HiOutlineBellAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">{t('الإشعارات', 'Notifications')}</h2>
            <p className="text-xs text-slate-500">{t('تخصيص إشعاراتك', 'Customize notifications')}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: t('إشعارات الطلبات الجديدة', 'New request notifications'), defaultOn: true },
            { label: t('إشعارات العروض', 'Offer notifications'), defaultOn: true },
            { label: t('تذكيرات المهام', 'Task reminders'), defaultOn: true },
            { label: t('إشعارات SMS', 'SMS notifications'), defaultOn: false },
          ].map((item) => (
            <label key={item.label} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
              <span className="text-sm text-slate-700">{item.label}</span>
              <div className={`w-10 h-6 rounded-full transition-colors relative ${item.defaultOn ? 'bg-holly-500' : 'bg-slate-300'}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${item.defaultOn ? 'start-5' : 'start-1'}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Commission Config */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <HiOutlineCog6Tooth className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">{t('إعدادات العمولة', 'Commission Settings')}</h2>
            <p className="text-xs text-slate-500">{t('تخصيص حاسبة العمولة', 'Configure commission calculator')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t('نسبة العمولة الافتراضية', 'Default Commission Rate')}</label>
            <div className="flex items-center gap-2">
              <input type="number" defaultValue="2.5" step="0.1" min="0" max="100" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              <span className="text-sm text-slate-500">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">{t('نسبة الضريبة (VAT)', 'VAT Rate')}</label>
            <div className="flex items-center gap-2">
              <input type="number" defaultValue="15" step="1" min="0" max="100" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm" />
              <span className="text-sm text-slate-500">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <HiOutlineShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">{t('الأمان', 'Security')}</h2>
            <p className="text-xs text-slate-500">{t('كلمة المرور والمصادقة', 'Password & authentication')}</p>
          </div>
        </div>
        <button className="px-4 py-2 text-sm font-medium text-holly-600 bg-holly-50 rounded-lg hover:bg-holly-100 transition-colors">
          {t('تغيير كلمة المرور', 'Change Password')}
        </button>
      </div>
    </div>
  );
}
