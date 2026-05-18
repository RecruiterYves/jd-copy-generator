import { useState, useEffect, useCallback } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { ToastProvider, useToast } from './components/ui/toast';
import { Layout } from './components/layout/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Card, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { PlatformTabs } from './components/platform/PlatformTabs';
import { PlatformGuide } from './components/platform/PlatformGuide';
import { FileDropzone } from './components/upload/FileDropzone';
import { TextPaste } from './components/upload/TextPaste';
import { UploadPreview } from './components/upload/UploadPreview';
import { BatchUploadList } from './components/upload/BatchUploadList';
import { ApiKeyDialog } from './components/config/ApiKeyDialog';
import { GenerateButton } from './components/generation/GenerateButton';
import { GenerationResult } from './components/generation/GenerationResult';
import { CopyButton } from './components/generation/CopyButton';
import { LoadingSkeleton } from './components/generation/LoadingSkeleton';
import { useFileUpload } from './hooks/useFileUpload';
import { useGenerate } from './hooks/useGenerate';
import { healthCheck } from './services/api';
import { PROVIDER_LABELS } from './lib/constants';
import { AlertCircle, Upload, FileText } from 'lucide-react';
import type { Platform } from './types';

function HomePage() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('tg');
  const [inputTab, setInputTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');

  const fileUpload = useFileUpload();
  const generate = useGenerate();
  const { toast } = useToast();
  const { getActiveApiKey, provider, selectedModel } = useAppContext();

  const hasApiKey = getActiveApiKey().length > 0;
  const isMultiple = selectedPlatform === 'tg';

  // Determine if there is content ready for generation
  const hasFileContent =
    inputTab === 'upload' &&
    fileUpload.status === 'done' &&
    fileUpload.parsedResults.length > 0;
  const hasPastedContent =
    inputTab === 'paste' && pastedText.trim().length > 0;
  const hasContent = hasFileContent || hasPastedContent;

  // Show the sticky bottom bar when there is content or a result
  const showBottomBar =
    (hasContent && generate.status === 'idle') ||
    generate.status === 'done';

  // Handle platform change
  const handlePlatformChange = useCallback(
    (p: Platform) => {
      setSelectedPlatform(p);
      generate.reset();
    },
    [generate],
  );

  // Handle file selection
  const handleFilesSelected = useCallback(
    (files: File[]) => {
      generate.reset();
      fileUpload.upload(files);
    },
    [fileUpload, generate],
  );

  // Handle pasted text change
  const handleTextChange = useCallback(
    (text: string) => {
      setPastedText(text);
      generate.reset();
    },
    [generate],
  );

  // Handle clear uploaded files
  const handleClearFiles = useCallback(() => {
    fileUpload.reset();
    generate.reset();
  }, [fileUpload, generate]);

  // Handle remove single document from batch
  const handleRemoveDocument = useCallback(
    (index: number) => {
      const newFiles = fileUpload.files.filter(
        (_: unknown, i: number) => i !== index,
      );
      if (newFiles.length === 0) {
        fileUpload.reset();
        generate.reset();
      } else {
        fileUpload.reset();
        generate.reset();
        fileUpload.upload(newFiles);
      }
    },
    [fileUpload, generate],
  );

  // Handle generate
  const handleGenerate = useCallback(async () => {
    let texts: string[];

    if (inputTab === 'upload') {
      texts = fileUpload.parsedResults.map((d) => d.text);
    } else {
      if (selectedPlatform === 'tg') {
        texts = pastedText
          .split('---')
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
        if (texts.length === 0) {
          texts = [pastedText.trim()];
        }
      } else {
        texts = [pastedText.trim()];
      }
    }

    if (texts.length === 0 || texts.every((t) => !t.trim())) {
      toast({
        title: 'No content',
        description: 'Please upload files or paste JD text first',
        variant: 'error',
      });
      return;
    }

    if (!hasApiKey) {
      toast({
        title: 'API Key required',
        description: 'Please configure your API key in Settings',
        variant: 'error',
      });
      return;
    }

    await generate.generate({
      platform: selectedPlatform,
      texts,
      provider,
      api_key: getActiveApiKey(),
      model: selectedModel ?? undefined,
    });
  }, [
    inputTab,
    fileUpload.parsedResults,
    pastedText,
    selectedPlatform,
    provider,
    selectedModel,
    getActiveApiKey,
    hasApiKey,
    generate,
    toast,
  ]);

  // Show upload error toast
  useEffect(() => {
    if (fileUpload.status === 'error' && fileUpload.error) {
      toast({
        title: 'Upload failed',
        description: fileUpload.error,
        variant: 'error',
      });
    }
  }, [fileUpload.status, fileUpload.error, toast]);

  // Show generation error toast
  useEffect(() => {
    if (generate.status === 'error' && generate.error) {
      toast({
        title: 'Generation failed',
        description: generate.error,
        variant: 'error',
      });
    }
  }, [generate.status, generate.error, toast]);

  return (
    <div className="space-y-6">
      {/* Platform selector */}
      <PlatformTabs
        selected={selectedPlatform}
        onSelect={handlePlatformChange}
      />

      {/* Platform guide */}
      <PlatformGuide platform={selectedPlatform} />

      {/* Input method tabs */}
      <Card>
        <CardContent className="py-3">
          <Tabs
            value={inputTab}
            onValueChange={(v) => setInputTab(v as 'upload' | 'paste')}
          >
            <TabsList>
              <TabsTrigger value="upload">
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="paste">
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Paste
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <FileDropzone
                onFilesSelected={handleFilesSelected}
                disabled={fileUpload.status === 'uploading'}
                multiple={isMultiple}
              />

              {selectedPlatform === 'tg' && (
                <p className="mt-3 text-xs text-[var(--color-text-muted)]">
                  Telegram mode supports batch upload of multiple JD files. Or switch to
                  Paste tab and use &quot;---&quot; to separate multiple JDs.
                </p>
              )}
            </TabsContent>

            <TabsContent value="paste">
              <TextPaste
                value={pastedText}
                onTextChange={handleTextChange}
                disabled={generate.status === 'generating'}
              />

              {selectedPlatform === 'tg' && (
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  Use three dashes &quot;---&quot; to separate multiple JDs.
                  Each JD will be treated as a separate role.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upload in progress */}
      {fileUpload.status === 'uploading' && (
        <Card>
          <CardContent className="py-8 flex items-center justify-center gap-3">
            <div className="h-5 w-5 border-2 border-[var(--color-brand)] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[var(--color-text-medium)]">Parsing files...</p>
          </CardContent>
        </Card>
      )}

      {/* File upload preview */}
      {inputTab === 'upload' &&
        fileUpload.status === 'done' &&
        fileUpload.parsedResults.length > 0 && (
          <UploadPreview
            documents={fileUpload.parsedResults}
            onClear={handleClearFiles}
          />
        )}

      {/* Batch upload list (TG mode) */}
      {selectedPlatform === 'tg' &&
        inputTab === 'upload' &&
        fileUpload.status === 'done' &&
        fileUpload.parsedResults.length > 0 && (
          <BatchUploadList
            documents={fileUpload.parsedResults}
            onRemove={handleRemoveDocument}
          />
        )}

      {/* Paste preview */}
      {inputTab === 'paste' && pastedText.trim().length > 0 && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center gap-2 text-sm text-[var(--color-text-medium)]">
              <FileText className="h-4 w-4" style={{ color: 'var(--color-brand)' }} />
              <span>Pasted text</span>
              <Badge variant="info">
                {pastedText.length.toLocaleString()} characters
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API key warning */}
      {!hasApiKey && hasContent && generate.status === 'idle' && (
        <div className="flex items-center gap-2 text-sm text-[var(--color-warning)] bg-[var(--color-warning-light)] border border-[var(--color-warning)]/20 rounded-xl px-4 py-2.5">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Please configure your API Key in Settings before generating
        </div>
      )}

      {/* Generating: show skeleton */}
      {generate.status === 'generating' && <LoadingSkeleton />}

      {/* Done: show result */}
      {generate.status === 'done' && generate.result && (
        <div className="animate-slide-up">
          <GenerationResult result={generate.result} />
        </div>
      )}

      {/* Error state */}
      {generate.status === 'error' && (
        <Card className="border-[var(--color-destructive)]/30 bg-[var(--color-destructive-light)]">
          <CardContent className="py-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[var(--color-destructive)] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-[var(--color-destructive)]">
                  Generation failed
                </p>
                <p className="mt-1 text-sm opacity-80">
                  {generate.error || 'Unknown error. Please try again.'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => generate.reset()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spacer for sticky bottom bar */}
      {showBottomBar && <div className="h-20" />}

      {/* Sticky Bottom Action Bar */}
      {showBottomBar && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[800px] px-5 z-30"
        >
          <div
            className="glass rounded-[20px] p-4 flex items-center gap-3"
            style={{ boxShadow: '0 10px 40px -10px rgba(37, 99, 235, 0.08)' }}
          >
            {generate.status === 'idle' && hasContent && (
              <GenerateButton
                onClick={handleGenerate}
                loading={false}
                disabled={!hasContent || !hasApiKey}
              />
            )}

            {generate.status === 'done' && generate.result && (
              <div className="flex items-center gap-3 w-full">
                <GenerateButton
                  onClick={handleGenerate}
                  loading={false}
                  disabled={!hasContent || !hasApiKey}
                />
                <CopyButton text={generate.result.content} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => generate.reset()}
                  className="ml-auto shrink-0"
                >
                  New
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Idle empty state hint */}
      {!hasContent && generate.status === 'idle' && (
        <p className="text-center text-xs text-[var(--color-text-muted)] pt-2">
          Upload files or paste JD text to get started
        </p>
      )}
    </div>
  );
}

function AppInner() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { getActiveApiKey, provider } = useAppContext();

  const hasApiKey = getActiveApiKey().length > 0;
  const providerLabel = PROVIDER_LABELS[provider];

  useEffect(() => {
    healthCheck()
      .then((res) => {
        console.log(
          '[Health] Backend status:',
          res.status,
          'version:',
          res.version,
        );
      })
      .catch((err) => {
        console.warn('[Health] Backend unreachable:', err.message);
      });
  }, []);

  return (
    <Layout
      onOpenSettings={() => setSettingsOpen(true)}
      hasApiKey={hasApiKey}
      providerLabel={providerLabel}
    >
      <HomePage />

      <ApiKeyDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
