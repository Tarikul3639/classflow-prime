import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient, getErrorMessage } from "@/lib/api/axios";
import type { IUser } from "../auth.types";

/**
 * Fetch current authenticated user.
 * Backend: GET /auth/me
 */
interface MeResponse {
    success: boolean;
    message: string;
    data: {
        user: IUser;
    };
}
export const meThunk = createAsyncThunk<
    IUser,
    void,
    { rejectValue: string }
>("auth/me", async (_: void, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.get<MeResponse>("/auth/me");
        if (!data.success) {
            return rejectWithValue(data.message || "Failed to fetch user data");
        }
        return data.data.user;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});
