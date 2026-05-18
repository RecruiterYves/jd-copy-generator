import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<string, string> = {
  default:
    'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] shadow-[var(--shadow-button)] hover:translate-y-[-1px]',
  outline:
    'border border-[var(--color-border)] bg-white text-[var(--color-text-medium)] hover:bg-[var(--color-page)]',
  ghost:
    'text-[var(--color-text-medium)] hover:text-[var(--color-text)] hover:bg-[var(--color-page)]',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-full gap-1.5',
  default: 'px-5 py-2.5 text-sm rounded-full gap-2',
  lg: 'px-6 py-3 text-base rounded-full gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/30 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.98]',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
