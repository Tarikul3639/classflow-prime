import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient, getErrorMessage } from "@/lib/api/axios";
import type { IUser } from '../profile.types'

/**
 * Fetch current authenticated user.
 * Backend: GET /profile/me
 */
interface MeResponse {
    success: boolean;
    message: string;
    data:{
        user: IUser;
    }
}
export const meThunk = createAsyncThunk<
    IUser,
    void,
    { rejectValue: string }
>("profile/me", async (_: void, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.get<MeResponse>("/profile/me");
        if (!data.success) {
            return rejectWithValue(data.message || "Failed to fetch user data");
        }
        console.log("User Data: ", data); // DEBUG: Log the user data received from the backend
        return data.data.user;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});
