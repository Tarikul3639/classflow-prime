/**
 * Backend API error response structure
 */
interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

/**
 * Axios-like error structure
 */
interface HttpError {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
    statusText?: string;
  };
  request?: unknown;
  message?: string;
  code?: string;
  config?: unknown;
}

/**
 * Type guard to check if error is HTTP error
 */
const isHttpError = (error: unknown): error is HttpError => {
  return (
    typeof error === "object" &&
    error !== null &&
    ("response" in error || "request" in error || "config" in error)
  );
};

/**
 * Extract user-friendly error message
 */
export const extractErrorMessage = (
  error: unknown,
  fallback = "An error occurred",
): string => {
  // Handle HTTP errors (Axios)
  if (isHttpError(error)) {
    const backendMessage = error.response?.data?.message;

    // Handle validation errors array
    if (Array.isArray(backendMessage)) {
      return backendMessage[0]; // Return first error
    }

    // Handle single string message
    if (typeof backendMessage === "string" && backendMessage) {
      return backendMessage;
    }

    // Handle HTTP status codes
    const status = error.response?.status;
    switch (status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Invalid email or password.";
      case 403:
        return "Access denied.";
      case 404:
        return "Resource not found.";
      case 409:
        return "Email already exists.";
      case 422:
        return "Validation failed. Please check your input.";
      case 429:
        return "Too many requests. Please try again later.";
      case 500:
        return "Server error. Please try again later.";
      case 502:
        return "Server is temporarily unavailable.";
      case 503:
        return "Service unavailable. Please try again later.";
    }

    // Handle network errors
    if (error.code === "ERR_NETWORK") {
      return "Network error. Please check your internet connection.";
    }

    if (error.code === "ECONNABORTED" || error.code === "ERR_CANCELED") {
      return "Request timeout. Please try again.";
    }

    // Fallback to error message
    if (error.message) {
      return error.message;
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Final fallback
  return fallback;
};

/**
 * Extract all validation errors (for forms)
 */
export const extractValidationErrors = (error: unknown): string[] => {
  if (isHttpError(error)) {
    const backendMessage = error.response?.data?.message;

    if (Array.isArray(backendMessage)) {
      return backendMessage;
    }

    if (typeof backendMessage === "string") {
      return [backendMessage];
    }
  }

  return [extractErrorMessage(error)];
};

/**
 * Check if error is authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (isHttpError(error)) {
    const status = error.response?.status;
    return status === 401 || status === 403;
  }
  return false;
};

/**
 * Check if error is validation error
 */
export const isValidationError = (error: unknown): boolean => {
  if (isHttpError(error)) {
    const status = error.response?.status;
    return status === 400 || status === 422;
  }
  return false;
};

/**
 * Check if error is network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (isHttpError(error)) {
    return (
      error.code === "ERR_NETWORK" ||
      error.code === "ECONNABORTED" ||
      !error.response
    );
  }
  return false;
};

/**
 * Get HTTP status code from error
 */
export const getErrorStatusCode = (error: unknown): number | undefined => {
  if (isHttpError(error)) {
    return error.response?.status;
  }
  return undefined;
};
