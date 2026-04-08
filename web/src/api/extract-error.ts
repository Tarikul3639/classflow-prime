import axios, { AxiosError } from "axios";

/**
 * Extracts a user-friendly error message from an unknown error source.
 * Priority: Axios response data -> Axios error message -> Native error message -> Fallback.
 * * @param error - The error object (likely from a catch block).
 * @param fallback - Default message if no specific error text is found.
 * @returns {string} A human-readable error message.
 */
export function extractAxiosError(
    error: unknown,
    fallback: string = "Something went wrong"
): string {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message ||
            error.message ||
            fallback
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallback;
}

/**
 * Standard interface for structured API errors across the UI.
 * Used for consistent error states, form validation (via 'field'), and error tracking (via 'code').
 */
export interface ApiError<T = string> {
    message: string;
    field?: T; // Useful for mapping errors to specific form fields
    code?: string; // Unique error code for conditional logic in UI
}

/**
 * Expected shape of error responses from the backend.
 */
type BackendError = {
    message?: string;
    field?: string;
    code?: string;
};

/**
 * Transforms any raw error into a structured ApiError object.
 * This ensures that components always receive a predictable error shape.
 * * @param error - Raw error caught from an API call or logic.
 * @returns {ApiError<T>} Formatted error object.
 */
export const mapToApiError = <T = string>(
    error: unknown
): ApiError<T> => {
    // Check if it's an Axios error
    if (axios.isAxiosError(error)) {
        const err = error as AxiosError<BackendError>;

        return {
            message:
                err.response?.data?.message ||
                err.message ||
                "Something went wrong",
            field: err.response?.data?.field as T,
            code: err.response?.data?.code ?? "API_ERROR",
        };
    }

    // Handle standard JavaScript Errors
    if (error instanceof Error) {
        return {
            message: error.message,
            code: "UNKNOWN_ERROR",
        };
    }

    // Generic fallback for everything else
    return {
        message: "Unexpected error occurred",
        code: "UNKNOWN_ERROR",
    };
};