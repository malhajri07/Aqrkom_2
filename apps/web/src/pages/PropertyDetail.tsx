import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { properties } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { PROPERTY_TYPES, TRANSACTION_TYPES, PROPERTY_STATUS } from '@aqarkom/shared';
import { HiOutlineBuildingOffice2, HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi2';

export function PropertyDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [prop, setProp] = useState<Record<string, unknown> | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (id) {
      properties.get(id).then((r) => setProp(r as Record<string, unknown>)).catch(() => setProp(null));
    }
  }, [id]);

  if (!prop) return <div className="p-8">{t('جاري التحميل...', 'Loading...')}</div>;

  const typeLabel = PROPERTY_TYPES[prop.property_type as keyof typeof PROPERTY_TYPES] as { ar: string; en: string } | undefined;
  const transLabel = TRANSACTION_TYPES[prop.transaction_type as keyof typeof TRANSACTION_TYPES] as { ar: string; en: string } | undefined;
  const statusLabel = PROPERTY_STATUS[prop.status as keyof typeof PROPERTY_STATUS] as { ar: string; en: string } | undefined;
  const photos = (Array.isArray(prop.photos) ? prop.photos : []) as string[];
  const virtualTourUrl = prop.virtual_tour_url as string | undefined;

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">{String(prop.title_ar)}</h1>
        <Link to={`/properties/${id}/edit`} className="px-4 py-2 bg-primary-600 text-white rounded-lg">
          {t('تعديل', 'Edit')}
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow overflow-hidden">
        {photos.length > 0 ? (
          <div className="relative">
            <img src={photos[photoIndex]} alt="" className="w-full h-80 object-cover" />
            {photos.length > 1 && (
              <>
                <button type="button" onClick={() => setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                  <HiOutlineChevronRight className="w-5 h-5" />
                </button>
                <button type="button" onClick={() => setPhotoIndex((i) => (i + 1) % photos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70">
                  <HiOutlineChevronLeft className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {photos.map((_, i) => (
                    <button key={i} type="button" onClick={() => setPhotoIndex(i)} className={`w-2 h-2 rounded-full ${i === photoIndex ? 'bg-white' : 'bg-white/50'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-64 bg-slate-200 flex items-center justify-center"><HiOutlineBuildingOffice2 className="w-16 h-16 text-slate-400" /></div>
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
              {t('ترخيص REGA', 'REGA License')}: <span className="font-medium">{String(prop.rega_ad_license)}</span>
            </p>
          )}

          {virtualTourUrl && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">{t('جولة افتراضية', 'Virtual Tour')}</h3>
              <iframe
                src={virtualTourUrl.startsWith('http') ? virtualTourUrl : `https://my.matterport.com/show/?m=${virtualTourUrl}`}
                title="Virtual Tour"
                className="w-full h-96 rounded-lg border"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
