import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/api/axios";
import { extractAxiosError } from "@/api/extract-error";
import { Routine } from "@/types/routine.types";

// ─── Types ────────────────────────────────────────────────────

interface RoutineResponse {
    success: boolean;
    message: string;
    data: Routine;
}

// ─── Thunk ────────────────────────────────────────────────────

/**
 * Fetch routine by classId
 *
 * Endpoint:
 * GET /classes/:classId/routine
 *
 * Behavior:
 * - Returns null if routine is not found (404)
 * - Rejects with error message for other failures
 */
export const fetchRoutine = createAsyncThunk<
    Routine | null,
    string,
    { rejectValue: string }
>(
    "routine/fetch",
    async (classId, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get<RoutineResponse>(
                `/classes/${classId}/routine`
            );

            // console.log("Full Routine: ", data.data);

            return data.data;
        } catch (error: unknown) {
            if ((error as any)?.response?.status === 404) {
                return null;
            }

            return rejectWithValue(extractAxiosError(error));
        }
    }
);