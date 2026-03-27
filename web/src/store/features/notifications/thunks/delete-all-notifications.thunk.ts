import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { RejectValue } from "../notification.types";

// ─── Delete All ───────────────────────────────────────────
export const deleteAllNotifications = createAsyncThunk<void, void, RejectValue>(
    "notification/deleteAll",
    async (_, { rejectWithValue }) => {
        try {
            await apiClient.delete("/notifications");
        } catch (error: unknown) {
            const err = error as Error;
            return rejectWithValue({
                message: err.message || "Failed to delete all notifications",
            });
        }
    },
);