import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-xl px-4 py-3 text-sm',
          'bg-transparent border-transparent',
          'text-[var(--color-text)] font-medium',
          'placeholder:text-[var(--color-text-muted)] placeholder:font-normal',
          'hover:bg-[var(--color-page)]',
          'focus:bg-white focus:outline-none',
          'focus:shadow-[0_0_0_2px_rgba(37,99,235,0.3)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-vertical min-h-[100px]',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
