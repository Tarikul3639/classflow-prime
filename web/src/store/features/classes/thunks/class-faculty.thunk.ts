import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/api/axios";
import { extractAxiosError } from "@/api/extract-error";
import type { ClassFaculty } from "../class.types";

// ─── Interfaces ───────────────────────────────────────────────

interface FetchClassFacultiesData {
    classId: string;
    faculties: ClassFaculty[];
}

interface FetchClassFacultiesResponse {
    success: boolean;
    message: string;
    data: FetchClassFacultiesData;
}

interface ClassFacultyResponse {
    success: boolean;
    message: string;
    data: {
        classId: string;
        faculty: ClassFaculty;
    };
}

// ─── Payload Types ────────────────────────────────────────────

export interface CreateClassFacultyPayload {
    classId: string;
    facultyData: Omit<ClassFaculty, "facultyId">;
}

export interface UpdateClassFacultyPayload {
    classId: string;
    facultyId: string;
    facultyData: Partial<Omit<ClassFaculty, "facultyId">>;
}

// ─── Thunks ───────────────────────────────────────────────────

/**
 * Fetch Faculties
 * arg = plain string → action.meta.arg = classId
 */
export const fetchClassFaculties = createAsyncThunk<
    ClassFaculty[],
    string,                     // ← plain string (classId)
    { rejectValue: string }
>(
    "classes/fetchFaculties",
    async (classId, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get<FetchClassFacultiesResponse>(
                `/classes/${classId}/faculties`
            );

            if (!data.success) {
                return rejectWithValue(data.message || "Failed to fetch faculties.");
            }

            return data.data.faculties;
        } catch (error: unknown) {
            return rejectWithValue(extractAxiosError(error));
        }
    }
);

/**
 * Create Faculty
 * arg = { classId, facultyData } → action.meta.arg.classId
 */
export const createClassFaculty = createAsyncThunk<
    ClassFaculty,
    CreateClassFacultyPayload,  // { classId, facultyData }
    { rejectValue: string }
>(
    "classes/createFaculty",
    async ({ classId, facultyData }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.post<ClassFacultyResponse>(
                `/classes/${classId}/faculties`,
                facultyData
            );

            if (!data.success) {
                return rejectWithValue(data.message || "Failed to create faculty.");
            }

            return data.data.faculty;
        } catch (error: unknown) {
            return rejectWithValue(extractAxiosError(error));
        }
    }
);

/**
 * Delete Faculty
 * arg = { classId, facultyId } → action.meta.arg.classId
 */
export const deleteClassFaculty = createAsyncThunk<
    { facultyId: string; message: string },
    { classId: string; facultyId: string },
    { rejectValue: string }
>(
    "classes/deleteFaculty",
    async ({ classId, facultyId }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.delete<{
                success: boolean;
                message: string;
            }>(`/classes/${classId}/faculties/${facultyId}`);

            if (!data.success) {
                return rejectWithValue(data.message || "Failed to delete faculty.");
            }

            return { facultyId, message: data.message };
        } catch (error: unknown) {
            return rejectWithValue(extractAxiosError(error));
        }
    }
);