import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface VerifyOTPPayload {
  email: string;
  otp: string;
}

interface VerifyOTPResponse {
  success: boolean;
  message: string;
  user?: any;
  token?: string;
}

export const verifyOTPThunk = createAsyncThunk<
  VerifyOTPResponse,
  VerifyOTPPayload
>(
  "auth/verifyOTP",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/verify-otp", payload);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem("authToken", response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);