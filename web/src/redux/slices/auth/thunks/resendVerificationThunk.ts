import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/axios';
import { extractErrorMessage } from '@/lib/api/error.utils';
import type { ResendVerificationPayload } from '../types';

export const resendVerificationThunk = createAsyncThunk<
  string,
  ResendVerificationPayload,
  { rejectValue: string }
>('auth/resendVerification', async (data, { rejectWithValue }) => {
  try {
    console.log('📧 Resending verification code...');

    const response = await apiClient.post<{ message: string }>(
      '/auth/resend-verification',
      data
    );

    console.log('✅ Verification code resent');

    return response.data.message;
  } catch (err: any) {
    console.error('❌ Resend verification error:', err);
    return rejectWithValue(extractErrorMessage(err));
  }
});