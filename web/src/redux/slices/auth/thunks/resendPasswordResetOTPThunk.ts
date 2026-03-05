import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ResendPasswordResetOTPPayload {
  email: string;
}

interface ResendPasswordResetOTPResponse {
  success: boolean;
  message: string;
}

export const resendPasswordResetOTPThunk = createAsyncThunk<
  ResendPasswordResetOTPResponse,
  ResendPasswordResetOTPPayload
>(
  "auth/resendPasswordResetOTP",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/forgot-password/resend-otp", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend verification code"
      );
    }
  }
);