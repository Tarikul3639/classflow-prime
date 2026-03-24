import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { AxiosError } from "axios";
import { CreateUpdateFormData, ClassUpdateItem } from "@/types/update.types";
export interface ApiError {
    field: string | null;
    message: string;
}

interface CreateClassUpdatePayload {
    classId: string;
    updateData: CreateUpdateFormData;
}

interface CreateClassUpdateResponse {
    success: boolean;
    message: string;
    data: {
        update: ClassUpdateItem;
    };
}

export const createClassUpdate = createAsyncThunk<
    CreateClassUpdateResponse,
    CreateClassUpdatePayload,
    { rejectValue: ApiError }
>("classes/createUpdate", async ({ classId, updateData }, { rejectWithValue }) => {
    try {
        // Basic validation before making the API call
        if (!updateData.title || !updateData.type) {
            return rejectWithValue({
                field: !updateData.title ? "title" : "type",
                message: !updateData.title
                    ? "Title is required for the update"
                    : "Update type is required",
            });
        }

        // Make the API call to create the class update
        const response = await apiClient.post<CreateClassUpdateResponse>(
            `/classes/${classId}/updates`,
            updateData,
        );

        if (!response.data.success) {
            return rejectWithValue({
                field: null,
                message: response.data.message || "Failed to create class update",
            });
        }

        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError<{ field?: string; message?: string }>;

        return rejectWithValue({
            field: err.response?.data?.field || null,
            message: err.response?.data?.message || "Something went wrong while posting the update",
        });
    }
});