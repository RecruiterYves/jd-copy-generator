import { useState, useCallback, type ReactNode } from 'react';
import type { Provider } from '../types';
import { AppContext } from './appContextValue';

const STORAGE_KEY_PROVIDER = 'jd-gen-provider';
const STORAGE_KEY_CLAUDE_KEY = 'jd-gen-claude-key';
const STORAGE_KEY_OPENAI_KEY = 'jd-gen-openai-key';
const STORAGE_KEY_DEEPSEEK_KEY = 'jd-gen-deepseek-key';
const STORAGE_KEY_MODEL = 'jd-gen-model';

function getStoredProvider(): Provider {
  const stored = localStorage.getItem(STORAGE_KEY_PROVIDER);
  if (stored === 'claude' || stored === 'openai' || stored === 'deepseek') return stored;
  return 'claude';
}

function getStoredKey(provider: Provider): string {
  const key =
    provider === 'claude'
      ? STORAGE_KEY_CLAUDE_KEY
      : provider === 'openai'
        ? STORAGE_KEY_OPENAI_KEY
        : STORAGE_KEY_DEEPSEEK_KEY;
  return localStorage.getItem(key) || '';
}

function getStoredModel(): string | null {
  return localStorage.getItem(STORAGE_KEY_MODEL);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [provider, setProviderState] = useState<Provider>(getStoredProvider);
  const [claudeApiKey, setClaudeApiKeyState] = useState<string>(() => getStoredKey('claude'));
  const [openaiApiKey, setOpenaiApiKeyState] = useState<string>(() => getStoredKey('openai'));
  const [deepseekApiKey, setDeepseekApiKeyState] = useState<string>(() => getStoredKey('deepseek'));
  const [selectedModel, setModelState] = useState<string | null>(getStoredModel);

  const setProvider = useCallback((p: Provider) => {
    setProviderState(p);
    localStorage.setItem(STORAGE_KEY_PROVIDER, p);
  }, []);

  const setApiKey = useCallback((p: Provider, key: string) => {
    if (p === 'claude') {
      setClaudeApiKeyState(key);
      localStorage.setItem(STORAGE_KEY_CLAUDE_KEY, key);
    } else if (p === 'openai') {
      setOpenaiApiKeyState(key);
      localStorage.setItem(STORAGE_KEY_OPENAI_KEY, key);
    } else {
      setDeepseekApiKeyState(key);
      localStorage.setItem(STORAGE_KEY_DEEPSEEK_KEY, key);
    }
  }, []);

  const setModel = useCallback((model: string | null) => {
    setModelState(model);
    if (model) {
      localStorage.setItem(STORAGE_KEY_MODEL, model);
    } else {
      localStorage.removeItem(STORAGE_KEY_MODEL);
    }
  }, []);

  const getActiveApiKey = useCallback((): string => {
    if (provider === 'claude') return claudeApiKey;
    if (provider === 'openai') return openaiApiKey;
    return deepseekApiKey;
  }, [provider, claudeApiKey, openaiApiKey, deepseekApiKey]);

  return (
    <AppContext.Provider
      value={{
        provider,
        claudeApiKey,
        openaiApiKey,
        deepseekApiKey,
        selectedModel,
        setProvider,
        setApiKey,
        setModel,
        getActiveApiKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
