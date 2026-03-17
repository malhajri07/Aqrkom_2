/**
 * HijriDatePicker — Dual Hijri/Gregorian date display and input.
 * Uses moment-hijri for conversion.
 */

import { useState } from 'react';
import moment from 'moment-hijri';

interface HijriDatePickerProps {
  value?: Date | string | null;
  onChange?: (date: Date) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function HijriDatePicker({
  value,
  onChange,
  label,
  disabled,
  className = '',
}: HijriDatePickerProps) {
  const [inputVal, setInputVal] = useState(() => {
    if (value) {
      const d = typeof value === 'string' ? new Date(value) : value;
      return d.toISOString().slice(0, 10);
    }
    return '';
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setInputVal(v);
    if (v && onChange) {
      onChange(new Date(v));
    }
  };

  const displayDual = value
    ? (() => {
        const d = typeof value === 'string' ? new Date(value) : value;
        const m = moment(d);
        const hijri = m.format('iYYYY/iMM/iDD');
        const gregorian = m.format('YYYY/MM/DD');
        return `${hijri} هـ (${gregorian} م)`;
      })()
    : '—';

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="flex gap-2 items-center">
        <input
          type="date"
          value={inputVal}
          onChange={handleChange}
          disabled={disabled}
          className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
        />
        {value && (
          <span className="text-sm text-slate-500" title="Hijri (Gregorian)">
            {displayDual}
          </span>
        )}
      </div>
    </div>
  );
}

/** Format date for display with Hijri + Gregorian */
export function formatDualDate(date: Date | string, locale: 'ar' | 'en' = 'ar'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const m = moment(d);
  const hijri = m.format('iYYYY/iMM/iDD');
  const gregorian = m.format('YYYY/MM/DD');
  if (locale === 'ar') return `${hijri} هـ (${gregorian} م)`;
  return `${gregorian} (${hijri} H)`;
}
