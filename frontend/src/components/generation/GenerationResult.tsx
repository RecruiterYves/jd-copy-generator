import type { Platform, UsageInfo } from '../../types';
import type { GenerateResponse } from '../../types';
import { Card, CardContent, CardHeader, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { PLATFORM_LABELS } from '../../lib/constants';
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
  tg: 'bg-sky-50 text-sky-600',
  red: 'bg-rose-50 text-rose-600',
  linkedin: 'bg-blue-50 text-blue-600',
};

export function GenerationResult({ result }: GenerationResultProps) {
  const { platform, content, usage, model_used } = result;

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
        <div className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-page)] p-5 overflow-auto max-h-[500px]">
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
