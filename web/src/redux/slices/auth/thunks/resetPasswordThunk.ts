import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export const resetPasswordThunk = createAsyncThunk<
  ResetPasswordResponse,
  ResetPasswordPayload
>(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/forgot-password/reset-password", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);