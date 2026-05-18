import type { Provider, Platform } from '../types';

export const PLATFORM_LABELS: Record<Platform, string> = {
  tg: 'Telegram',
  red: '小红书',
  linkedin: 'LinkedIn',
};

export const PROVIDER_LABELS: Record<Provider, string> = {
  claude: 'Claude (Anthropic)',
  openai: 'OpenAI',
  deepseek: 'DeepSeek',
};

export const CLAUDE_MODELS = [
  { value: 'claude-sonnet-4-5-20250929', label: 'Claude Sonnet 4.5' },
  { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
  { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
];

export const OPENAI_MODELS = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
];

export const DEEPSEEK_MODELS = [
  { value: 'deepseek-chat', label: 'DeepSeek-V3' },
  { value: 'deepseek-reasoner', label: 'DeepSeek-R1' },
];

export const MAX_FILE_SIZE_MB = 10;
export const ACCEPTED_FILE_TYPES = ['.pdf', '.docx', '.txt'];
