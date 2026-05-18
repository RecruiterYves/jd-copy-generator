import { Button } from '../ui/button';
import { Settings } from 'lucide-react';

export interface HeaderProps {
  onOpenSettings?: () => void;
  hasApiKey?: boolean;
  providerLabel?: string;
}

export function Header({
  onOpenSettings,
  hasApiKey = false,
  providerLabel = '',
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-page)]/80 backdrop-blur-md border-b border-transparent">
      <div className="max-w-[800px] mx-auto flex items-center justify-between px-5 h-14">
        {/* Left: app title */}
        <h1
          className="text-base font-semibold text-[var(--color-text)] select-none"
          style={{ letterSpacing: '-0.01em' }}
        >
          JD Copywriter
        </h1>

        {/* Right: settings + subtle status */}
        <div className="flex items-center gap-3">
          {/* API status indicator — subtle dot only */}
          <span
            className="relative flex h-2.5 w-2.5"
            title={hasApiKey ? `Configured: ${providerLabel}` : 'No API key configured'}
          >
            <span
              className={`absolute inline-flex h-full w-full rounded-full ${
                hasApiKey
                  ? 'bg-[var(--color-success)] animate-subtle-pulse'
                  : 'bg-[var(--color-destructive)] animate-subtle-pulse'
              }`}
            />
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            aria-label="API Settings"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline ml-1.5">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
