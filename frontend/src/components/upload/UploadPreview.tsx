import type { ParsedDocument } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FileText, X } from 'lucide-react';

interface UploadPreviewProps {
  documents: ParsedDocument[];
  onClear: () => void;
}

function previewText(text: string, maxLen = 200): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + '...';
}

export function UploadPreview({ documents, onClear }: UploadPreviewProps) {
  if (documents.length === 0) {
    return null;
  }

  const totalChars = documents.reduce((sum, d) => sum + d.char_count, 0);

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" style={{ color: 'var(--color-brand)' }} />
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              {documents.length} document{documents.length > 1 ? 's' : ''} parsed
            </h3>
            <Badge variant="info">{totalChars.toLocaleString()} chars</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            aria-label="Clear all documents"
          >
            <X className="h-4 w-4" />
            <span className="ml-1">Clear</span>
          </Button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {documents.map((doc, idx) => (
            <div
              key={`${doc.filename}-${idx}`}
              className="rounded-xl border border-[var(--color-border-light)] bg-[var(--color-page)] p-3.5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-[var(--color-text-muted)]">
                  #{idx + 1}
                </span>
                <Badge variant="default" className="font-mono text-xs">
                  {doc.filename}
                </Badge>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {doc.char_count.toLocaleString()} chars
                </span>
              </div>
              <pre className="text-xs text-[var(--color-text-medium)] whitespace-pre-wrap font-sans leading-relaxed">
                {previewText(doc.text)}
              </pre>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
