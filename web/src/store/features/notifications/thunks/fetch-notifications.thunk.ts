import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { FetchNotificationsData, FetchNotificationsArgs, ApiResponseType, RejectValue } from "../notification.types";

// ─── Fetch All ────────────────────────────────────────────
export const fetchNotifications = createAsyncThunk<
    FetchNotificationsData,
    FetchNotificationsArgs | undefined,
    RejectValue
>("notification/fetchAll", async (args, { rejectWithValue }) => {
    try {
        const params = new URLSearchParams();
        if (args?.page) params.append("page", String(args.page));
        if (args?.limit) params.append("limit", String(args.limit));
        if (args?.onlyUnread) params.append("onlyUnread", String(args.onlyUnread));
        if (args?.type) params.append("type", args.type);

        const { data } = await apiClient.get<ApiResponseType<FetchNotificationsData>>(
            `/notifications?${params.toString()}`,
        );

        if (!data.success) {
            return rejectWithValue({
                message: data.message || "Failed to fetch notifications",
            });
        }

        return data.data;
    } catch (error: unknown) {
        const err = error as Error;
        return rejectWithValue({
            message: err.message || "Failed to fetch notifications",
        });
    }
});