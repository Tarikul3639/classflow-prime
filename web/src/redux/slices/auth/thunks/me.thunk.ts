import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient, getErrorMessage } from "@/lib/api/axios";
import type { IUser } from "../auth.types";

/**
 * Fetch current authenticated user.
 * Backend: GET /auth/me
 */
export const meThunk = createAsyncThunk<
    IUser,
    void,
    { rejectValue: string }
>("auth/me", async (_: void, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.get<IUser>("/auth/me");
        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});
