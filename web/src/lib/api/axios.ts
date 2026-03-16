import axios, { AxiosError, AxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v2";

/**
  * Axios instance with base URL and credentials enabled.
  * withCredentials: true is crucial for sending cookies (accessToken, refreshToken) with each request.
  * This allows the server to read tokens from cookies for authentication/authorization.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // important for cookies
  timeout: 10000, // 10 seconds
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(null);
  });
  failedQueue = [];
};

/**
 * RESPONSE INTERCEPTOR
 * If access token expired → call refresh endpoint → retry request
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(apiClient(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
console.log("Refreshing...");
        processQueue();
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


/**
 * Helper to get error message (AxiosError based)
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as
      | { message?: string | string[]; error?: string }
      | undefined;

    const msg = data?.message;

    if (Array.isArray(msg)) return msg[0] ?? "Something went wrong";

    return msg || data?.error || error.message || "Something went wrong";
  }

  if (error instanceof Error) return error.message || "Something went wrong";

  return "An unexpected error occurred";
};
