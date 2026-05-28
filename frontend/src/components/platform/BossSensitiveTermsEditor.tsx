import { useMemo, useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { DEFAULT_BOSS_SENSITIVE_TERMS } from '../../lib/constants';
import { normalizeTerms, parseTermsText } from '../../lib/sensitiveTerms';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';

interface BossSensitiveTermsEditorProps {
  terms: string[];
  onTermsChange: (terms: string[]) => void;
}

export function BossSensitiveTermsEditor({
  terms,
  onTermsChange,
}: BossSensitiveTermsEditorProps) {
  const [draft, setDraft] = useState(() => terms.join('\n'));

  const parsedDraft = useMemo(() => parseTermsText(draft), [draft]);

  return (
    <div className="rounded-xl border border-[var(--color-border-light)] bg-white px-4 py-3 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">Boss敏感词库</p>
          <p className="text-xs text-[var(--color-text-muted)]">
            每行一个词，也支持用逗号或顿号分隔，保存后仅存于当前浏览器。
          </p>
        </div>
        <Badge variant="warning">{parsedDraft.length} terms</Badge>
      </div>

      <Textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="min-h-[120px] bg-[var(--color-page)]"
        aria-label="Boss sensitive terms"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={() => {
            const nextTerms = normalizeTerms(parsedDraft);
            onTermsChange(nextTerms);
            setDraft(nextTerms.join('\n'));
          }}
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            onTermsChange(DEFAULT_BOSS_SENSITIVE_TERMS);
            setDraft(DEFAULT_BOSS_SENSITIVE_TERMS.join('\n'));
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>
    </div>
  );
}
