import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { formatSaudiPhone } from '@aqarkom/shared';

interface PhoneInputProps extends Omit<React.ComponentProps<typeof Input>, 'type' | 'value' | 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
}

/**
 * Saudi phone input - +966 5XX XXX XXXX format
 */
export function PhoneInput({ value = '', onChange, className, ...props }: PhoneInputProps) {
  const [display, setDisplay] = React.useState(() => (value ? formatSaudiPhone(value) : ''));
  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    if (!focused && value) {
      setDisplay(formatSaudiPhone(value));
    }
  }, [value, focused]);

  const cleanPhone = (s: string): string => {
    return s.replace(/\D/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = cleanPhone(raw);
    if (cleaned.length <= 12) {
      setDisplay(raw);
      const normalized = cleaned.startsWith('966') ? cleaned : (cleaned.startsWith('0') ? '966' + cleaned.slice(1) : '966' + cleaned);
      onChange?.(normalized || '');
    }
  };

  const handleFocus = () => {
    setFocused(true);
    setDisplay(value || '');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    const cleaned = cleanPhone(display);
    if (cleaned) {
      const formatted = formatSaudiPhone(cleaned.startsWith('966') ? cleaned : '966' + cleaned);
      setDisplay(formatted);
      onChange?.(cleaned.startsWith('966') ? cleaned : '966' + cleaned);
    } else {
      setDisplay('');
      onChange?.('');
    }
    props.onBlur?.(e);
  };

  return (
    <Input
      type="tel"
      inputMode="tel"
      value={display}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder="+966 5XX XXX XXXX"
      className={cn('font-mono', className)}
      dir="ltr"
      {...props}
    />
  );
}
