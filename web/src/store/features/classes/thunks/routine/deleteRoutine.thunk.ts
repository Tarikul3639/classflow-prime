import { createAsyncThunk } from "@reduxjs/toolkit";

import { apiClient } from "@/api/axios";

import { extractAxiosError } from "@/api/extract-error";

export interface DeleteRoutinePayload {
    classId: string;
}

interface DeleteRoutineResponse {
    success: boolean;
    message: string;
}

export const deleteRoutine = createAsyncThunk(
    "routine/deleteRoutine",

    async (
        payload: DeleteRoutinePayload,
        { rejectWithValue },
    ) => {
        try {
            const res =
                await apiClient.delete<DeleteRoutineResponse>(
                    `/classes/${payload.classId}/routine`,
                );

            return {
                classId: payload.classId,
                message: res.data.message,
            };
        } catch (error: any) {
            return rejectWithValue(
                extractAxiosError(error) ||
                "Failed to delete routine",
            );
        }
    },
);