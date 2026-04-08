import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/api/axios";
import { extractAxiosError } from "@/api/extract-error";
import type { ClassFaculty } from "../class.types";

interface ClassSingleFacultyResponse {
    success: boolean;
    message: string;
    data: {
        classId: string;
        faculty: ClassFaculty;
    };
}

export interface UpdateSingleClassFacultyPayload {
    classId: string;
    facultyId: string;
    facultyData: Partial<Omit<ClassFaculty, "facultyId">>;
}

/**
 * Update Faculty
 */
export const updateSingleClassFaculty = createAsyncThunk<
    ClassFaculty,                 // single faculty
    UpdateSingleClassFacultyPayload, 
    { rejectValue: string }
>(
    "classes/updateSingleFaculty",
    async ({ classId, facultyId, facultyData }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.patch<ClassSingleFacultyResponse>(
                `/classes/${classId}/faculties/${facultyId}`,
                facultyData
            );

            return data.data.faculty;
        } catch (error: unknown) {
            return rejectWithValue(extractAxiosError(error));
        }
    }
);