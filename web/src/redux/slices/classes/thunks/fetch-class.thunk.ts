import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";

export interface IClassDetails {
    classId: string;
    department: string;
    title: string;
    members: number;
    instructor: string;
    semester: string;
    themeColor: string;
    coverImage?: string;
    avatarUrl?: string | null;
    status: "active" | "archived";
}

interface FetchClassResponse {
    success: boolean;
    message: string;
    data: {
        class: IClassDetails;
    };
}

export const fetchClass = createAsyncThunk<
    IClassDetails,
    string,
    { rejectValue: { message: string } }
>("classes/fetchById", async (classId, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.get<FetchClassResponse>(`/classes/${classId}`);
        console.log("API Response:", data);
        if (!data.success) {
            return rejectWithValue({
                message: data.message || "Failed to fetch class details",
            });
        }
        return data.data.class;
    } catch (error: unknown) {
        console.log("Error fetching class details:", error);
        const err = error as Error;
        return rejectWithValue({
            message: err.message || "An error occurred while fetching class details",
        });
    }
});