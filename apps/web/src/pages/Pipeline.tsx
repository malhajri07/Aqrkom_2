import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contacts, dashboard } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { CONTACT_TYPES } from '@aqarkom/shared';
import {
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineArrowTrendingUp,
  HiOutlineUserGroup,
} from 'react-icons/hi2';

interface Stage {
  id: string;
  name_ar: string;
  name_en: string;
  stage_order: number;
  color: string;
}

export function Pipeline() {
  const { t } = useLanguage();
  const [stages, setStages] = useState<Stage[]>([]);
  const [contactsList, setContactsList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboard.pipelineStages().then((r) => setStages(r as Stage[])),
      contacts.list().then((r) => setContactsList(r as Record<string, unknown>[])),
    ]).finally(() => setLoading(false));
  }, []);

  const contactsByStage = stages.reduce((acc, stage) => {
    acc[stage.id] = contactsList.filter((c) => c.pipeline_stage_id === stage.id);
    return acc;
  }, {} as Record<string, Record<string, unknown>[]>);

  const unassigned = contactsList.filter((c) => !c.pipeline_stage_id);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('خط أنابيب العملاء', 'Lead Pipeline')}</h1>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5].map((i) => (<div key={i} className="flex-shrink-0 w-72 h-64 bg-white rounded-xl animate-pulse border border-slate-100" />))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('خط أنابيب العملاء', 'Lead Pipeline')}</h1>
          <p className="text-slate-500 mt-1">{t('إدارة مراحل العملاء', 'Manage lead stages')} - {contactsList.length} {t('عميل', 'leads')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <HiOutlineUserGroup className="w-4 h-4" />
            <span>{unassigned.length} {t('غير مصنف', 'unassigned')}</span>
          </div>
        </div>
      </header>

      {/* Pipeline Summary */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {stages.map((stage) => {
          const count = (contactsByStage[stage.id] || []).length;
          return (
            <div key={stage.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-100 text-sm whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
              <span className="text-slate-600">{t(stage.name_ar, stage.name_en)}</span>
              <span className="font-bold text-slate-800">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
        {stages.map((stage) => {
          const stageContacts = contactsByStage[stage.id] || [];
          return (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <div className="rounded-xl overflow-hidden">
                {/* Stage Header */}
                <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: `${stage.color}15` }}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                    <h3 className="font-semibold text-sm text-slate-800">{t(stage.name_ar, stage.name_en)}</h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-sm">{stageContacts.length}</span>
                </div>

                {/* Cards */}
                <div className="space-y-2 p-2 bg-slate-50/50 min-h-[200px] rounded-b-xl">
                  {stageContacts.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-8">{t('لا يوجد عملاء', 'No leads')}</p>
                  )}
                  {stageContacts.map((c) => {
                    const typeLabel = CONTACT_TYPES[c.contact_type as keyof typeof CONTACT_TYPES] as { ar: string; en: string } | undefined;
                    return (
                      <Link key={String(c.id)} to={`/contacts/${c.id}`} className="block p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md hover:border-holly-200 transition-all">
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium text-sm text-slate-800">{String(c.first_name_ar)} {String(c.last_name_ar)}</p>
                          {c.lead_score != null && Number(c.lead_score) > 0 && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">{String(c.lead_score)}</span>
                          )}
                        </div>
                        {typeLabel && <p className="text-xs text-slate-500 mb-2">{t(typeLabel.ar, typeLabel.en)}</p>}
                        <div className="flex items-center gap-2">
                          <a href={`tel:${String(c.phone)}`} className="text-holly-600 hover:text-holly-700" onClick={(e) => e.stopPropagation()}>
                            <HiOutlinePhone className="w-3.5 h-3.5" />
                          </a>
                          {c.email && (
                            <a href={`mailto:${String(c.email)}`} className="text-blue-600 hover:text-blue-700" onClick={(e) => e.stopPropagation()}>
                              <HiOutlineEnvelope className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <span className="text-xs text-slate-400 ms-auto">{String(c.phone)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
