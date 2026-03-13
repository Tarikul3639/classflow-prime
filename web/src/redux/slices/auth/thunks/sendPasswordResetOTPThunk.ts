import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/axios';
import { extractErrorMessage } from '@/lib/api/error.utils';

interface SendPasswordResetOTPPayload {
  email: string;
}

interface SendPasswordResetOTPResponse {
  message: string;
}

export const sendPasswordResetOTPThunk = createAsyncThunk<
  SendPasswordResetOTPResponse,
  SendPasswordResetOTPPayload,
  { rejectValue: string }
>('auth/sendPasswordResetOTP', async (payload, { rejectWithValue }) => {
  try {
    console.log('📧 Sending password reset OTP to:', payload.email);

    const response = await apiClient.post<SendPasswordResetOTPResponse>(
      '/auth/forgot-password',
      payload
    );

    console.log('✅ Password reset OTP sent successfully');

    return response.data;
  } catch (error: any) {
    console.error('❌ Send OTP error:', error);
    return rejectWithValue(extractErrorMessage(error));
  }
});