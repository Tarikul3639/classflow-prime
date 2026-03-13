import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenManager } from './token-manager';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v2';

/**
 * Axios instance with interceptors
 * - Automatically adds Authorization header
 * - Handles token refresh on 401
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
 * Request Interceptor
 * Adds Authorization header to every request
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles 401 errors and token refresh
 */
// let isRefreshing = false;
// let failedQueue: Array<{
//   resolve: (value?: unknown) => void;
//   reject: (reason?: unknown) => void;
// }> = [];

// const processQueue = (
//   error: AxiosError | null,
//   token: string | null = null
// ) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     // If error is 401 and we haven't retried yet
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         // If already refreshing, queue this request
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return apiClient(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       const refreshToken = tokenManager.getRefreshToken();

//       if (!refreshToken) {
//         // No refresh token - clear tokens and reject
//         tokenManager.clearTokens();
        
//         // ❌ DON'T use window.location.href (causes page refresh)
//         // ✅ Let Redux handle navigation via error state
        
//         isRefreshing = false;
//         return Promise.reject(new Error('Authentication required'));
//       }

//       try {
//         // Call refresh endpoint
//         const response = await axios.post(
//           `${API_BASE_URL}/auth/refresh`,
//           { refreshToken },
//           {
//             headers: { 'Content-Type': 'application/json' },
//           }
//         );

//         const { accessToken, refreshToken: newRefreshToken } =
//           response.data.tokens;

//         // Save new tokens
//         tokenManager.setTokens(accessToken, newRefreshToken);

//         // Update header
//         originalRequest.headers.Authorization = `Bearer ${accessToken}`;

//         // Process queued requests
//         processQueue(null, accessToken);

//         // Retry original request
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         // Refresh failed, clear tokens
//         processQueue(refreshError as AxiosError, null);
//         tokenManager.clearTokens();
        
//         // ❌ DON'T redirect here
//         // ✅ Let Redux/component handle it
        
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

/**
 * Helper to get error message
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message || error.message || 'Something went wrong'
    );
  }
  return 'An unexpected error occurred';
};