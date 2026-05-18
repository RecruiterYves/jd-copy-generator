import type { ParsedDocument } from '../../types';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FileText, X } from 'lucide-react';

interface BatchUploadListProps {
  documents: ParsedDocument[];
  onRemove: (index: number) => void;
}

export function BatchUploadList({ documents, onRemove }: BatchUploadListProps) {
  if (documents.length === 0) {
    return null;
  }

  const totalChars = documents.reduce((sum, d) => sum + d.char_count, 0);

  return (
    <Card>
      <CardContent className="py-4">
        {/* Summary header */}
        <div className="flex items-center gap-2 mb-4 text-sm text-[var(--color-text-medium)]">
          <FileText className="h-4 w-4" style={{ color: 'var(--color-brand)' }} />
          <span className="font-medium text-[var(--color-text)]">
            {documents.length} JD{documents.length > 1 ? 's' : ''}
          </span>
          <span className="text-[var(--color-text-muted)]">
            &middot; {totalChars.toLocaleString()} total characters
          </span>
        </div>

        {/* Document list */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {documents.map((doc, idx) => (
            <div
              key={`${doc.filename}-${idx}`}
              className="flex items-center justify-between rounded-xl border border-[var(--color-border-light)] bg-[var(--color-page)] px-3.5 py-3"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-xs font-mono text-[var(--color-text-muted)] shrink-0">
                  #{idx + 1}
                </span>
                <span className="text-sm font-mono text-[var(--color-text)] truncate">
                  {doc.filename}
                </span>
                <Badge variant="default" className="shrink-0">
                  {doc.char_count.toLocaleString()} chars
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(idx)}
                aria-label={`Remove ${doc.filename}`}
                className="ml-2 shrink-0 text-[var(--color-text-muted)] hover:text-[var(--color-destructive)]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
