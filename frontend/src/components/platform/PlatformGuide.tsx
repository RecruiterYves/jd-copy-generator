import type { Platform } from '../../types';
import { Info } from 'lucide-react';

const guides: Record<Platform, string> = {
  boss: '检测Boss直聘容易违规的敏感词，命中后标记原文并用AI自动删除或替换，保持JD原意顺畅。',
  tg: 'Upload multiple JDs to generate a summary post with all role titles and requirement highlights.',
  red: 'One role per post. Extracts 3 responsibilities, 3 requirements, and 3 nice-to-haves.',
  linkedin: 'JD translated to English, generating a LinkedIn-style professional recruitment post.',
};

export function PlatformGuide({ platform }: { platform: Platform }) {
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm text-[var(--color-text-medium)] flex items-start gap-2.5"
      style={{ backgroundColor: 'rgba(37, 99, 235, 0.03)' }}
    >
      <Info className="h-4 w-4 mt-0.5 shrink-0" style={{ color: 'var(--color-brand)' }} />
      <p className="leading-relaxed">{guides[platform]}</p>
    </div>
  );
}
