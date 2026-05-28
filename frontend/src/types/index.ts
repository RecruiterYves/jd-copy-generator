export type Platform = 'tg' | 'red' | 'linkedin' | 'boss';
export type Provider = 'claude' | 'openai' | 'deepseek';

export interface ParsedDocument {
  filename: string;
  text: string;
  char_count: number;
  parse_time_ms: number;
}

export interface UploadResponse {
  results: ParsedDocument[];
  total_chars: number;
  errors: { filename: string; error: string }[];
}

export interface GenerateRequest {
  platform: Platform;
  texts: string[];
  provider: Provider;
  api_key: string;
  model?: string;
  temperature?: number;
  sensitive_terms?: string[];
}

export interface UsageInfo {
  input_tokens: number;
  output_tokens: number;
  cost_estimate_usd: number;
}

export interface GenerateResponse {
  platform: Platform;
  content: string;
  usage: UsageInfo;
  model_used: string;
  sensitive_matches?: SensitiveMatch[];
  original_text?: string;
}

export interface SensitiveMatch {
  term: string;
  count: number;
}

export interface HealthResponse {
  status: string;
  version: string;
}

export type GenerationStatus = 'idle' | 'generating' | 'done' | 'error';

export interface AppContextType {
  provider: Provider;
  claudeApiKey: string;
  openaiApiKey: string;
  deepseekApiKey: string;
  selectedModel: string | null;
  setProvider: (p: Provider) => void;
  setApiKey: (provider: Provider, key: string) => void;
  setModel: (model: string | null) => void;
  getActiveApiKey: () => string;
}
