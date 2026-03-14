import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient, getErrorMessage } from "@/lib/api/axios";

/**
 * Request password reset code.
 * Backend: POST /auth/password-reset/request
 */
interface RequestPasswordResetRequest {
  email: string;
}
interface RequestPasswordResetResponse {
  message: string;
}
export const requestPasswordResetThunk = createAsyncThunk<
  RequestPasswordResetResponse,
  RequestPasswordResetRequest,
  { rejectValue: string }
>("auth/passwordResetRequest", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post<RequestPasswordResetResponse>(
      "/auth/password-reset/request",
      payload,
    );
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/**
 * Verify password reset code (OTP).
 * Backend: POST /auth/password-reset/verify
 */
interface VerifyCodePasswordResetRequest {
  email: string;
  code: string;
}
interface VerifyCodePasswordResetResponse {
  message: string;
}

export const verifyCodePasswordResetThunk = createAsyncThunk<
  VerifyCodePasswordResetResponse,
  VerifyCodePasswordResetRequest,
  { rejectValue: string }
>("auth/passwordResetVerify", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post<VerifyCodePasswordResetResponse>(
      "/auth/password-reset/verify",
      payload,
    );
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/**
 * Resend password reset code.
 * Backend: POST /auth/password-reset/resend
 */
interface ResendCodePasswordResetRequest {
  email: string;
}
interface ResendCodePasswordResetResponse {
  message: string;
}
export const resendCodePasswordResetThunk = createAsyncThunk<
  ResendCodePasswordResetResponse,
  ResendCodePasswordResetRequest,
  { rejectValue: string }
>("auth/passwordResetResend", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post<ResendCodePasswordResetResponse>(
      "/auth/password-reset/resend",
      payload,
    );
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/**
 * Confirm password reset with new password.
 * Backend: POST /auth/password-reset/confirm
 */
interface ConfirmNewPasswordPasswordResetRequest {
  email: string;
  code: string;
  newPassword: string;
}
interface ConfirmNewPasswordPasswordResetResponse {
  message: string;
}
export const confirmNewPasswordPasswordResetThunk = createAsyncThunk<
  ConfirmNewPasswordPasswordResetResponse,
  ConfirmNewPasswordPasswordResetRequest,
  { rejectValue: string }
>("auth/passwordResetConfirm", async (payload, { rejectWithValue }) => {
  try {
    const { data } =
      await apiClient.post<ConfirmNewPasswordPasswordResetResponse>(
        "/auth/password-reset/confirm",
        payload,
      );
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});
