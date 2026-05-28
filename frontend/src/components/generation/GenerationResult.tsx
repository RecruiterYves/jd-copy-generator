import type { Platform, UsageInfo } from '../../types';
import type { GenerateResponse } from '../../types';
import { Card, CardContent, CardHeader, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { PLATFORM_LABELS } from '../../lib/constants';
import { escapeRegExp } from '../../lib/sensitiveTerms';
import { CopyButton } from './CopyButton';

interface GenerationResultProps {
  result: GenerateResponse;
}

function UsageFooter({ usage, modelUsed }: { usage: UsageInfo; modelUsed: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
      <span>
        Tokens:{' '}
        <span className="font-mono font-medium text-[var(--color-text-medium)] tabular-nums">
          {usage.input_tokens.toLocaleString()}
        </span>{' '}
        in +{' '}
        <span className="font-mono font-medium text-[var(--color-text-medium)] tabular-nums">
          {usage.output_tokens.toLocaleString()}
        </span>{' '}
        out
      </span>
      <span className="text-[var(--color-border)]">|</span>
      <span>
        Est. cost{' '}
        <span className="font-mono font-medium text-[var(--color-text-medium)]">
          ${usage.cost_estimate_usd.toFixed(4)}
        </span>
      </span>
      <span className="text-[var(--color-border)]">|</span>
      <span className="font-mono text-[var(--color-text-muted)]">{modelUsed}</span>
    </div>
  );
}

const platformBadgeClasses: Record<Platform, string> = {
  boss: 'bg-amber-50 text-amber-700',
  tg: 'bg-sky-50 text-sky-600',
  red: 'bg-rose-50 text-rose-600',
  linkedin: 'bg-blue-50 text-blue-600',
};

function HighlightedOriginal({
  text,
  terms,
}: {
  text: string;
  terms: string[];
}) {
  if (terms.length === 0) {
    return (
      <pre className="text-sm text-[var(--color-text)] whitespace-pre-wrap font-sans leading-relaxed">
        {text}
      </pre>
    );
  }

  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  const parts = text.split(pattern);

  return (
    <pre className="text-sm text-[var(--color-text)] whitespace-pre-wrap font-sans leading-relaxed">
      {parts.map((part, index) => {
        const isMatch = terms.some((term) => part.toLowerCase() === term.toLowerCase());
        return isMatch ? (
          <mark
            key={`${part}-${index}`}
            className="rounded px-1 bg-[var(--color-warning-light)] text-[var(--color-warning)]"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        );
      })}
    </pre>
  );
}

export function GenerationResult({ result }: GenerationResultProps) {
  const {
    platform,
    content,
    usage,
    model_used,
    sensitive_matches = [],
    original_text,
  } = result;
  const isBoss = platform === 'boss';
  const matchedTerms = sensitive_matches.map((match) => match.term);

  return (
    <Card className="animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5">
          <h3 className="text-sm font-semibold text-[var(--color-text)]" style={{ letterSpacing: '-0.01em' }}>
            Result
          </h3>
          <Badge className={platformBadgeClasses[platform]}>
            {PLATFORM_LABELS[platform]}
          </Badge>
        </div>
        <CopyButton text={content} />
      </CardHeader>

      <CardContent>
        {isBoss && (
          <div className="mb-4 space-y-4">
            <div className="rounded-xl border border-[var(--color-border-light)] bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-[var(--color-text)]">
                  敏感词检测
                </span>
                {sensitive_matches.length === 0 ? (
                  <Badge variant="success">未命中敏感词</Badge>
                ) : (
                  sensitive_matches.map((match) => (
                    <Badge key={match.term} variant="warning">
                      {match.term} x{match.count}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {original_text && (
              <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-page)] p-4 overflow-auto max-h-[300px]">
                <p className="mb-2 text-xs font-medium text-[var(--color-text-muted)]">
                  原文标记
                </p>
                <HighlightedOriginal text={original_text} terms={matchedTerms} />
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-page)] p-5 overflow-auto max-h-[500px]">
          {isBoss && (
            <p className="mb-2 text-xs font-medium text-[var(--color-text-muted)]">
              {sensitive_matches.length > 0 ? '合规改写结果' : '原始JD'}
            </p>
          )}
          <pre className="text-sm text-[var(--color-text)] whitespace-pre-wrap font-sans leading-relaxed">
            {content}
          </pre>
        </div>
      </CardContent>

      <CardFooter>
        <UsageFooter usage={usage} modelUsed={model_used} />
      </CardFooter>
    </Card>
  );
}
