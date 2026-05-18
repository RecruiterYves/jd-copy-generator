import { Loader2 } from 'lucide-react';

interface GenerateButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export function GenerateButton({
  onClick,
  loading,
  disabled,
}: GenerateButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full inline-flex items-center justify-center gap-2 rounded-full h-[48px] px-6 text-base font-medium
        bg-[var(--color-brand)] text-white
        hover:bg-[var(--color-brand-hover)] hover:translate-y-[-1px]
        active:scale-[0.98]
        disabled:pointer-events-none disabled:opacity-50
        focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(37,99,235,0.3)]
        shadow-[0_4px_14px_-4px_rgba(37,99,235,0.3)]"
      style={{ letterSpacing: '-0.01em' }}
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          AI Generating...
        </>
      ) : (
        'Generate Copy'
      )}
    </button>
  );
}
