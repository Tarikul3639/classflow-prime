import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, getErrorMessage } from '@/lib/api/axios';

export const requestPasswordResetThunk = createAsyncThunk<any, { email: string }>(
  'auth/passwordResetRequest',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/auth/password-reset/request', payload);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const verifyPasswordResetThunk = createAsyncThunk<any, { email: string; code: string }>(
  'auth/passwordResetVerify',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/auth/password-reset/verify', payload);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const resendPasswordResetThunk = createAsyncThunk<any, { email: string }>(
  'auth/passwordResetResend',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/auth/password-reset/resend', payload);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const confirmPasswordResetThunk = createAsyncThunk<
  any,
  { email: string; code: string; newPassword: string }
>(
  'auth/passwordResetConfirm',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/auth/password-reset/confirm', payload);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);