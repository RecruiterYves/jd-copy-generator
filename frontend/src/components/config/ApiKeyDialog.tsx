import { useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Dialog } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ProviderSelector } from './ProviderSelector';
import { ModelSelector } from './ModelSelector';
import { useAppContext } from '../../contexts/AppContext';
import { useToast } from '../ui/toast';
import { healthCheck } from '../../services/api';
import type { Provider } from '../../types';

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ApiKeyDialog({ open, onOpenChange }: ApiKeyDialogProps) {
  const {
    provider,
    claudeApiKey,
    openaiApiKey,
    deepseekApiKey,
    selectedModel,
    setProvider,
    setApiKey,
    setModel,
  } = useAppContext();

  const { toast } = useToast();

  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);

  const currentApiKey =
    provider === 'claude'
      ? claudeApiKey
      : provider === 'openai'
        ? openaiApiKey
        : deepseekApiKey;

  const [localKey, setLocalKey] = useState(currentApiKey);

  const handleProviderChange = useCallback(
    (p: Provider) => {
      setProvider(p);
      const storedKey =
        p === 'claude'
          ? claudeApiKey
          : p === 'openai'
            ? openaiApiKey
            : deepseekApiKey;
      setLocalKey(storedKey);
    },
    [setProvider, claudeApiKey, openaiApiKey, deepseekApiKey],
  );

  const handleSave = useCallback(() => {
    setApiKey(provider, localKey.trim());
    toast({
      title: 'Settings saved',
      description: 'API key has been saved to local storage',
      variant: 'success',
    });
    onOpenChange(false);
  }, [provider, localKey, setApiKey, toast, onOpenChange]);

  const handleTestConnection = useCallback(async () => {
    const key = localKey.trim();
    if (!key) {
      toast({
        title: 'Enter API key first',
        description: 'API key cannot be empty',
        variant: 'error',
      });
      return;
    }

    setTesting(true);
    try {
      const health = await healthCheck();
      toast({
        title: 'Connection OK',
        description: `Backend: ${health.status} (v${health.version})`,
        variant: 'success',
      });
    } catch (err) {
      let message = 'Connection failed';
      if (err instanceof Error) {
        message = err.message || String(err);
      } else if (err && typeof err === 'object') {
        message = JSON.stringify(err);
      } else if (err) {
        message = String(err);
      }
      toast({
        title: 'Connection failed',
        description: message,
        variant: 'error',
      });
    } finally {
      setTesting(false);
    }
  }, [localKey, toast]);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        setLocalKey(currentApiKey);
        setShowKey(false);
      }
      onOpenChange(isOpen);
    },
    [onOpenChange, currentApiKey],
  );

  const providerLabel =
    provider === 'claude' ? 'Claude' : provider === 'openai' ? 'OpenAI' : 'DeepSeek';

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="API Settings"
      description="Configure your AI provider and API key. Your key is stored only in your browser."
    >
      <div className="space-y-5">
        {/* Provider selection */}
        <ProviderSelector
          selected={provider}
          onSelect={handleProviderChange}
        />

        {/* API Key input */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">
            {providerLabel} API Key
          </label>
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              value={localKey}
              onChange={(e) => setLocalKey(e.target.value)}
              placeholder={`Enter your ${providerLabel} API Key...`}
              className="pr-10"
              aria-label="API Key"
            />
            <button
              type="button"
              onClick={() => setShowKey((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              aria-label={showKey ? 'Hide key' : 'Show key'}
              tabIndex={-1}
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Model selection */}
        <ModelSelector
          provider={provider}
          selected={selectedModel}
          onSelect={setModel}
        />

        {/* Privacy note */}
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
          Your key is stored locally in your browser (localStorage) and is never
          persisted on any server. It is sent to the backend only with each
          generation request.
        </p>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            onClick={handleTestConnection}
            disabled={testing}
            size="sm"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={localKey.trim().length === 0}
            size="sm"
            className="flex-1"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
