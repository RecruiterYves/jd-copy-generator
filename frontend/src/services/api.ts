import type {
  UploadResponse,
  GenerateRequest,
  GenerateResponse,
  HealthResponse,
} from '../types';

const API_BASE = '/api';

export class ApiError extends Error {
  status: number;
  detail: string;
  error_code?: string;

  constructor(status: number, detail: string, error_code?: string) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
    this.error_code = error_code;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = response.statusText;
    let error_code: string | undefined;
    try {
      const body = await response.json();
      error_code = body.error_code;
      if (body.detail) {
        if (Array.isArray(body.detail)) {
          detail = body.detail.map((e: { msg?: string; loc?: string[] }) =>
            e.loc ? `${e.loc.join('.')}: ${e.msg}` : e.msg
          ).join('; ');
        } else if (typeof body.detail === 'object') {
          detail = JSON.stringify(body.detail);
        } else {
          detail = String(body.detail);
        }
      }
    } catch {
      // ignore parse errors, use status text
    }
    throw new ApiError(response.status, detail, error_code);
  }
  return response.json() as Promise<T>;
}

export async function uploadFiles(files: File[]): Promise<UploadResponse> {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<UploadResponse>(response);
}

export async function generateCopy(
  params: GenerateRequest
): Promise<GenerateResponse> {
  const response = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  return handleResponse<GenerateResponse>(response);
}

export async function healthCheck(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE}/health`);
  return handleResponse<HealthResponse>(response);
}
