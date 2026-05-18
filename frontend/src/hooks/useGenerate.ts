import { useState, useCallback } from 'react';
import type { GenerationStatus, GenerateResponse } from '../types';
import { generateCopy as apiGenerateCopy } from '../services/api';
import type { GenerateRequest } from '../types';

export interface UseGenerateState {
  status: GenerationStatus;
  result: GenerateResponse | null;
  error: string | null;
}

export interface UseGenerateReturn extends UseGenerateState {
  generate: (params: GenerateRequest) => Promise<void>;
  reset: () => void;
}

const initialState: UseGenerateState = {
  status: 'idle',
  result: null,
  error: null,
};

export function useGenerate(): UseGenerateReturn {
  const [state, setState] = useState<UseGenerateState>(initialState);

  const generate = useCallback(async (params: GenerateRequest) => {
    setState({
      status: 'generating',
      result: null,
      error: null,
    });

    try {
      const response = await apiGenerateCopy(params);
      setState({
        status: 'done',
        result: response,
        error: null,
      });
    } catch (err) {
      let message = 'Generation failed';
      if (err instanceof Error) {
        message = err.message || String(err);
      } else if (err && typeof err === 'object') {
        message = JSON.stringify(err);
      } else if (err) {
        message = String(err);
      }
      setState({
        status: 'error',
        result: null,
        error: message,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    generate,
    reset,
  };
}
