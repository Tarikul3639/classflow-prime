import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/axios';
import { extractErrorMessage } from '@/lib/api/error.utils';

interface ResendPasswordResetOTPPayload {
  email: string;
}

interface ResendPasswordResetOTPResponse {
  message: string;
}

export const resendPasswordResetOTPThunk = createAsyncThunk<
  ResendPasswordResetOTPResponse,
  ResendPasswordResetOTPPayload,
  { rejectValue: string }
>('auth/resendPasswordResetOTP', async (payload, { rejectWithValue }) => {
  try {
    console.log('📧 Resending password reset OTP');

    const response = await apiClient.post<ResendPasswordResetOTPResponse>(
      '/auth/forgot-password',
      payload
    );

    console.log('✅ OTP resent successfully');

    return response.data;
  } catch (error: any) {
    console.error('❌ Resend OTP error:', error);
    return rejectWithValue(extractErrorMessage(error));
  }
});