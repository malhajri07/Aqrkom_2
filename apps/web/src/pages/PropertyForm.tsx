import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { properties, properties as propsApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { PROPERTY_TYPES, TRANSACTION_TYPES, SAUDI_CITIES, getNeighborhoodsForCity } from '@aqarkom/shared';
import { HiOutlinePhoto, HiOutlineXMark, HiBars3 } from 'react-icons/hi2';
import { PriceInput } from '../components/common/PriceInput';
import { MapPicker } from '../components/common/MapPicker';

export function PropertyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    rega_ad_license: '',
    property_type: 'apartment',
    transaction_type: 'sale',
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    city: 'riyadh',
    district: '',
    street: '',
    latitude: null as number | null,
    longitude: null as number | null,
    price: '',
    price_type: 'total',
    area_sqm: '',
    bedrooms: '',
    bathrooms: '',
    photos: [] as string[],
    video_url: '',
    virtual_tour_url: '',
  });

  const neighborhoods = getNeighborhoodsForCity(form.city);

  useEffect(() => {
    if (id) {
      propsApi.get(id).then((p: unknown) => {
        const prop = p as Record<string, unknown>;
        const cityCode = SAUDI_CITIES.find((c) => c.ar === prop.city || c.en === prop.city)?.code || 'riyadh';
        setForm({
          rega_ad_license: String(prop.rega_ad_license || ''),
          property_type: String(prop.property_type || 'apartment'),
          transaction_type: String(prop.transaction_type || 'sale'),
          title_ar: String(prop.title_ar || ''),
          title_en: String(prop.title_en || ''),
          description_ar: String(prop.description_ar || ''),
          description_en: String(prop.description_en || ''),
          city: cityCode,
        district: String(prop.district || ''),
        street: String(prop.street || ''),
        latitude: prop.latitude != null ? Number(prop.latitude) : null,
        longitude: prop.longitude != null ? Number(prop.longitude) : null,
          price: String(prop.price || ''),
          price_type: String(prop.price_type || 'total'),
          area_sqm: String(prop.area_sqm || ''),
          bedrooms: String(prop.bedrooms || ''),
          bathrooms: String(prop.bathrooms || ''),
          photos: (prop.photos as string[]) || [],
          video_url: String(prop.video_url || ''),
          virtual_tour_url: String(prop.virtual_tour_url || ''),
        });
      }).catch(() => navigate('/properties'));
    }
  }, [id, navigate]);

  const handlePhotoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !id) return;
    setUploading(true);
    try {
      const fd = new FormData();
      for (let i = 0; i < Math.min(files.length, 50); i++) fd.append('photos', files[i]);
      const res = await properties.uploadPhotos(id, fd);
      setForm((f) => ({ ...f, photos: res.photos as string[] }));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, [id]);

  const updatePhotosAndSave = (newPhotos: string[]) => {
    setForm((f) => ({ ...f, photos: newPhotos }));
    if (id && newPhotos.length >= 0) {
      properties.reorderPhotos(id, newPhotos).catch((err) => alert(err instanceof Error ? err.message : 'Failed'));
    }
  };

  const movePhoto = (from: number, to: number) => {
    const arr = [...form.photos];
    const [removed] = arr.splice(from, 1);
    arr.splice(to, 0, removed);
    updatePhotosAndSave(arr);
  };

  const removePhoto = (idx: number) => {
    updatePhotosAndSave(form.photos.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const cityData = SAUDI_CITIES.find((c) => c.code === form.city);
      const data = {
        ...form,
        city: cityData?.ar || form.city,
        price: Number(form.price) || 0,
        area_sqm: form.area_sqm ? Number(form.area_sqm) : null,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        video_url: form.video_url || undefined,
        virtual_tour_url: form.virtual_tour_url || undefined,
        latitude: form.latitude ?? undefined,
        longitude: form.longitude ?? undefined,
      };
      if (isEdit) {
        await properties.update(id!, data);
      } else {
        const res = await properties.create(data);
        navigate(`/properties/${res.id}`);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        {isEdit ? t('تعديل الإعلان', 'Edit Listing') : t('إضافة إعلان عقاري', 'Add Property Listing')}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 rounded-xl p-6 shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('رقم ترخيص REGA', 'REGA License')}</label>
            <input
              required
              value={form.rega_ad_license}
              onChange={(e) => setForm({ ...form, rega_ad_license: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('نوع العقار', 'Property Type')}</label>
            <select
              value={form.property_type}
              onChange={(e) => setForm({ ...form, property_type: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            >
              {Object.entries(PROPERTY_TYPES).map(([k, v]) => (
                <option key={k} value={k}>{t(v.ar, v.en)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('نوع المعاملة', 'Transaction Type')}</label>
          <select
            value={form.transaction_type}
            onChange={(e) => setForm({ ...form, transaction_type: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border"
          >
            {Object.entries(TRANSACTION_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{t(v.ar, v.en)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('العنوان (عربي)', 'Title (Arabic)')}</label>
          <input
            required
            value={form.title_ar}
            onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('المدينة', 'City')}</label>
            <select
              value={form.city}
              onChange={(e) => {
                const newCity = e.target.value;
                const newNeighborhoods = getNeighborhoodsForCity(newCity);
                const districtValid = newNeighborhoods.some((n) => n.ar === form.district);
                setForm({ ...form, city: newCity, district: districtValid ? form.district : '' });
              }}
              className="w-full px-4 py-2 rounded-lg border"
            >
              {SAUDI_CITIES.map((c) => (
                <option key={c.code} value={c.code}>{t(c.ar, c.en)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('الحي', 'District')}</label>
            {neighborhoods.length > 0 ? (
              <select
                required
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
              >
                <option value="">{t('اختر الحي', 'Select neighborhood')}</option>
                {neighborhoods.map((n) => (
                  <option key={n.ar} value={n.ar}>{t(n.ar, n.en)}</option>
                ))}
              </select>
            ) : (
              <input
                required
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border"
                placeholder={t('مثال: النرجس', 'e.g. Al Narjis')}
              />
            )}
          </div>
        </div>

        <div>
          <MapPicker
            value={form.latitude != null && form.longitude != null ? { lat: form.latitude, lng: form.longitude } : null}
            onChange={(lat, lng) => setForm((f) => ({ ...f, latitude: lat, longitude: lng }))}
            height="280px"
            label={t('اختر الموقع على الخريطة', 'Pick location on map')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('رابط الفيديو', 'Video URL')}</label>
            <input
              type="url"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('جولة افتراضية (Matterport)', 'Virtual Tour (Matterport)')}</label>
            <input
              type="url"
              value={form.virtual_tour_url}
              onChange={(e) => setForm({ ...form, virtual_tour_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
              placeholder="https://my.matterport.com/..."
            />
          </div>
        </div>

        {isEdit && (
          <div>
            <label className="block text-sm font-medium mb-1">{t('الصور (اسحب لإعادة الترتيب)', 'Photos (drag to reorder)')}</label>
            <div className="flex flex-wrap gap-2 items-center">
              {form.photos.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url.startsWith('/') ? url : `http://localhost:3000${url}`} alt="" className="w-20 h-20 object-cover rounded-lg border" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1 rounded-lg transition-opacity">
                    <button type="button" onClick={() => idx > 0 && movePhoto(idx, idx - 1)} className="p-1 bg-white rounded" title={t('أمام', 'Move left')}><HiBars3 className="w-4 h-4" /></button>
                    <button type="button" onClick={() => removePhoto(idx)} className="p-1 bg-red-500 text-white rounded" title={t('حذف', 'Remove')}><HiOutlineXMark className="w-4 h-4" /></button>
                    <button type="button" onClick={() => idx < form.photos.length - 1 && movePhoto(idx, idx + 1)} className="p-1 bg-white rounded" title={t('خلف', 'Move right')}><HiBars3 className="w-4 h-4 rotate-180" /></button>
                  </div>
                </div>
              ))}
              <label className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-50">
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                {uploading ? <span className="text-xs">{t('جاري...', '...')}</span> : <HiOutlinePhoto className="w-8 h-8 text-slate-400" />}
              </label>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('السعر (ر.س)', 'Price (SAR)')}</label>
            <PriceInput
              value={form.price ? Number(form.price) : undefined}
              onChange={(v) => setForm({ ...form, price: v != null ? String(v) : '' })}
              locale={language}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('المساحة (م²)', 'Area (m²)')}</label>
            <input
              type="number"
              value={form.area_sqm}
              onChange={(e) => setForm({ ...form, area_sqm: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('غرف النوم', 'Bedrooms')}</label>
            <input
              type="number"
              value={form.bedrooms}
              onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('الوصف (عربي)', 'Description (Arabic)')}</label>
          <textarea
            value={form.description_ar}
            onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 rounded-lg border"
          />
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="px-6 py-2 bg-primary-600 text-white rounded-lg">
            {loading ? t('جاري...', 'Saving...') : t('حفظ', 'Save')}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border rounded-lg">
            {t('إلغاء', 'Cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
