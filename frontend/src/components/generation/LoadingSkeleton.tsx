import { Card, CardContent } from '../ui/card';

function SkeletonLine({ width }: { width: string }) {
  return (
    <div
      className="h-4 rounded-full animate-shimmer"
      style={{ width }}
    />
  );
}

export function LoadingSkeleton() {
  return (
    <Card>
      <CardContent className="py-8">
        {/* Header text */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-5 w-5 rounded-full bg-[var(--color-brand)] animate-subtle-pulse" />
          <p className="text-sm font-medium text-[var(--color-text-medium)]">
            AI is generating your copy...
          </p>
        </div>

        {/* Skeleton lines with shimmer */}
        <div className="space-y-3.5">
          <SkeletonLine width="90%" />
          <SkeletonLine width="75%" />
          <SkeletonLine width="85%" />
          <SkeletonLine width="60%" />
          <div className="pt-3">
            <SkeletonLine width="80%" />
          </div>
          <div className="pt-3">
            <SkeletonLine width="70%" />
          </div>
          <SkeletonLine width="55%" />
        </div>

        {/* Subtle hint */}
        <p className="mt-8 text-xs text-[var(--color-text-muted)] text-center">
          Large documents may take 10-30 seconds. Thank you for your patience.
        </p>
      </CardContent>
    </Card>
  );
}
