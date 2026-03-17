/**
 * Saudi-specific formatters - shared FE/BE
 * From saudi_localization.md and frontend.md
 */

/** SAR price formatting */
export function formatSAR(amount: number, locale: 'ar' | 'en' = 'ar'): string {
  if (locale === 'ar') {
    return `${amount.toLocaleString('ar-SA')} ر.س`;
  }
  return `SAR ${amount.toLocaleString('en-SA')}`;
}

/** Saudi phone format: +966 5XX XXX XXXX */
export function formatSaudiPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('966') && cleaned.length >= 12) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  if (cleaned.startsWith('05') && cleaned.length >= 10) {
    return `+966 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  return phone;
}

/** Area in م² */
export function formatArea(sqm: number, locale: 'ar' | 'en' = 'ar'): string {
  return locale === 'ar'
    ? `${sqm.toLocaleString('ar-SA')}م²`
    : `${sqm.toLocaleString()} sqm`;
}

/** Relative time - placeholder for date-fns formatDistanceToNow */
export function timeAgo(date: Date | string, locale: 'ar' | 'en' = 'ar'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (locale === 'ar') {
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
    if (diffHours < 24) return `قبل ${diffHours} ساعة`;
    if (diffDays < 7) return `قبل ${diffDays} يوم`;
    return d.toLocaleDateString('ar-SA');
  }
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-SA');
}
