import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/axios';
import { extractErrorMessage } from '@/lib/api/error.utils';
import type { IUser, VerifyEmailPayload } from '../types';

export const verifyEmailThunk = createAsyncThunk<
  IUser,
  VerifyEmailPayload,
  { rejectValue: string }
>('auth/verifyEmail', async (data, { rejectWithValue }) => {
  try {
    console.log('✉️ Verifying email...');

    await apiClient.post('/auth/verify-email', data);

    // Reload user after verification
    const response = await apiClient.get<{ user: IUser }>('/auth/me');

    console.log('✅ Email verified successfully');

    return response.data.user;
  } catch (err: any) {
    console.error('❌ Email verification error:', err);
    return rejectWithValue(extractErrorMessage(err));
  }
});