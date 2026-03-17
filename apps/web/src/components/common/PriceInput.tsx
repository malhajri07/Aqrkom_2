import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface PriceInputProps extends Omit<React.ComponentProps<typeof Input>, 'type' | 'value' | 'onChange'> {
  value?: number;
  onChange?: (value: number) => void;
  locale?: 'ar' | 'en';
}

/**
 * SAR price input - formats display with ر.س suffix, parses numeric value
 */
function formatDisplayValue(v: number, loc: 'ar' | 'en') {
  const formatted = v.toLocaleString(loc === 'ar' ? 'ar-SA' : 'en-SA');
  return loc === 'ar' ? `${formatted} ر.س` : `SAR ${formatted}`;
}

export function PriceInput({ value, onChange, locale = 'ar', className, ...props }: PriceInputProps) {
  const [display, setDisplay] = React.useState(() =>
    value != null ? formatDisplayValue(value, locale) : ''
  );
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    if (!focused && value != null) {
      setDisplay(formatDisplayValue(value, locale));
    }
  }, [value, locale, focused]);

  const parseValue = (s: string): number => {
    const cleaned = s.replace(/[^\d.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const num = parseValue(raw);
    setDisplay(raw);
    onChange?.(num);
  };

  const handleFocus = () => {
    setFocused(true);
    setDisplay(value != null ? String(value) : '');
  };

  const handleBlur = () => {
    setFocused(false);
    const num = parseValue(display);
    setDisplay(formatDisplayValue(num, locale));
    if (num !== value) onChange?.(num);
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={display}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn('text-end', className)}
      dir="ltr"
      {...props}
    />
  );
}
