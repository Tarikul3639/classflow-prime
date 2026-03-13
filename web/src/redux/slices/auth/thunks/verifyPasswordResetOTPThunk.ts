import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/api/error.utils";

interface VerifyPasswordResetOTPPayload {
  email: string;
  otp: string;
}

interface VerifyPasswordResetOTPResponse {
  message: string;
}

export const verifyPasswordResetOTPThunk = createAsyncThunk<
  VerifyPasswordResetOTPResponse,
  VerifyPasswordResetOTPPayload,
  { rejectValue: string }
>("auth/verifyPasswordResetOTP", async (payload, { rejectWithValue }) => {
  try {
    console.log("🔍 Verifying password reset OTP");

    const response = await apiClient.post<VerifyPasswordResetOTPResponse>(
      "/auth/forgot-password/verify-otp",
      payload,
    );

    console.log("✅ OTP verified successfully");

    return response.data;
  } catch (error: any) {
    console.error("❌ Verify OTP error:", error);
    return rejectWithValue(extractErrorMessage(error));
  }
});
