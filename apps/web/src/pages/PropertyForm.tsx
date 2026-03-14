import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { properties, properties as propsApi } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { PROPERTY_TYPES, TRANSACTION_TYPES, SAUDI_CITIES } from '@aqarkom/shared';

export function PropertyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
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
    price: '',
    price_type: 'total',
    area_sqm: '',
    bedrooms: '',
    bathrooms: '',
    photos: [] as string[],
  });

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
          price: String(prop.price || ''),
          price_type: String(prop.price_type || 'total'),
          area_sqm: String(prop.area_sqm || ''),
          bedrooms: String(prop.bedrooms || ''),
          bathrooms: String(prop.bathrooms || ''),
          photos: (prop.photos as string[]) || [],
        });
      }).catch(() => navigate('/properties'));
    }
  }, [id, navigate]);

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
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            >
              {SAUDI_CITIES.map((c) => (
                <option key={c.code} value={c.code}>{t(c.ar, c.en)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('الحي', 'District')}</label>
            <input
              required
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
              placeholder={t('مثال: النرجس', 'e.g. Al Narjis')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('السعر (ر.س)', 'Price (SAR)')}</label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
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
