import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface VerifyPasswordResetOTPPayload {
  email: string;
  otp: string;
}

interface VerifyPasswordResetOTPResponse {
  success: boolean;
  message: string;
}

export const verifyPasswordResetOTPThunk = createAsyncThunk<
  VerifyPasswordResetOTPResponse,
  VerifyPasswordResetOTPPayload
>(
  "auth/verifyPasswordResetOTP",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/forgot-password/verify-otp", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid or expired verification code"
      );
    }
  }
);