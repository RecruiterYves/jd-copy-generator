import { useState, useCallback } from 'react';
import type { ParsedDocument } from '../types';
import { uploadFiles as apiUploadFiles } from '../services/api';

export type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

export interface UseFileUploadState {
  files: File[];
  parsedResults: ParsedDocument[];
  totalChars: number;
  status: UploadStatus;
  error: string | null;
}

export interface UseFileUploadReturn extends UseFileUploadState {
  upload: (files: File[]) => Promise<void>;
  reset: () => void;
}

const initialState: UseFileUploadState = {
  files: [],
  parsedResults: [],
  totalChars: 0,
  status: 'idle',
  error: null,
};

export function useFileUpload(): UseFileUploadReturn {
  const [state, setState] = useState<UseFileUploadState>(initialState);

  const upload = useCallback(async (files: File[]) => {
    setState((prev) => ({
      ...prev,
      files,
      status: 'uploading',
      error: null,
    }));

    try {
      const response = await apiUploadFiles(files);
      setState({
        files,
        parsedResults: response.results,
        totalChars: response.total_chars,
        status: 'done',
        error: null,
      });
    } catch (err) {
      let message = 'Upload failed';
      if (err instanceof Error) {
        message = err.message || String(err);
      } else if (err && typeof err === 'object') {
        message = JSON.stringify(err);
      } else if (err) {
        message = String(err);
      }
      setState((prev) => ({
        ...prev,
        status: 'error',
        error: message,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    upload,
    reset,
  };
}
