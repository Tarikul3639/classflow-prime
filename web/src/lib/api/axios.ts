import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v2';

/**
 * Axios instance with interceptors
 * - Automatically adds Authorization header
 * - Handles token refresh on 401 (only if you implement it)
 * - Global error handling
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * Request interceptor: attach access token if available
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Helper to get error message (AxiosError based)
 */
export const getErrorMessage = (error: unknown): string => {
  // explicitly use AxiosError
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string; error?: string } | undefined;

    return (
      data?.message ||
      data?.error ||
      error.message ||
      'Something went wrong'
    );
  }

  // fallback (non-axios errors)
  if (error instanceof Error) return error.message || 'Something went wrong';

  return 'An unexpected error occurred';
};