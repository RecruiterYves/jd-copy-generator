import { type SelectHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-[var(--color-text)] mb-1.5"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-xl border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm',
          'text-[var(--color-text)]',
          'hover:border-[var(--color-border-dashed)]',
          'focus:outline-none focus:shadow-[0_0_0_2px_rgba(37,99,235,0.3)] focus:border-transparent',
          'disabled:cursor-not-allowed disabled:bg-[var(--color-page)] disabled:text-[var(--color-text-medium)]',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
