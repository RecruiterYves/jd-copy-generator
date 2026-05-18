import { Textarea } from '../ui/textarea';

interface TextPasteProps {
  onTextChange: (text: string) => void;
  value: string;
  disabled?: boolean;
}

export function TextPaste({ onTextChange, value, disabled = false }: TextPasteProps) {
  const charCount = value.length;

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Paste your JD text here..."
        disabled={disabled}
        className="min-h-[200px] resize-y"
        aria-label="Paste JD text"
      />
      <div className="flex items-center justify-end">
        <span className="text-xs text-[var(--color-text-muted)]">
          <span className="font-medium tabular-nums text-[var(--color-text-medium)]">
            {charCount.toLocaleString()}
          </span>
          {' '}characters
        </span>
      </div>
    </div>
  );
}
