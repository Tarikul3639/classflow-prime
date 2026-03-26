// delete-single-class-update.thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { isAxiosError } from "axios";

/**
 * Payload structure for deleting a single class update
 */
interface DeleteClassUpdateArgs {
    classId: string;
    updateId: string;
}

interface DeleteClassUpdate {
    updateId: string;
}

interface DeleteClassUpdateResponse {
    success: boolean;
    message: string;
    data: DeleteClassUpdate
}

export const deleteSingleClassUpdate = createAsyncThunk<
    DeleteClassUpdate,
    DeleteClassUpdateArgs,
    { rejectValue: { message: string } }
>(
    "classes/deleteSingleClassUpdate",
    async ({ classId, updateId }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.delete<DeleteClassUpdateResponse>(
                `/classes/${classId}/updates/${updateId}`
            );

            if (!data.success) {
                return rejectWithValue({
                    message: data.message || "Failed to delete the class update.",
                });
            }

            return data.data;
        } catch (error: unknown) {
            let errorMessage = "An error occurred while deleting the update.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            return rejectWithValue({ message: errorMessage });
        }
    }
);