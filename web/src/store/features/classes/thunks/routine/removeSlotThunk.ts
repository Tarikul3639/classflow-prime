// removeSlotThunk.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/api/axios";
import { extractAxiosError } from "@/api/extract-error";
import type { Routine } from "@/types/routine.types";

export interface RemoveSlotPayload {
    classId: string;
    slotId: string;
}

interface RemoveSlotResponse {
    success: boolean;

    message: string;

    data: Routine;
}

export const removeSlot = createAsyncThunk(
    "routine/removeSlot",

    async (
        payload: RemoveSlotPayload,
        { rejectWithValue },
    ) => {
        try {
            const res =
                await apiClient.delete<RemoveSlotResponse>(
                    `/classes/${payload.classId}/routine/remove-slot/${payload.slotId}`,
                );

            return res.data.data;
        } catch (error: any) {
            return rejectWithValue(
                extractAxiosError(error) ||
                    "Failed to remove slot",
            );
        }
    },
);