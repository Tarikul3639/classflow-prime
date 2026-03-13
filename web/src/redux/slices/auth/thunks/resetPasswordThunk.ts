import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/axios';
import { extractErrorMessage } from '@/lib/api/error.utils';

interface ResetPasswordPayload {
  email: string;
  code: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

export const resetPasswordThunk = createAsyncThunk<
  ResetPasswordResponse,
  ResetPasswordPayload,
  { rejectValue: string }
>('auth/resetPassword', async (payload, { rejectWithValue }) => {
  try {
    console.log('🔐 Resetting password');

    const response = await apiClient.post<ResetPasswordResponse>(
      '/auth/reset-password',
      payload
    );

    console.log('✅ Password reset successfully');

    return response.data;
  } catch (error: any) {
    console.error('❌ Reset password error:', error);
    return rejectWithValue(extractErrorMessage(error));
  }
});