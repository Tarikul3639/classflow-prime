import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { RejectValue } from "../notification.types";
import { extractAxiosError } from "@/lib/api/extract-error";

// ─── Delete Single ────────────────────────────────────────
export const deleteNotification = createAsyncThunk<
    { notificationId: string },
    string,
    RejectValue
>("notification/deleteOne", async (notificationId, { rejectWithValue }) => {
    try {
        await apiClient.delete(`/notifications/${notificationId}`);

        return { notificationId };
    } catch (error: unknown) {
        return rejectWithValue({
            message: extractAxiosError(error, "Failed to delete notification"),
        });
    }
});