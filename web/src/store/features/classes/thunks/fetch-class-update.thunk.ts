import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import type { ClassUpdateItem } from "@/types/update.types";

interface FetchClassUpdateResponse {
    success: boolean;
    message: string;
    data: {
        update: ClassUpdateItem[];
    };
}

export const fetchClassUpdate = createAsyncThunk<
    ClassUpdateItem[],
    string,
    { rejectValue: { message: string } }
>(
    "classes/fetchClassUpdate",
    async (classId: string, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get<FetchClassUpdateResponse>(
                `/classes/${classId}/update`
            );

            if (!data.success) {
                return rejectWithValue({ message: data.message || "Failed to fetch update." });
            }

            // console.log("ALL Updates: ",data.data.update);

            return data.data.update;
        } catch (error: unknown) {
            const err = error as Error;
            return rejectWithValue({ message: err.message || "An error occurred." });
        }
    }
);