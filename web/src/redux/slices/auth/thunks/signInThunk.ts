import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/axios';
import { extractErrorMessage } from '@/lib/api/error.utils';
import { tokenManager } from '@/lib/api/token-manager';
import type { IUser, SignInPayload, AuthResponse } from '../types';

export const signInThunk = createAsyncThunk<
  IUser,
  SignInPayload,
  { rejectValue: string }
>('auth/signIn', async (data, { rejectWithValue }) => {
  try {
    console.log('🔐 Signing in...');

    const response = await apiClient.post<AuthResponse>('/auth/signin', data);

    const { user, tokens, message } = response.data;

    // Save tokens
    tokenManager.setTokens(tokens.accessToken, tokens.refreshToken);

    console.log(message, ':', user.email);

    return user;
  } catch (err: any) {
    console.error('❌ Sign-in error:', err);
    return rejectWithValue(extractErrorMessage(err));
  }
});