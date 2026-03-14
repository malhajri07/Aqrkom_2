import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineBuildingOffice2,
  HiOutlineCurrencyDollar,
  HiOutlineInboxArrowDown,
  HiOutlineDocumentText,
  HiOutlineCog6Tooth,
  HiOutlineGlobeAlt,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';

const ADMIN_NAV = [
  { path: '/admin', icon: HiOutlineSquares2X2, ar: 'لوحة التحكم', en: 'Dashboard' },
  { path: '/admin/users', icon: HiOutlineUsers, ar: 'المستخدمون', en: 'Users' },
  { path: '/admin/properties', icon: HiOutlineBuildingOffice2, ar: 'العقارات', en: 'Properties' },
  { path: '/admin/transactions', icon: HiOutlineCurrencyDollar, ar: 'الصفقات', en: 'Transactions' },
  { path: '/admin/requests', icon: HiOutlineInboxArrowDown, ar: 'الطلبات', en: 'Requests' },
  { path: '/admin/unverified', icon: HiOutlineDocumentText, ar: 'قوائم غير موثقة', en: 'Unverified Listings' },
  { path: '/admin/settings', icon: HiOutlineCog6Tooth, ar: 'الإعدادات', en: 'Settings' },
];

export function AdminLayout({ children }: { children?: React.ReactNode }) {
  const { t, toggleLanguage, isRtl } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <aside className="w-64 bg-holly-900 flex flex-col">
        {/* Top bar */}
        <div className="p-6 bg-holly-950 border-b border-holly-700/40">
          <h1 className="text-lg font-bold text-white">
            {t('عقاركم - إدارة', 'Aqarkom Admin')}
          </h1>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-holly-200 hover:bg-holly-700/50 hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{t(item.ar, item.en)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-holly-700/40 space-y-2">
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-holly-800 text-holly-200 hover:bg-holly-700 hover:text-white transition-colors text-sm"
          >
            <HiOutlineGlobeAlt className="w-4 h-4" />
            <span>{isRtl ? 'EN' : 'عربي'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-900/30 text-red-300 hover:bg-red-900/50 hover:text-red-200 transition-colors text-sm"
          >
            <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
            {t('تسجيل الخروج', 'Logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-holly-50">
        <div className="p-6 md:p-8">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}
