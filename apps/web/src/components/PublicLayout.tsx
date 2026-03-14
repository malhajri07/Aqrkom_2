import { Link, Outlet } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  HiOutlineBuildingOffice2,
  HiOutlineGlobeAlt,
  HiOutlineMagnifyingGlass,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2';

export function PublicLayout({ children }: { children?: React.ReactNode }) {
  const { t, toggleLanguage, isRtl } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white border-b border-holly-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HiOutlineBuildingOffice2 className="w-7 h-7 text-holly-600" />
            <Link to="/" className="text-xl font-bold text-holly-800">عقاركم</Link>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-sm">
            <Link to="/" className="text-slate-600 hover:text-holly-600 transition-colors">
              {t('الرئيسية', 'Home')}
            </Link>
            <Link to="/search" className="flex items-center gap-1 text-slate-600 hover:text-holly-600 transition-colors">
              <HiOutlineMagnifyingGlass className="w-4 h-4" />
              {t('استعراض العقارات', 'Browse Properties')}
            </Link>
            <Link to="/submit-request" className="flex items-center gap-1 text-slate-600 hover:text-holly-600 transition-colors">
              <HiOutlineClipboardDocumentList className="w-4 h-4" />
              {t('طلب عقاري', 'Property Request')}
            </Link>
            <Link to="/submit-listing" className="flex items-center gap-1 text-slate-600 hover:text-holly-600 transition-colors">
              <HiOutlineDocumentText className="w-4 h-4" />
              {t('أضف عقارك', 'Submit Listing')}
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <HiOutlineGlobeAlt className="w-4 h-4 inline me-1" />
              {isRtl ? 'EN' : 'عربي'}
            </button>
            <Link
              to="/login"
              className="text-sm font-medium text-holly-600 hover:text-holly-700 transition-colors"
            >
              {t('تسجيل الدخول', 'Login')}
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-holly-600 text-white text-sm font-medium rounded-lg hover:bg-holly-700 transition-colors"
            >
              {t('سجل كوسيط', 'Register')}
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-holly-50">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-holly-950 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <HiOutlineBuildingOffice2 className="w-5 h-5 text-holly-400" />
              <span className="text-sm font-bold text-white">عقاركم</span>
              <span className="text-xs text-holly-500">Aqarkom</span>
            </div>
            <p className="text-xs text-holly-500">
              © 2026 عقاركم Aqarkom. {t('جميع الحقوق محفوظة', 'All rights reserved')}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
