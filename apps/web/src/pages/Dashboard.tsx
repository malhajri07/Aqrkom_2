import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboard, tasks as tasksApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import {
  HiOutlineBuildingOffice2,
  HiOutlineInboxArrowDown,
  HiOutlineBanknotes,
  HiOutlineChartBarSquare,
  HiOutlinePlusCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlinePhone,
  HiOutlineChatBubbleLeftRight,
  HiOutlineEye,
  HiOutlineCalendarDays,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';
import type { IconType } from 'react-icons';

interface KPIs {
  activeListings: number;
  openRequests: number;
  pipelineValue: number;
  commissionEarned: number;
  totalContacts: number;
  pendingTasks: number;
}

interface PipelineStage {
  id: string;
  name_ar: string;
  name_en: string;
  stage_order: number;
  color: string;
  contact_count: number;
}

interface Activity {
  id: string;
  activity_type: string;
  subject: string;
  created_at: string;
  first_name_ar: string;
  last_name_ar: string;
  phone: string;
}

interface RecentProperty {
  id: string;
  title_ar: string;
  city: string;
  district: string;
  price: number;
  status: string;
  property_type: string;
  bedrooms: number;
  area_sqm: number;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
}

const ACTIVITY_ICONS: Record<string, IconType> = {
  call: HiOutlinePhone,
  whatsapp: HiOutlineChatBubbleLeftRight,
  showing: HiOutlineEye,
  meeting: HiOutlineCalendarDays,
  note: HiOutlineClipboardDocumentList,
  email: HiOutlineInboxArrowDown,
};

const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-slate-100 text-slate-600',
};

const STATUS_LABELS: Record<string, { ar: string; en: string }> = {
  active: { ar: 'نشط', en: 'Active' },
  pending: { ar: 'معلق', en: 'Pending' },
  sold: { ar: 'تم البيع', en: 'Sold' },
  leased: { ar: 'تم التأجير', en: 'Leased' },
};

