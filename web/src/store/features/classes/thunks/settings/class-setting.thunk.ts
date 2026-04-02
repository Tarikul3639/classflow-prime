// class-actions.thunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from "@/lib/api/axios";
import { extractAxiosError } from "@/lib/api/extract-error";

// ─── Leave Class ───────────────────────────────────────────────

export const leaveClass = createAsyncThunk<
    { message: string },
    { classId: string },
    { rejectValue: string }
>(
    "classes/leaveClass",
    async ({ classId }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.post(`classes/${classId}/leave`);
            return { message: data.message };
        } catch (error) {
            return rejectWithValue(extractAxiosError(error));
        }
    }
);

// ─── Delete Class ──────────────────────────────────────────────

export const deleteClass = createAsyncThunk<
    { classId: string; message: string },
    { classId: string },
    { rejectValue: string }
>(
    "classes/deleteClass",
    async ({ classId }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.delete(`classes/${classId}`);
            return { classId, message: data.message };
        } catch (error) {
            return rejectWithValue(extractAxiosError(error));
        }
    }
);

// ─── Mark Class As Ended ───────────────────────────────────────

export const markClassAsEnded = createAsyncThunk<
    { classId: string; message: string },
    { classId: string },
    { rejectValue: string }
>(
    "classes/markAsEnded",
    async ({ classId }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.patch(`classes/${classId}/end`);
            return { classId, message: data.message };
        } catch (error) {
            return rejectWithValue(extractAxiosError(error));
        }
    }
);

// ─── Fetch Class Code ──────────────────────────────────────────

export const fetchClassCode = createAsyncThunk<
    { classId: string; code: string },
    { classId: string },
    { rejectValue: string }
>(
    "classes/fetchClassCode",
    async ({ classId }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get(`classes/${classId}/code`);
            return { classId, code: data.data.code };
        } catch (error) {
            return rejectWithValue(extractAxiosError(error));
        }
    }
);

// ─── Regenerate Class Code ─────────────────────────────────────

export const regenerateClassCode = createAsyncThunk<
    { classId: string; code: string },
    { classId: string },
    { rejectValue: string }
>(
    "classes/regenerateClassCode",
    async ({ classId }, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.patch(`classes/${classId}/code/regenerate`);
            return { classId, code: data.data.code };
        } catch (error) {
            return rejectWithValue(extractAxiosError(error));
        }
    }
);