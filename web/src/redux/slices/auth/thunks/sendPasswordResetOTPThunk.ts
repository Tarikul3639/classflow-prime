import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface SendPasswordResetOTPPayload {
  email: string;
}

interface SendPasswordResetOTPResponse {
  success: boolean;
  message: string;
}

export const sendPasswordResetOTPThunk = createAsyncThunk<
  SendPasswordResetOTPResponse,
  SendPasswordResetOTPPayload
>(
  "auth/sendPasswordResetOTP",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/forgot-password/send-otp", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send verification code"
      );
    }
  }
);