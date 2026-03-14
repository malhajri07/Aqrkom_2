import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { properties } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { PROPERTY_TYPES, TRANSACTION_TYPES, PROPERTY_STATUS } from '@aqarkom/shared';

export function PropertyDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [prop, setProp] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (id) {
      properties.get(id).then((r) => setProp(r as Record<string, unknown>)).catch(() => setProp(null));
    }
  }, [id]);

  if (!prop) return <div className="p-8">{t('جاري التحميل...', 'Loading...')}</div>;

  const typeLabel = PROPERTY_TYPES[prop.property_type as keyof typeof PROPERTY_TYPES] as { ar: string; en: string } | undefined;
  const transLabel = TRANSACTION_TYPES[prop.transaction_type as keyof typeof TRANSACTION_TYPES] as { ar: string; en: string } | undefined;
  const statusLabel = PROPERTY_STATUS[prop.status as keyof typeof PROPERTY_STATUS] as { ar: string; en: string } | undefined;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">{String(prop.title_ar)}</h1>
        <Link to={`/properties/${id}/edit`} className="px-4 py-2 bg-primary-600 text-white rounded-lg">
          {t('تعديل', 'Edit')}
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
        {Array.isArray(prop.photos) && prop.photos.length > 0 ? (
          <img src={prop.photos[0] as string} alt="" className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 bg-slate-200 flex items-center justify-center text-4xl">🏢</div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
              {typeLabel ? t(typeLabel.ar, typeLabel.en) : (prop.property_type as string)}
            </span>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm">
              {transLabel ? t(transLabel.ar, transLabel.en) : (prop.transaction_type as string)}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              {statusLabel ? t(statusLabel.ar, statusLabel.en) : (prop.status as string)}
            </span>
          </div>

          <div className="text-2xl font-bold text-primary-600">
            {Number(prop.price).toLocaleString('ar-SA')} ر.س
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {prop.area_sqm != null && (
              <div>
                <span className="text-slate-500 text-sm">{t('المساحة', 'Area')}</span>
                <p className="font-medium">{String(prop.area_sqm)} م²</p>
              </div>
            )}
            {prop.bedrooms != null && (
              <div>
                <span className="text-slate-500 text-sm">{t('غرف النوم', 'Bedrooms')}</span>
                <p className="font-medium">{String(prop.bedrooms)}</p>
              </div>
            )}
            {prop.bathrooms != null && (
              <div>
                <span className="text-slate-500 text-sm">{t('الحمامات', 'Bathrooms')}</span>
                <p className="font-medium">{String(prop.bathrooms)}</p>
              </div>
            )}
            <div>
              <span className="text-slate-500 text-sm">{t('الموقع', 'Location')}</span>
              <p className="font-medium">{String(prop.district)}, {String(prop.city)}</p>
            </div>
          </div>

          {prop.description_ar != null && String(prop.description_ar) && (
            <div>
              <h3 className="font-semibold mb-2">{t('الوصف', 'Description')}</h3>
              <p className="text-slate-600 dark:text-slate-400">{String(prop.description_ar)}</p>
            </div>
          )}

          {prop.rega_ad_license != null && (
            <p className="text-sm text-slate-500">
              {t('ترخيص REGA', 'REGA License')}: {String(prop.rega_ad_license)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
