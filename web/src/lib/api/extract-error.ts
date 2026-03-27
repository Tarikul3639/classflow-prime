import axios from "axios";

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