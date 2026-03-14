import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contacts, dashboard } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';

export function Pipeline() {
  const { t } = useLanguage();
  const [stages, setStages] = useState<{ id: string; name_ar: string; name_en: string; stage_order: number }[]>([]);
  const [contactsList, setContactsList] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    dashboard.pipelineStages().then((r) => setStages(r as { id: string; name_ar: string; name_en: string; stage_order: number }[]));
    contacts.list().then((r) => setContactsList(r as Record<string, unknown>[]));
  }, []);

  const contactsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = contactsList.filter((c) => c.pipeline_stage_id === stage.id);
    return acc;
  }, {} as Record<string, Record<string, unknown>[]>);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('خط أنابيب العملاء', 'Lead Pipeline')}</h1>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="flex-shrink-0 w-72 bg-slate-100 dark:bg-slate-800 rounded-xl p-4"
          >
            <h3 className="font-semibold mb-4">{t(stage.name_ar, stage.name_en)}</h3>
            <div className="space-y-2 min-h-[100px]">
              {(contactsByStage[stage.id] || []).map((c) => (
                <Link
                  key={String(c.id)}
                  to={`/contacts/${c.id}`}
                  className="block p-3 bg-white dark:bg-slate-700 rounded-lg shadow-sm hover:shadow"
                >
                  <p className="font-medium">{String(c.first_name_ar)} {String(c.last_name_ar)}</p>
                  <p className="text-sm text-slate-500">{String(c.phone)}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
