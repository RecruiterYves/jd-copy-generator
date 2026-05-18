import type { Provider } from '../../types';
import { PROVIDER_LABELS } from '../../lib/constants';
import { cn } from '../../lib/utils';

interface ProviderSelectorProps {
  selected: Provider;
  onSelect: (p: Provider) => void;
}

const providers: { value: Provider; label: string }[] = [
  { value: 'claude', label: 'Claude' },
  { value: 'openai', label: 'OpenAI' },
  { value: 'deepseek', label: 'DeepSeek' },
];

export function ProviderSelector({ selected, onSelect }: ProviderSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text)] mb-2.5">
        AI Provider
      </label>
      <div className="grid grid-cols-3 gap-3">
        {providers.map(({ value, label }) => {
          const isActive = selected === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              className={cn(
                'relative rounded-xl border-2 px-3 py-3.5 text-center transition-all',
                'focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(37,99,235,0.3)]',
                isActive
                  ? 'border-[var(--color-brand)] bg-[var(--color-brand-light)]'
                  : 'border-[var(--color-border)] bg-white hover:border-[var(--color-border-dashed)]',
              )}
              aria-pressed={isActive}
            >
              <p
                className={cn(
                  'text-sm font-semibold',
                  isActive ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-medium)]',
                )}
              >
                {label}
              </p>
              <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                {PROVIDER_LABELS[value]}
              </p>
              {isActive && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--color-brand)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
