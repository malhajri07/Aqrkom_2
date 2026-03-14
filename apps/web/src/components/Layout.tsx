import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { NAV_ITEMS } from '@aqarkom/shared';
import {
  HiOutlineSquares2X2,
  HiOutlineBuildingOffice2,
  HiOutlineInboxArrowDown,
  HiOutlineUsers,
  HiOutlineViewColumns,
  HiOutlineCurrencyDollar,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineGlobeAlt,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import type { IconType } from 'react-icons';

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_ICON_MAP: Record<string, IconType> = {
  'layout-dashboard': HiOutlineSquares2X2,
  building: HiOutlineBuildingOffice2,
  inbox: HiOutlineInboxArrowDown,
  users: HiOutlineUsers,
  kanban: HiOutlineViewColumns,
  handshake: HiOutlineCurrencyDollar,
  'bar-chart': HiOutlineChartBar,
  settings: HiOutlineCog6Tooth,
};

export function Layout({ children }: LayoutProps) {
  const { t, toggleLanguage, isRtl } = useLanguage();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Sidebar - SCR-011 */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            عقاركم
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Aqarkom CRM
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = NAV_ICON_MAP[item.icon] || HiOutlineSquares2X2;
            return (
              <Link
                key={item.id}
                to={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{t(item.ar, item.en)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Language toggle & logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <button
            onClick={toggleLanguage}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm"
          >
            <HiOutlineGlobeAlt className="w-4 h-4" />
            <span>{isRtl ? 'EN' : 'عربي'}</span>
          </button>
          <button
            onClick={() => { logout(); window.location.href = '/login'; }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm"
          >
            <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
            {t('تسجيل الخروج', 'Logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
