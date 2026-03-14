import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, getErrorMessage } from '@/lib/api/axios';

export const signupThunk = createAsyncThunk<any, any>(
  'auth/signup',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/auth/signup', payload);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const verifySignupEmailThunk = createAsyncThunk<any, { email: string; code: string }>(
  'auth/signupVerify',
  async (payload, { rejectWithValue }) => {
    try {
        console.log(payload);
      const { data } = await apiClient.post('/auth/signup/verify', payload);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const resendSignupVerificationThunk = createAsyncThunk<any, { email: string }>(
  'auth/signupResend',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/auth/signup/resend', payload);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);