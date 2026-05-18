import { type ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

export interface LayoutProps {
  children: ReactNode;
  onOpenSettings?: () => void;
  hasApiKey?: boolean;
  providerLabel?: string;
}

export function Layout({
  children,
  onOpenSettings,
  hasApiKey = false,
  providerLabel = '',
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-page)]">
      <Header
        onOpenSettings={onOpenSettings}
        hasApiKey={hasApiKey}
        providerLabel={providerLabel}
      />
      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
