import { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { cn, formatFileSize } from '../../lib/utils';
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE_MB } from '../../lib/constants';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  multiple?: boolean;
}

const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024;

export function FileDropzone({
  onFilesSelected,
  disabled = false,
  multiple = true,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length > 0) {
        onFilesSelected(accepted);
      }
    },
    [onFilesSelected],
  );

  const acceptMap = useMemo(
    () => ({
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    }),
    [],
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop,
    accept: acceptMap,
    maxSize: maxBytes,
    multiple,
    disabled,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          'relative flex flex-col items-center justify-center h-[300px] rounded-[16px] border-2 border-dashed px-6 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2',
          disabled && 'pointer-events-none opacity-50 cursor-not-allowed',
          isDragReject
            ? 'border-[var(--color-destructive)] bg-[var(--color-destructive-light)]'
            : isDragActive
              ? 'border-solid border-[var(--color-border-active)] bg-white shadow-[var(--shadow-glow)]'
              : 'border-[var(--color-border-dashed)] bg-white hover:border-[var(--color-border-active)] hover:shadow-[var(--shadow-glow)]',
        )}
        role="button"
        tabIndex={0}
        aria-label="File upload dropzone"
      >
        <input {...getInputProps()} aria-label="File input" />

        {isDragActive ? (
          <Upload
            className="h-12 w-12 mb-4"
            style={{ color: 'var(--color-brand)' }}
          />
        ) : (
          <Upload
            className="h-12 w-12 mb-4"
            style={{ color: 'var(--color-text-medium)' }}
          />
        )}

        <p
          className="text-sm font-medium"
          style={{ color: isDragActive ? 'var(--color-brand)' : 'var(--color-text-medium)' }}
        >
          {isDragActive
            ? 'Drop files to upload'
            : 'Drag files here or click to browse'}
        </p>
        <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
          PDF, DOCX, TXT &middot; Max {MAX_FILE_SIZE_MB}MB per file
        </p>
        {!multiple && (
          <p className="mt-1 text-xs" style={{ color: 'var(--color-warning)' }}>
            Single file upload only
          </p>
        )}
      </div>

      {/* File rejection warnings */}
      {fileRejections.length > 0 && (
        <div className="rounded-xl border border-[var(--color-destructive)]/30 bg-[var(--color-destructive-light)] px-4 py-3">
          {fileRejections.map(({ file, errors }, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-start gap-2 text-sm text-[var(--color-destructive)]"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">{file.name}</p>
                {errors.map((err) => (
                  <p key={err.code} className="opacity-80">
                    {err.code === 'file-too-large'
                      ? `File too large (${formatFileSize(file.size)}, limit ${MAX_FILE_SIZE_MB}MB)`
                      : err.code === 'file-invalid-type'
                        ? `Unsupported type (allowed: ${ACCEPTED_FILE_TYPES.join(', ')})`
                        : err.message}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state hint */}
      {!isDragActive && fileRejections.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] justify-center">
          <FileText className="h-3.5 w-3.5" />
          <span>PDF, DOCX, TXT formats supported</span>
        </div>
      )}
    </div>
  );
}
