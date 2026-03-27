import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { ApiResponseType, RejectValue } from "../notification.types";

// ─── Fetch Unread Count ───────────────────────────────────
export const fetchUnreadCount = createAsyncThunk<
    { count: number },
    void,
    RejectValue
>("notification/fetchUnreadCount", async (_, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.get<ApiResponseType<{ count: number }>>(
            "/notifications/unread-count",
        );

        if (!data.success) {
            return rejectWithValue({
                message: data.message || "Failed to fetch unread count",
            });
        }

        return data.data;
    } catch (error: unknown) {
        const err = error as Error;
        return rejectWithValue({
            message: err.message || "Failed to fetch unread count",
        });
    }
});