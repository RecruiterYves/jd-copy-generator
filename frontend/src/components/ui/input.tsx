import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full rounded-xl px-3 py-2.5 text-sm',
          'border border-[var(--color-border)] bg-white',
          'text-[var(--color-text)]',
          'placeholder:text-[var(--color-text-muted)]',
          'hover:border-[var(--color-border-dashed)]',
          'focus:outline-none focus:shadow-[0_0_0_2px_rgba(37,99,235,0.3)] focus:border-transparent',
          'disabled:cursor-not-allowed disabled:bg-[var(--color-page)] disabled:text-[var(--color-text-medium)]',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
