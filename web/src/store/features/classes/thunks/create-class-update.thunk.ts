import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { AxiosError } from "axios";
import { CreateUpdateFormData, ClassUpdateItem } from "@/types/update.types";
import type { ApiError, UpdateErrorField } from "../class.types";

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
        if (!updateData.title || !updateData.category) {
            return rejectWithValue({
                field: !updateData.title ? "title" : "type",
                message: !updateData.title
                    ? "Title is required for the update"
                    : "Update type is required",
            });
        }

        console.log("Update form data: ", updateData);

        // NOTE: Actually, If your observe closely, the API endpoint are plural `/classes/${classId}/updates` not singular, Because it indicates the collection of updates for a class, and we are adding a new update to that collection. So the correct endpoint should be `/classes/${classId}/updates` instead of `/classes/${classId}/update`. This follows RESTful API design principles where the endpoint represents a resource (in this case, updates) and we are performing a POST request to add a new item to that resource.
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

        // console.log("Create response: ", response);

        return response.data;
    } catch (error: unknown) {
        const err = error as AxiosError<{ field?: UpdateErrorField; message?: string }>;

        return rejectWithValue({
            field: err.response?.data?.field || null,
            message: err.response?.data?.message || "Something went wrong while posting the update",
        });
    }
});