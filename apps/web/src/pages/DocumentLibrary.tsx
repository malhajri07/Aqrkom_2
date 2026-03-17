import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { API_BASE, unwrapEnvelope } from '../lib/api';
import { HiOutlineDocumentText, HiOutlineFolder } from 'react-icons/hi2';

export function DocumentLibrary() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const entityType = searchParams.get('entity') || 'transaction';
  const entityId = searchParams.get('id') || '';
  const [docs, setDocs] = useState<Record<string, unknown>[]>([]);
  const [templates, setTemplates] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (entityId) {
      fetch(`${API_BASE}/documents?entity_type=${entityType}&entity_id=${entityId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('aqarkom_token')}` },
      })
        .then((r) => (r.ok ? r.json() : []))
        .then((b) => {
          const d = unwrapEnvelope<unknown[]>(b);
          setDocs(Array.isArray(d) ? (d as Record<string, unknown>[]) : []);
        })
        .catch(() => setDocs([]));
    }
    fetch(`${API_BASE}/documents/templates`, { headers: { Authorization: `Bearer ${localStorage.getItem('aqarkom_token')}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((b) => {
        const t = unwrapEnvelope<unknown[]>(b);
        setTemplates(Array.isArray(t) ? (t as Record<string, unknown>[]) : []);
      })
      .catch(() => setTemplates([]));
  }, [entityType, entityId]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">{t('مكتبة المستندات', 'Document Library')}</h1>
        <p className="text-slate-600 mt-1">{t('المستندات والقوالب', 'Documents & templates')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <HiOutlineFolder className="w-5 h-5" />
            {t('قوالب عربية', 'Arabic Templates')}
          </h3>
          <ul className="space-y-2">
            {templates.map((tmpl) => (
              <li key={String(tmpl.id)} className="flex items-center gap-2 p-2 rounded hover:bg-slate-50">
                <HiOutlineDocumentText className="w-4 h-4 text-slate-400" />
                <span>{t(String(tmpl.name_ar), String(tmpl.name_en))}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow">
          <h3 className="font-semibold mb-4">{t('المستندات المرفقة', 'Attached Documents')}</h3>
          {docs.length === 0 ? (
            <p className="text-slate-500">{t('لا توجد مستندات', 'No documents')}</p>
          ) : (
            <ul className="space-y-2">
              {docs.map((d) => (
                <li key={String(d.id)} className="flex items-center gap-2 p-2 rounded hover:bg-slate-50">
                  <HiOutlineDocumentText className="w-4 h-4 text-slate-400" />
                  <span>{String(d.name)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
