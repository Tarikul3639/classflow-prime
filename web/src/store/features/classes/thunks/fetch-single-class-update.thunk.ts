import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import type { ClassUpdateItem } from "@/types/update.types";
import { isAxiosError } from "axios";

/**
 * API Response Structure
 */
interface FetchClassUpdateResponse {
    success: boolean;
    message: string;
    data: {
        update: ClassUpdateItem; // Single object since we fetch by ID
    };
}

/**
 * Fetch a single class update by its ID
 * URL: /classes/:classId/updates/:updateId
 */
export const fetchSingleClassUpdate = createAsyncThunk<
    ClassUpdateItem, // Return type (Payload)
    { classId: string; updateId: string }, // Arguments
    { rejectValue: { message: string } } // Error type
>(
    "classes/fetchSingleClassUpdate",
    async ({ classId, updateId }, { rejectWithValue }) => {
        try {
            // Make the API call to fetch the class update details by ID
            const { data } = await apiClient.get<FetchClassUpdateResponse>(
                `/classes/${classId}/updates/${updateId}`
            );

            if (!data.success) {
                return rejectWithValue({ 
                    message: data.message || "Failed to fetch the update details." 
                });
            }

            // console.log('Fetch Single Class Update: ', data.data.update);

            return data.data.update;
        } catch (error: unknown) {
            let errorMessage = "An unexpected error occurred.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            return rejectWithValue({ message: errorMessage });
        }
    }
);