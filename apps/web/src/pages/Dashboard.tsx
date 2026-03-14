import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboard } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import {
  HiOutlineBuildingOffice2,
  HiOutlineInboxArrowDown,
  HiOutlineBanknotes,
  HiOutlineChartBarSquare,
  HiOutlinePlusCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineUserGroup,
} from 'react-icons/hi2';

export function Dashboard() {
  const { t } = useLanguage();
  const [kpis, setKpis] = useState({ activeListings: 0, openRequests: 0, pipelineValue: 0, commissionEarned: 0 });

  useEffect(() => {
    dashboard.kpis().then(setKpis).catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">{t('لوحة التحكم', 'Dashboard')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {t('مرحباً بك في عقاركم', 'Welcome to Aqarkom')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-slate-500">{t('إعلانات نشطة', 'Active Listings')}</p>
          <p className="text-2xl font-bold mt-1">{kpis.activeListings}</p>
          <HiOutlineBuildingOffice2 className="w-8 h-8 text-primary-500 mt-1" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-slate-500">{t('طلبات مفتوحة', 'Open Requests')}</p>
          <p className="text-2xl font-bold mt-1">{kpis.openRequests}</p>
          <HiOutlineInboxArrowDown className="w-8 h-8 text-amber-500 mt-1" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-slate-500">{t('قيمة الصفقات', 'Pipeline Value')}</p>
          <p className="text-2xl font-bold mt-1">{kpis.pipelineValue.toLocaleString('ar-SA')} ر.س</p>
          <HiOutlineBanknotes className="w-8 h-8 text-green-500 mt-1" />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-slate-500">{t('عمولة محققة', 'Commission Earned')}</p>
          <p className="text-2xl font-bold mt-1">{kpis.commissionEarned.toLocaleString('ar-SA')} ر.س</p>
          <HiOutlineChartBarSquare className="w-8 h-8 text-indigo-500 mt-1" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">{t('بدء سريع', 'Quick Start')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/properties/new" className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
            <HiOutlinePlusCircle className="w-6 h-6 text-primary-600 flex-shrink-0" />
            <span>{t('إضافة إعلان عقاري', 'Add Property Listing')}</span>
          </Link>
          <Link to="/requests/new" className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
            <HiOutlineClipboardDocumentList className="w-6 h-6 text-primary-600 flex-shrink-0" />
            <span>{t('طلب عقاري جديد', 'New Property Request')}</span>
          </Link>
          <Link to="/contacts" className="flex items-center gap-3 p-4 rounded-lg border hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
            <HiOutlineUserGroup className="w-6 h-6 text-primary-600 flex-shrink-0" />
            <span>{t('إدارة العملاء', 'Manage Contacts')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
