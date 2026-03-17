import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import { contacts, dashboard } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { CONTACT_TYPES } from '@aqarkom/shared';
import {
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineUserGroup,
} from 'react-icons/hi2';

interface Stage {
  id: string;
  name_ar: string;
  name_en: string;
  stage_order: number;
  color: string;
}

interface Contact {
  id: string;
  first_name_ar?: string;
  last_name_ar?: string;
  contact_type?: string;
  phone?: string;
  email?: string;
  lead_score?: number;
  pipeline_stage_id?: string;
}

function ContactCard({
  c,
  typeLabel,
  t,
  isDragging,
}: {
  c: Contact;
  typeLabel: { ar: string; en: string } | undefined;
  t: (ar: string, en: string) => string;
  isDragging?: boolean;
}) {
  return (
    <div
      className={`p-3 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md hover:border-holly-200 transition-all ${isDragging ? 'opacity-90 shadow-lg' : ''}`}
    >
      <div className="flex items-start justify-between mb-1">
        <p className="font-medium text-sm text-slate-800">
          {String(c.first_name_ar)} {String(c.last_name_ar)}
        </p>
        {c.lead_score != null && Number(c.lead_score) > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold">
            {String(c.lead_score)}
          </span>
        )}
      </div>
      {typeLabel && (
        <p className="text-xs text-slate-500 mb-2">{tLang(typeLabel.ar, typeLabel.en)}</p>
      )}
      <div className="flex items-center gap-2">
        <a
          href={`tel:${String(c.phone)}`}
          className="text-holly-600 hover:text-holly-700"
          onClick={(e) => e.stopPropagation()}
        >
          <HiOutlinePhone className="w-3.5 h-3.5" />
        </a>
        {c.email && (
          <a
            href={`mailto:${String(c.email)}`}
            className="text-blue-600 hover:text-blue-700"
            onClick={(e) => e.stopPropagation()}
          >
            <HiOutlineEnvelope className="w-3.5 h-3.5" />
          </a>
        )}
        <span className="text-xs text-slate-400 ms-auto">{String(c.phone)}</span>
      </div>
    </div>
  );
}

function DroppableStage({
  stage,
  stageContacts,
  tCrm,
  tLang,
}: {
  stage: Stage;
  stageContacts: Contact[];
  tCrm: (key: string) => string;
  tLang: (ar: string, en: string) => string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-72 transition-colors rounded-xl ${isOver ? 'ring-2 ring-holly-400 ring-offset-2' : ''}`}
    >
      <div className="rounded-xl overflow-hidden">
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ backgroundColor: `${stage.color}15` }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            <h3 className="font-semibold text-sm text-slate-800">
              {tLang(stage.name_ar, stage.name_en)}
            </h3>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-sm">
            {stageContacts.length}
          </span>
        </div>
        <div className="space-y-2 p-2 bg-slate-50/50 min-h-[200px] rounded-b-xl">
          {stageContacts.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-8">
              {tCrm('noLeads')}
            </p>
          )}
          {stageContacts.map((c) => (
            <DraggableContactCard
              key={c.id}
              c={c}
              typeLabel={CONTACT_TYPES[c.contact_type as keyof typeof CONTACT_TYPES] as { ar: string; en: string } | undefined}
              t={t}
              stageId={stage.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DraggableContactCard({
  c,
  typeLabel,
  t,
  stageId,
}: {
  c: Contact;
  typeLabel: { ar: string; en: string } | undefined;
  t: (ar: string, en: string) => string;
  stageId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: c.id,
    data: { contact: c, fromStageId: stageId },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Link to={`/contacts/${c.id}`} onClick={(e) => isDragging && e.preventDefault()}>
        <ContactCard c={c} typeLabel={typeLabel} t={t} isDragging={isDragging} />
      </Link>
    </div>
  );
}

export function Pipeline() {
  const { t } = useTranslation('crm');
  const { t: tLang } = useLanguage();
  const [stages, setStages] = useState<Stage[]>([]);
  const [contactsList, setContactsList] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  const fetchData = useCallback(() => {
    Promise.all([
      dashboard.pipelineStages().then((r) => setStages(r as Stage[])),
      contacts.list().then((r) => setContactsList(r as Contact[])),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const contactsByStage = stages.reduce(
    (acc, stage) => {
      acc[stage.id] = contactsList.filter((c) => c.pipeline_stage_id === stage.id);
      return acc;
    },
    {} as Record<string, Contact[]>
  );

  const unassigned = contactsList.filter((c) => !c.pipeline_stage_id);

  const handleDragStart = (event: DragStartEvent) => {
    const contact = contactsList.find((c) => c.id === event.active.id);
    if (contact) setActiveContact(contact);
  };

  const stageIds = new Set(stages.map((s) => s.id));
  const contactToStage = contactsList.reduce(
    (acc, c) => {
      if (c.pipeline_stage_id) acc[c.id] = c.pipeline_stage_id;
      return acc;
    },
    {} as Record<string, string>
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveContact(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const contactId = String(active.id);
    let toStageId: string;
    const overId = String(over.id);
    if (stageIds.has(overId)) {
      toStageId = overId;
    } else if (contactToStage[overId]) {
      toStageId = contactToStage[overId];
    } else {
      return;
    }

    const contact = contactsList.find((c) => c.id === contactId);
    if (!contact || contact.pipeline_stage_id === toStageId) return;

    try {
      await contacts.update(contactId, { pipeline_stage_id: toStageId });
      setContactsList((prev) =>
        prev.map((c) =>
          c.id === contactId ? { ...c, pipeline_stage_id: toStageId } : c
        )
      );
    } catch (err) {
      console.error('Failed to move contact:', err);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {t('leadPipeline')}
        </h1>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-72 h-64 bg-white rounded-xl animate-pulse border border-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {t('leadPipeline')}
            </h1>
            <p className="text-slate-500 mt-1">
              {t('manageStages')} - {contactsList.length}{' '}
              {t('leads')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <HiOutlineUserGroup className="w-4 h-4" />
              <span>
                {unassigned.length} {t('unassigned')}
              </span>
            </div>
          </div>
        </header>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {stages.map((stage) => {
            const count = (contactsByStage[stage.id] || []).length;
            return (
              <div
                key={stage.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-100 text-sm whitespace-nowrap"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-slate-600">{tLang(stage.name_ar, stage.name_en)}</span>
                <span className="font-bold text-slate-800">{count}</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
          {stages.map((stage) => (
            <DroppableStage
              key={stage.id}
              stage={stage}
              stageContacts={contactsByStage[stage.id] || []}
              tCrm={t}
              tLang={tLang}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeContact ? (
          <div className="w-72 p-2">
            <ContactCard
              c={activeContact}
              typeLabel={
                CONTACT_TYPES[activeContact.contact_type as keyof typeof CONTACT_TYPES] as
                  | { ar: string; en: string }
                  | undefined
              }
              t={t}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
