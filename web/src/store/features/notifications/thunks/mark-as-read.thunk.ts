import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { RejectValue } from "../notification.types";

// ─── Mark Single as Read ──────────────────────────────────
export const markNotificationAsRead = createAsyncThunk<
    { id: string },
    string,
    RejectValue
>("notification/markAsRead", async (id, { rejectWithValue }) => {
    try {
        await apiClient.patch(`/notifications/${id}/read`);
        return { id };
    } catch (error: unknown) {
        const err = error as Error;
        return rejectWithValue({
            message: err.message || "Failed to mark as read",
        });
    }
});