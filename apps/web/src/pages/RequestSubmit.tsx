import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requests } from '../lib/api';
import { useLanguage } from '../context/LanguageContext';
import { PROPERTY_TYPES, SAUDI_CITIES } from '@aqarkom/shared';
import { HijriDatePicker } from '../components/common/HijriDatePicker';

export function RequestSubmit() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    request_type: 'rent_annual',
    property_type: 'apartment',
    city: 'riyadh',
    districts: [''],
    budget_min: '',
    budget_max: '',
    bedrooms_min: '',
    area_min_sqm: '',
    move_in_date: '',
    additional_requirements: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const districts = form.districts.filter(Boolean);
      if (districts.length === 0) districts.push('الرياض');
      const cityData = SAUDI_CITIES.find((c) => c.code === form.city);
      const res = await requests.create({
        ...form,
        city: cityData?.ar || form.city,
        districts,
        budget_min: form.budget_min ? Number(form.budget_min) : undefined,
        budget_max: Number(form.budget_max),
        bedrooms_min: form.bedrooms_min ? Number(form.bedrooms_min) : undefined,
        area_min_sqm: form.area_min_sqm ? Number(form.area_min_sqm) : undefined,
        move_in_date: form.move_in_date || undefined,
      });
      navigate(`/requests/${res.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">{t('أضف طلب عقاري', 'Submit Property Request')}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 rounded-xl p-6 shadow">
        <div>
          <label className="block text-sm font-medium mb-1">{t('نوع الطلب', 'Request Type')}</label>
          <select
            value={form.request_type}
            onChange={(e) => setForm({ ...form, request_type: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border"
          >
            <option value="buy">{t('شراء', 'Buy')}</option>
            <option value="rent_annual">{t('إيجار سنوي', 'Annual Rent')}</option>
            <option value="rent_monthly">{t('إيجار شهري', 'Monthly Rent')}</option>
            <option value="rent_daily">{t('إيجار يومي', 'Daily Rent')}</option>
          </select>
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
          <label className="block text-sm font-medium mb-1">{t('الأحياء المفضلة', 'Preferred Neighborhoods')}</label>
          <input
            value={form.districts.join(', ')}
            onChange={(e) => setForm({ ...form, districts: e.target.value.split(/[,،]/).map(s => s.trim()).filter(Boolean) })}
            className="w-full px-4 py-2 rounded-lg border"
            placeholder={t('مثال: النرجس، الروضة', 'e.g. Al Narjis, Ar Rawdah')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('الحد الأدنى للسعر (ر.س)', 'Min Budget')}</label>
            <input
              type="number"
              value={form.budget_min}
              onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('الحد الأقصى للسعر (ر.س)', 'Max Budget')} *</label>
            <input
              required
              type="number"
              value={form.budget_max}
              onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('غرف نوم (حد أدنى)', 'Min Bedrooms')}</label>
            <input
              type="number"
              value={form.bedrooms_min}
              onChange={(e) => setForm({ ...form, bedrooms_min: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('المساحة (م²) حد أدنى', 'Min Area')}</label>
            <input
              type="number"
              value={form.area_min_sqm}
              onChange={(e) => setForm({ ...form, area_min_sqm: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border"
            />
          </div>
        </div>

        <div>
          <HijriDatePicker
            label={t('تاريخ الانتقال', 'Move-in Date')}
            value={form.move_in_date || null}
            onChange={(d) => setForm({ ...form, move_in_date: d.toISOString().slice(0, 10) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('متطلبات إضافية', 'Additional Requirements')}</label>
          <textarea
            value={form.additional_requirements}
            onChange={(e) => setForm({ ...form, additional_requirements: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border"
          />
        </div>

        <button type="submit" disabled={loading} className="px-6 py-2 bg-primary-600 text-white rounded-lg">
          {loading ? t('جاري...', 'Submitting...') : t('إرسال الطلب', 'Submit Request')}
        </button>
      </form>
    </div>
  );
}
