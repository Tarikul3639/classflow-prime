import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { AxiosError } from "axios";

export interface ApiError {
    field: string | null;
    message: string;
}

interface CreateClassPayload {
    className: string;
    department: string;
    semester: string;
    about?: string;
    coverImage?: string;
    themeColor?: string;
    allowJoin?: boolean;
}

interface CreateClassResponse {
    success: boolean;
    message: string;
    data: {
        classId: string;
    };
}

export const createClass = createAsyncThunk<
    CreateClassResponse,
    CreateClassPayload,
    { rejectValue: ApiError }
>("classes/create", async (payload, { rejectWithValue }) => {
    try {
        if (!payload.className || !payload.department || !payload.semester) {
            return rejectWithValue({
                field: !payload.className
                    ? "ClassName"
                    : !payload.department
                        ? "Department"
                        : "Semester",
                message:
                    (!payload.className
                        ? "Class name is required"
                        : !payload.department
                            ? "Department is required"
                            : "Semester is required") + " to create a class",
            });
        }
        const response = await apiClient.post<CreateClassResponse>(
            "/classes",
            payload,
        );

        if (!response.data.success) {
            return rejectWithValue({
                field: null,
                message: response.data.message || "Failed to create class",
            });
        }

        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError<{ field?: string; message?: string }>;

        return rejectWithValue({
            field: err.response?.data?.field || null,
            message: err.response?.data?.message || "Something went wrong",
        });
    }
});
