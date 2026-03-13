import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/api/error.utils";

interface SendSignupVerificationPayload {
  email: string;
}

interface SendSignupVerificationResponse {
  message: string;
}

export const sendSignupVerificationThunk = createAsyncThunk<
  SendSignupVerificationResponse,
  SendSignupVerificationPayload,
  { rejectValue: string }
>("auth/sendSignupVerification", async (payload, { rejectWithValue }) => {
  try {
    
    const res = await apiClient.post<SendSignupVerificationResponse>(
      "/auth/resend-verification",
      payload,
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(extractErrorMessage(err));
  }
});