export function Dashboard() {
  const { t } = useLanguage();
  const [kpis, setKpis] = useState<KPIs>({ activeListings: 0, openRequests: 0, pipelineValue: 0, commissionEarned: 0, totalContacts: 0, pendingTasks: 0 });
  const [pipeline, setPipeline] = useState<PipelineStage[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [recentProperties, setRecentProperties] = useState<RecentProperty[]>([]);
  const [taskList, setTaskList] = useState<Task[]>([]);

  useEffect(() => {
    dashboard.kpis().then((d) => setKpis(d as KPIs)).catch(() => {});
    dashboard.pipelineSummary().then((d) => setPipeline(d as PipelineStage[])).catch(() => {});
    dashboard.recentActivities().then((d) => setRecentActivities(d as Activity[])).catch(() => {});
    dashboard.recentProperties().then((d) => setRecentProperties(d as RecentProperty[])).catch(() => {});
    tasksApi.list().then((d) => setTaskList((d as Task[]).slice(0, 5))).catch(() => {});
  }, []);

  const pipelineTotal = pipeline.reduce((s, p) => s + p.contact_count, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('لوحة التحكم', 'Dashboard')}</h1>
          <p className="text-slate-500 mt-1">{t('مرحباً بك في عقاركم', 'Welcome to Aqarkom')}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/properties/new" className="flex items-center gap-2 px-4 py-2 bg-holly-600 text-white rounded-lg hover:bg-holly-700 transition-colors text-sm font-medium">
            <HiOutlinePlusCircle className="w-4 h-4" />
            {t('إضافة إعلان', 'Add Listing')}
          </Link>
        </div>
      </header>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: t('إعلانات نشطة', 'Active Listings'), value: kpis.activeListings, icon: HiOutlineBuildingOffice2, color: 'text-holly-600 bg-holly-50' },
          { label: t('طلبات مفتوحة', 'Open Requests'), value: kpis.openRequests, icon: HiOutlineInboxArrowDown, color: 'text-amber-600 bg-amber-50' },
          { label: t('العملاء', 'Contacts'), value: kpis.totalContacts, icon: HiOutlineUsers, color: 'text-blue-600 bg-blue-50' },
          { label: t('مهام معلقة', 'Pending Tasks'), value: kpis.pendingTasks, icon: HiOutlineClipboardDocumentCheck, color: 'text-purple-600 bg-purple-50' },
          { label: t('قيمة الصفقات', 'Pipeline Value'), value: `${kpis.pipelineValue.toLocaleString()} ر.س`, icon: HiOutlineBanknotes, color: 'text-emerald-600 bg-emerald-50' },
          { label: t('العمولة', 'Commission'), value: `${kpis.commissionEarned.toLocaleString()} ر.س`, icon: HiOutlineChartBarSquare, color: 'text-indigo-600 bg-indigo-50' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium uppercase tracking-wide">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Pipeline Flow + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Stages */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-holly-50 text-holly-600 flex items-center justify-center">
              <HiOutlineArrowTrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{t('خط أنابيب العملاء', 'Lead Pipeline')}</h2>
              <p className="text-sm text-slate-500">{t('توزيع العملاء حسب المرحلة', 'Leads by stage')}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {pipeline.map((stage) => {
              const pct = pipelineTotal > 0 ? ((stage.contact_count / pipelineTotal) * 100).toFixed(0) : '0';
              return (
                <Link to="/pipeline" key={stage.id} className="group rounded-xl p-4 border border-slate-100 hover:shadow-md hover:border-holly-200 transition-all text-center">
                  <p className="text-2xl font-bold text-slate-900">{stage.contact_count}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">{t(stage.name_ar, stage.name_en)}</p>
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 font-medium">{pct}%</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">{t('إجراءات سريعة', 'Quick Actions')}</h2>
          <div className="space-y-2">
            {[
              { to: '/properties/new', icon: HiOutlinePlusCircle, label: t('إضافة إعلان عقاري', 'Add Property'), color: 'text-holly-600' },
              { to: '/requests/new', icon: HiOutlineClipboardDocumentList, label: t('طلب عقاري جديد', 'New Request'), color: 'text-amber-600' },
              { to: '/contacts', icon: HiOutlineUserGroup, label: t('إدارة العملاء', 'Manage Contacts'), color: 'text-blue-600' },
              { to: '/transactions', icon: HiOutlineBanknotes, label: t('صفقة جديدة', 'New Deal'), color: 'text-emerald-600' },
              { to: '/pipeline', icon: HiOutlineArrowTrendingUp, label: t('خط الأنابيب', 'Pipeline'), color: 'text-purple-600' },
              { to: '/reports', icon: HiOutlineChartBarSquare, label: t('التقارير', 'Reports'), color: 'text-indigo-600' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.to} to={action.to} className="flex items-center gap-3 p-3 rounded-lg hover:bg-holly-50 transition-colors group">
                  <Icon className={`w-5 h-5 ${action.color} flex-shrink-0`} />
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tasks + Recent Activities + Recent Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">{t('المهام', 'Tasks')}</h2>
            <span className="text-xs text-holly-600 bg-holly-50 px-2 py-1 rounded-full font-medium">{kpis.pendingTasks} {t('معلقة', 'pending')}</span>
          </div>
          {taskList.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">{t('لا توجد مهام', 'No tasks')}</p>
          ) : (
            <div className="space-y-2">
              {taskList.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
                  <HiOutlineCheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${task.status === 'completed' ? 'text-holly-500' : 'text-slate-300'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium}`}>
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <HiOutlineClock className="w-3 h-3" />
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-900 mb-4">{t('النشاط الأخير', 'Recent Activity')}</h2>
          {recentActivities.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">{t('لا يوجد نشاط', 'No activity')}</p>
          ) : (
            <div className="space-y-3">
              {recentActivities.slice(0, 6).map((act) => {
                const Icon = ACTIVITY_ICONS[act.activity_type] || HiOutlineClipboardDocumentList;
                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-holly-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-holly-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{act.subject || act.activity_type}</p>
                      <p className="text-xs text-slate-400">{act.first_name_ar} {act.last_name_ar}</p>
                      <p className="text-xs text-slate-400">{new Date(act.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Properties */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">{t('آخر العقارات', 'Recent Properties')}</h2>
            <Link to="/properties" className="text-xs text-holly-600 hover:text-holly-700 font-medium">{t('عرض الكل', 'View all')}</Link>
          </div>
          {recentProperties.length === 0 ? (
            <p className="text-sm text-slate-400 py-6 text-center">{t('لا توجد عقارات', 'No properties')}</p>
          ) : (
            <div className="space-y-3">
              {recentProperties.map((prop) => {
                const sl = STATUS_LABELS[prop.status];
                return (
                  <Link key={prop.id} to={`/properties/${prop.id}`} className="flex items-center gap-3 p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <HiOutlineBuildingOffice2 className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{prop.title_ar}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-holly-600 font-bold">{Number(prop.price).toLocaleString()} ر.س</span>
                        {sl && <span className="text-xs px-1.5 py-0.5 rounded bg-holly-50 text-holly-700">{t(sl.ar, sl.en)}</span>}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
