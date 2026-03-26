import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import type { ClassUpdateItem, CreateUpdateFormData } from "@/types/update.types";
import { isAxiosError } from "axios";
import type { ApiError, UpdateErrorField } from "../class.types";

/**
 * API Response Structure for Update
 */
interface UpdateClassUpdateResponse {
    success: boolean;
    message: string;
    error: ApiError;
    data: {
        update: ClassUpdateItem;
    };
}

/**
 * Payload structure for the thunk argument
 */
interface UpdateThunkArgs {
    classId: string;
    updateId: string;
    updateData: Partial<CreateUpdateFormData>; // Partial allows us to send only the fields that need to be updated
}

export const updateClassUpdate = createAsyncThunk<
    ClassUpdateItem, // Return type
    UpdateThunkArgs, // Argument type
    { rejectValue: ApiError } // Error type
>(
    "classes/updateClassUpdate",
    async ({ classId, updateId, updateData }, { rejectWithValue }) => {
        
        console.log("Update Payload: ", updateData);

        try {
            // API call to update the class announcement/event
            const { data } = await apiClient.patch<UpdateClassUpdateResponse>(
                `/classes/${classId}/updates/${updateId}`,
                updateData
            );

            if (!data.success) {
                return rejectWithValue({
                    field: data.error?.field || null,
                    message: data.message || "Failed to update the class info."
                });
            }

            return data.data.update;
        } catch (error: unknown) {
            let errorMessage = "Failed to update class update.";
            let errorField: UpdateErrorField | null = null;

            if (isAxiosError(error)) {
                errorField = error.response?.data?.field || null;
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            return rejectWithValue({ field: errorField, message: errorMessage });
        }
    }
);