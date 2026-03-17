import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { unwrapEnvelope } from '../lib/api';
import {
  HiOutlineUsers,
  HiOutlineBuildingOffice2,
  HiOutlineCurrencyDollar,
  HiOutlineInboxArrowDown,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
} from 'react-icons/hi2';

interface Stats {
  total_users: number;
  total_properties: number;
  total_transactions: number;
  total_requests: number;
  pending_broker_requests: number;
  unverified_listings: number;
}

interface UserRow {
  id: string;
  email: string;
  role: string;
  first_name_ar?: string;
  last_name_ar?: string;
  created_at: string;
}

interface UnverifiedListing {
  id: string;
  owner_name: string;
  owner_phone: string;
  property_type: string;
  city: string;
  created_at: string;
}

const STAT_CARDS = [
  { key: 'total_users' as const, icon: HiOutlineUsers, ar: 'إجمالي المستخدمين', en: 'Total Users', color: 'bg-blue-50 text-blue-600' },
  { key: 'total_properties' as const, icon: HiOutlineBuildingOffice2, ar: 'إجمالي العقارات', en: 'Total Properties', color: 'bg-holly-50 text-holly-600' },
  { key: 'total_transactions' as const, icon: HiOutlineCurrencyDollar, ar: 'إجمالي الصفقات', en: 'Total Transactions', color: 'bg-amber-50 text-amber-600' },
  { key: 'total_requests' as const, icon: HiOutlineInboxArrowDown, ar: 'إجمالي الطلبات', en: 'Total Requests', color: 'bg-purple-50 text-purple-600' },
  { key: 'pending_broker_requests' as const, icon: HiOutlineShieldCheck, ar: 'طلبات وسطاء معلقة', en: 'Pending Broker Requests', color: 'bg-orange-50 text-orange-600' },
  { key: 'unverified_listings' as const, icon: HiOutlineDocumentText, ar: 'قوائم غير موثقة', en: 'Unverified Listings', color: 'bg-red-50 text-red-600' },
];

export function AdminDashboard() {
  const { t, isRtl } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    total_users: 0,
    total_properties: 0,
    total_transactions: 0,
    total_requests: 0,
    pending_broker_requests: 0,
    unverified_listings: 0,
  });
  const [users, setUsers] = useState<UserRow[]>([]);
  const [listings, setListings] = useState<UnverifiedListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('aqarkom_token');
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    Promise.all([
      fetch('/api/v1/admin/stats', { headers }).then((r) => (r.ok ? r.json() : null)),
      fetch('/api/v1/admin/users', { headers }).then((r) => (r.ok ? r.json() : [])),
      fetch('/api/v1/admin/unverified-listings', { headers }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([statsRaw, usersRaw, listingsRaw]) => {
        const statsData = statsRaw ? unwrapEnvelope<Record<string, unknown>>(statsRaw) : null;
        const usersData = unwrapEnvelope<unknown[]>(usersRaw || []);
        const listingsData = unwrapEnvelope<unknown[]>(listingsRaw || []);
        if (statsData) setStats(statsData);
        if (Array.isArray(usersData)) setUsers(usersData.slice(0, 10));
        if (Array.isArray(listingsData)) setListings(listingsData.slice(0, 10));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-holly-200 border-t-holly-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {t('لوحة التحكم الإدارية', 'Admin Dashboard')}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t('نظرة عامة على النظام', 'System overview')}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">{t(card.ar, card.en)}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats[card.key]}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              {t('المستخدمون الأخيرون', 'Recent Users')}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-holly-50 text-holly-800">
                <tr>
                  <th className="px-4 py-2 text-start font-medium">{t('البريد', 'Email')}</th>
                  <th className="px-4 py-2 text-start font-medium">{t('الدور', 'Role')}</th>
                  <th className="px-4 py-2 text-start font-medium">{t('التاريخ', 'Date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-700">{user.email}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-holly-50 text-holly-700">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                      {t('لا يوجد مستخدمون', 'No users')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unverified Listings */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              {t('القوائم غير الموثقة', 'Unverified Listings')}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-holly-50 text-holly-800">
                <tr>
                  <th className="px-4 py-2 text-start font-medium">{t('المالك', 'Owner')}</th>
                  <th className="px-4 py-2 text-start font-medium">{t('النوع', 'Type')}</th>
                  <th className="px-4 py-2 text-start font-medium">{t('المدينة', 'City')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 text-slate-700">{listing.owner_name}</td>
                    <td className="px-4 py-2.5 text-slate-600">{listing.property_type}</td>
                    <td className="px-4 py-2.5 text-slate-500">{listing.city}</td>
                  </tr>
                ))}
                {listings.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                      {t('لا توجد قوائم', 'No listings')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
