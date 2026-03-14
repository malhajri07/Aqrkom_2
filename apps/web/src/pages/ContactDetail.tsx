import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { contacts, activities } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { CONTACT_TYPES } from '@aqarkom/shared';

export function ContactDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [contact, setContact] = useState<Record<string, unknown> | null>(null);
  const [activityList, setActivityList] = useState<unknown[]>([]);

  useEffect(() => {
    if (id) {
      contacts.get(id).then((r) => setContact(r as Record<string, unknown>)).catch(() => setContact(null));
      activities.listByContact(id).then((r) => setActivityList(r as unknown[])).catch(() => setActivityList([]));
    }
  }, [id]);

  if (!contact) return <div className="p-8">{t('جاري التحميل...', 'Loading...')}</div>;

  const typeLabel = CONTACT_TYPES[contact.contact_type as keyof typeof CONTACT_TYPES] as { ar: string; en: string } | undefined;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">
          {contact.first_name_ar} {contact.last_name_ar}
        </h1>
        <Link to="/contacts" className="text-primary-600">{t('← العودة', '← Back')}</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow">
          <h3 className="font-semibold mb-4">{t('المعلومات', 'Info')}</h3>
          <div className="space-y-2">
            <p><span className="text-slate-500">{t('النوع', 'Type')}:</span> {typeLabel ? t(typeLabel.ar, typeLabel.en) : String(contact.contact_type)}</p>
            <p><span className="text-slate-500">{t('الهاتف', 'Phone')}:</span> <a href={`tel:${String(contact.phone)}`} className="text-primary-600">{String(contact.phone)}</a></p>
            {contact.email != null && <p><span className="text-slate-500">{t('البريد', 'Email')}:</span> {String(contact.email)}</p>}
            {contact.lead_status != null && <p><span className="text-slate-500">{t('حالة العميل', 'Lead Status')}:</span> {String(contact.lead_status)}</p>}
          </div>
          <a href={`https://wa.me/${String(contact.phone).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg">
            WhatsApp
          </a>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow">
          <h3 className="font-semibold mb-4">{t('سجل النشاط', 'Activity Timeline')}</h3>
            {Array.isArray(activityList) && activityList.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {(activityList as Record<string, unknown>[]).map((a) => (
                <div key={String(a.id)} className="p-2 border-r-2 border-primary-200">
                  <p className="text-sm font-medium">{String(a.activity_type)}</p>
                  {a.subject != null && <p className="text-sm">{String(a.subject)}</p>}
                  <p className="text-xs text-slate-500">{new Date(String(a.created_at)).toLocaleString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">{t('لا يوجد نشاط', 'No activity yet')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
