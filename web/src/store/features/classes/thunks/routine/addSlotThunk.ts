import { createAsyncThunk } from "@reduxjs/toolkit";

import { apiClient } from "@/api/axios";
import { extractAxiosError } from "@/api/extract-error";

import type { Routine } from "@/types/routine.types";

export interface AddSlotPayload {
    classId: string;
    day: string;
    periodNo: number;
    subject: string;
    teacherName: string;
    room?: string;
}

interface AddSlotResponse {
    success: boolean;
    message: string;
    data: Routine;
}

export const addSlot = createAsyncThunk(
    "routine/addSlot",

    async (payload: AddSlotPayload, { rejectWithValue }) => {
        try {
            const res = await apiClient.patch<AddSlotResponse>(
                `/classes/${payload.classId}/routine/add-slot`,
                {
                    day: payload.day,
                    periodNo: payload.periodNo,
                    subject: payload.subject,
                    teacherName: payload.teacherName,
                    room: payload.room ?? "",
                },
            );

            return res.data.data;
        } catch (error: any) {
            return rejectWithValue(extractAxiosError(error) || "Failed to add slot");
        }
    },
);
