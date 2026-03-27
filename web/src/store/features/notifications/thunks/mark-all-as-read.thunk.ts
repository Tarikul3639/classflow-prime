import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { RejectValue } from "../notification.types";
import { extractAxiosError } from "@/lib/api/extract-error";

// ─── Mark All as Read ─────────────────────────────────────
export const markAllNotificationsAsRead = createAsyncThunk<
    void,
    void,
    RejectValue
>("notification/markAllAsRead", async (_, { rejectWithValue }) => {
    try {
        await apiClient.patch("/notifications/read-all");
    } catch (error: unknown) {
        return rejectWithValue({
            message: extractAxiosError(error, "Failed to mark all notifications as read"),
        });
    }
});