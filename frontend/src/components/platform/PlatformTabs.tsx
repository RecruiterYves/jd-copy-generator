import type { Platform } from '../../types';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

interface PlatformTabsProps {
  selected: Platform;
  onSelect: (p: Platform) => void;
}

const platformLabels: Record<Platform, { label: string; sub: string }> = {
  boss: { label: 'Boss直聘', sub: 'Compliance' },
  tg: { label: 'Telegram', sub: 'Batch' },
  red: { label: '小红书', sub: 'Single' },
  linkedin: { label: 'LinkedIn', sub: 'Single' },
};

export function PlatformTabs({ selected, onSelect }: PlatformTabsProps) {
  return (
    <Tabs value={selected} onValueChange={(v) => onSelect(v as Platform)}>
      <TabsList className="w-full justify-center">
        {(Object.keys(platformLabels) as Platform[]).map((key) => {
          const { label, sub } = platformLabels[key];
          const isSelected = selected === key;
          return (
            <TabsTrigger
              key={key}
              value={key}
              className="flex items-center gap-1.5 flex-1 justify-center max-w-[200px]"
            >
              <span className="text-sm">{label}</span>
              {isSelected && (
                <span className="text-[11px] opacity-70 hidden sm:inline">
                  {sub}
                </span>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
