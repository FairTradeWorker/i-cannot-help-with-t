/**
 * API Client
 * 
 * This module provides a typed HTTP client for making API requests.
 * Includes error handling, retries, rate limiting, and request/response logging.
 */

import { 
  ApiResponse, 
  ApiError, 
  ApiRequestOptions, 
  API_ERROR_CODES,
  HTTP_STATUS,
} from './types';

// ============================================================================
// Configuration
// ============================================================================

const DEFAULT_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
};

/**
 * API Client configuration
 */
interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  authToken?: string | (() => string | null);
  onUnauthorized?: () => void;
  onError?: (error: ApiError) => void;
}

let clientConfig: ApiClientConfig = { ...DEFAULT_CONFIG };

/**
 * Configure the API client
 */
export function configureApiClient(config: Partial<ApiClientConfig>): void {
  clientConfig = { ...clientConfig, ...config };
}

/**
 * Get the current auth token
 */
function getAuthToken(): string | null {
  const { authToken } = clientConfig;
  if (typeof authToken === 'function') {
    return authToken();
  }
  return authToken || null;
}

// ============================================================================
// Request Helpers
// ============================================================================

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(endpoint, clientConfig.baseUrl || window.location.origin);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

/**
 * Create request headers
 */
function createHeaders(customHeaders?: Record<string, string>): Headers {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...customHeaders,
  });
  
  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  return headers;
}

/**
 * Parse API error from response
 */
async function parseError(response: Response): Promise<ApiError> {
  try {
    const data = await response.json();
    return {
      code: data.error?.code || API_ERROR_CODES.INTERNAL_ERROR,
      message: data.error?.message || response.statusText,
      details: data.error?.details,
    };
  } catch {
    return {
      code: API_ERROR_CODES.INTERNAL_ERROR,
      message: response.statusText || 'Unknown error',
    };
  }
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if error is retryable
 */
function isRetryable(status: number): boolean {
  return [
    HTTP_STATUS.TOO_MANY_REQUESTS,
    HTTP_STATUS.SERVICE_UNAVAILABLE,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
  ].some(s => s === status);
}

// ============================================================================
// Main API Client
// ============================================================================

/**
 * Make an API request
 */
async function request<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = 'GET',
    headers: customHeaders,
    body,
    params,
    timeout = clientConfig.timeout,
    retries = clientConfig.retries,
  } = options;

  const url = buildUrl(endpoint, params);
  const headers = createHeaders(customHeaders);
  
  let lastError: ApiError | null = null;
  let attempt = 0;

  while (attempt <= (retries || 0)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle unauthorized responses
      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        clientConfig.onUnauthorized?.();
        const error = await parseError(response);
        return { success: false, error };
      }

      // Handle error responses
      if (!response.ok) {
        lastError = await parseError(response);
        
        if (isRetryable(response.status) && attempt < (retries || 0)) {
          attempt++;
          await sleep(clientConfig.retryDelay! * attempt);
          continue;
        }
        
        clientConfig.onError?.(lastError);
        return { success: false, error: lastError };
      }

      // Parse successful response
      const data = response.status === HTTP_STATUS.NO_CONTENT 
        ? undefined 
        : await response.json();

      return {
        success: true,
        data: data?.data ?? data,
        meta: data?.meta,
      };

    } catch (err) {
      lastError = {
        code: err instanceof Error && err.name === 'AbortError' 
          ? API_ERROR_CODES.TIMEOUT 
          : API_ERROR_CODES.INTERNAL_ERROR,
        message: err instanceof Error ? err.message : 'Network error',
      };

      if (attempt < (retries || 0)) {
        attempt++;
        await sleep(clientConfig.retryDelay! * attempt);
        continue;
      }

      clientConfig.onError?.(lastError);
      return { success: false, error: lastError };
    }
  }

  return { success: false, error: lastError! };
}

// ============================================================================
// HTTP Method Helpers
// ============================================================================

/**
 * GET request
 */
export async function get<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
  options?: Omit<ApiRequestOptions, 'method' | 'params' | 'body'>
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { ...options, method: 'GET', params });
}

/**
 * POST request
 */
export async function post<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { ...options, method: 'POST', body });
}

/**
 * PUT request
 */
export async function put<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { ...options, method: 'PUT', body });
}

/**
 * PATCH request
 */
export async function patch<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { ...options, method: 'PATCH', body });
}

/**
 * DELETE request
 */
export async function del<T>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { ...options, method: 'DELETE' });
}

// ============================================================================
// API Client Instance
// ============================================================================

/**
 * API Client class for more structured usage
 */
export class ApiClient {
  private config: ApiClientConfig;

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  setAuthToken(token: string | null): void {
    this.config.authToken = token || undefined;
    configureApiClient({ authToken: token || undefined });
  }

  get = get;
  post = post;
  put = put;
  patch = patch;
  delete = del;
}

// Export default client instance
export const apiClient = new ApiClient();

export default apiClient;
