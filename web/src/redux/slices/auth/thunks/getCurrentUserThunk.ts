import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/axios';
import { extractErrorMessage } from '@/lib/api/error.utils';
import type { IUser } from '../types';

export const getCurrentUserThunk = createAsyncThunk<
  IUser,
  void,
  { rejectValue: string }
>('auth/getCurrentUser', async (_, { rejectWithValue }) => {
  try {
    console.log('👤 Getting current user...');

    const response = await apiClient.get<{ user: IUser }>('/auth/me');

    console.log('✅ Current user loaded:', response.data.user.email);

    return response.data.user;
  } catch (err: any) {
    console.error('❌ Get current user error:', err);
    return rejectWithValue(extractErrorMessage(err));
  }
});