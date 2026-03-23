import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";

export interface ClassOverview {
    classId: string;
    about: string | null;
    studentsCount: number;
    eventsCount: number;
}

interface ClassOverviewResponse {
    success: boolean;
    message: string;
    data: {
        class: ClassOverview;
    };
}


export const fetchClassOverview = createAsyncThunk<
    ClassOverview,
    string,
    { rejectValue: { message: string } }
>(
    "classes/fetchClassOverview",
    async (classId: string, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get<ClassOverviewResponse>(
                `/classes/${classId}/overview`
            );

            if (!data.success) {
                return rejectWithValue({ message: data.message || "Failed to fetch class overview." });
            }

            return data.data.class;
        } catch (error: unknown) {
            const err = error as Error;
            return rejectWithValue({ message: err.message || "An error occurred." });
        }
    }
);