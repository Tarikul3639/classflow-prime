import { createAsyncThunk } from "@reduxjs/toolkit";

import { apiClient } from "@/api/axios";

import { extractAxiosError } from "@/api/extract-error";

import type { Routine } from "@/types/routine.types";

export interface EditSlotPayload {
    classId: string;

    slotId: string;

    day: string;

    periodNo: number;

    subject: string;

    teacherName: string;

    room?: string;
}

interface EditSlotResponse {
    success: boolean;

    message: string;

    data: Routine;
}

export const editSlot = createAsyncThunk(
    "routine/editSlot",

    async (
        payload: EditSlotPayload,
        { rejectWithValue },
    ) => {
        try {
            const res =
                await apiClient.patch<EditSlotResponse>(
                    `/classes/${payload.classId}/routine/edit-slot/${payload.slotId}`,
                    {
                        day: payload.day,

                        periodNo:
                            payload.periodNo,

                        subject:
                            payload.subject,

                        teacherName:
                            payload.teacherName,

                        room:
                            payload.room ?? "",
                    },
                );

            return res.data.data;
        } catch (error: any) {
            return rejectWithValue(
                extractAxiosError(error) ||
                    "Failed to edit slot",
            );
        }
    },
);