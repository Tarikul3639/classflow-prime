import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/axios';
import { extractErrorMessage } from '@/lib/api/error.utils';
import { tokenManager } from '@/lib/api/token-manager';
import type { IUser, SignUpPayload, AuthResponse } from '../types';

export const signUpThunk = createAsyncThunk<
  IUser,
  SignUpPayload,
  { rejectValue: string }
>('auth/signUp', async (data, { rejectWithValue }) => {
  try {
    console.log('📝 Signing up...');

    const response = await apiClient.post<AuthResponse>('/auth/signup', data);

    const { user, tokens } = response.data;

    // Save tokens
    tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);

    console.log('✅ Sign-up successful, user:', user.email);

    return user;
  } catch (err: any) {
    console.error('❌ Sign-up error:', err);
    return rejectWithValue(extractErrorMessage(err));
  }
});