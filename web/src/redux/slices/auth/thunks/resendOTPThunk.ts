import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ResendOTPPayload {
  email: string;
}

interface ResendOTPResponse {
  success: boolean;
  message: string;
}

export const resendOTPThunk = createAsyncThunk<
  ResendOTPResponse,
  ResendOTPPayload
>(
  "auth/resendOTP",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/resend-otp", payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);