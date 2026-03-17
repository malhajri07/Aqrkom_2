import { Link } from 'react-router-dom';
import { HiOutlineHomeModern, HiOutlineMapPin } from 'react-icons/hi2';
import { PROPERTY_TYPES, PROPERTY_STATUS } from '@aqarkom/shared';
import { formatSAR } from '@aqarkom/shared';
import { cn } from '@/lib/utils';

export interface PropertyCardData {
  id: string;
  title_ar?: string;
  title_en?: string;
  price: number;
  district?: string;
  city?: string;
  property_type?: string;
  status?: string;
  area_sqm?: number | null;
  bedrooms?: number | null;
  photos?: string[];
}

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-holly-100 text-holly-700',
  pending: 'bg-yellow-100 text-yellow-700',
  sold: 'bg-red-100 text-red-700',
  leased: 'bg-blue-100 text-blue-700',
  under_contract: 'bg-purple-100 text-purple-700',
  withdrawn: 'bg-slate-100 text-slate-600',
  expired: 'bg-slate-100 text-slate-500',
};

interface PropertyCardProps {
  property: PropertyCardData;
  t: (ar: string, en: string) => string;
  className?: string;
}

export function PropertyCard({ property, t, className }: PropertyCardProps) {
  const typeLabel = property.property_type
    ? PROPERTY_TYPES[property.property_type as keyof typeof PROPERTY_TYPES]
    : null;
  const statusLabel = property.status
    ? PROPERTY_STATUS[property.status as keyof typeof PROPERTY_STATUS]
    : null;
  const statusColor = STATUS_COLORS[property.status || ''] || 'bg-slate-100 text-slate-600';

  return (
    <Link
      to={`/properties/${property.id}`}
      className={cn(
        'bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-holly-200 transition-all group block',
        className
      )}
    >
      <div className="w-full h-44 bg-slate-100 flex items-center justify-center relative">
        {Array.isArray(property.photos) && property.photos[0] ? (
          <img
            src={property.photos[0]}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <HiOutlineHomeModern className="w-12 h-12 text-slate-300" />
        )}
        <span
          className={cn(
            'absolute top-3 start-3 text-xs px-2 py-1 rounded-full font-medium',
            statusColor
          )}
        >
          {statusLabel ? t(statusLabel.ar, statusLabel.en) : String(property.status)}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <p className="font-semibold text-slate-900 truncate group-hover:text-holly-700 transition-colors">
          {String(property.title_ar || property.title_en || '')}
        </p>
        <p className="text-lg font-bold text-holly-600">
          {formatSAR(property.price)}
        </p>
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <HiOutlineMapPin className="w-3.5 h-3.5" />
          <span>
            {String(property.district || '')}, {String(property.city || '')}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 border-t border-slate-50">
          {typeLabel && (
            <span className="px-2 py-0.5 bg-slate-50 rounded">
              {t(typeLabel.ar, typeLabel.en)}
            </span>
          )}
          {property.area_sqm != null && (
            <span>{String(property.area_sqm)} م²</span>
          )}
          {property.bedrooms != null && (
            <span>
              {String(property.bedrooms)} {t('غرفة', 'bed')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
