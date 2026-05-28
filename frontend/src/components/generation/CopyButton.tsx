import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { useClipboard } from '../../hooks/useClipboard';
import { useToast } from '../ui/useToast';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const { copy } = useClipboard();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await copy(text);
      setCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'Content is ready to paste',
        variant: 'success',
      });

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please manually select and copy the text',
        variant: 'error',
      });
    }
  }, [copy, text, toast]);

  return (
    <Button
      variant={copied ? 'outline' : 'outline'}
      size="sm"
      onClick={handleCopy}
      className={
        copied
          ? 'border-[var(--color-success)] text-[var(--color-success)] bg-[var(--color-success-light)]'
          : ''
      }
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy
        </>
      )}
    </Button>
  );
}
