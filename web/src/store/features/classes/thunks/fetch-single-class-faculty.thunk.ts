import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractAxiosError } from "@/lib/api/extract-error";
import type { ClassFaculty } from "./class-faculty.thunk";

/**
 * Fetch single faculty by ID (optional, can be derived from state)
 * If needed, can be implemented as a selector that finds the faculty in the state by ID instead of an API call.
 */

interface FetchSingleClassFacultyResponse {
    success: boolean;
    message: string;
    data: {
        classId: string;
        faculty: ClassFaculty;
    };
}

export const fetchSingleClassFaculty = createAsyncThunk<
    ClassFaculty,
    { classId: string; facultyId: string },
    { rejectValue: string }
>(
    "classes/fetchFacultyById",
    async ({ classId, facultyId }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get<FetchSingleClassFacultyResponse>(
                `/classes/${classId}/faculties/${facultyId}`
            );

            if (!data.success) {
                return rejectWithValue(data.message || "Failed to fetch faculty details.");
            }
            return data.data.faculty;
        } catch (error: unknown) {
            return rejectWithValue(extractAxiosError(error));
        }
    }
);