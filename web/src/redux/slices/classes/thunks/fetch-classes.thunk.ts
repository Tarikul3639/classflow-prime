import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { AxiosError } from "axios";

export interface IClass {
    classId: string;
    department: string;
    title: string;
    students: number;
    instructor: string;
    semester: string;
    themeColor: string;
    coverImage?: string;
    avatarUrl?: string | null;
    status: "active" | "archived";
}

interface FetchClassesResponse {
    success: boolean;
    message: string;
    data: {
        classes: IClass[];
    };
}

export const fetchClasses = createAsyncThunk<
    IClass[],
    void,
    { rejectValue: { message: string } }
>("classes/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.get<FetchClassesResponse>("/classes");
        console.log("API Response:", data);

        if (!data.success) {
            return rejectWithValue({
                message:data.message || "Failed to fetch classes",
            });
        }

        return data.data.classes;
    } catch (error: unknown) {
        const err = error as AxiosError<{ message?: string }>;

        return rejectWithValue({
            message: err.response?.data?.message || "An error occurred while fetching classes",
        });
    }
});