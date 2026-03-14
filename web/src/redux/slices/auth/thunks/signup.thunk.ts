import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, getErrorMessage } from '@/lib/api/axios';
import { SignUpRequest } from '../types';

export const signupThunk = createAsyncThunk<any, SignUpRequest>(
  'auth/signup',
  async (payload, { rejectWithValue }) => {
    // client-side validation inside thunk
    if (payload.firstName.trim().length < 2) {
      return rejectWithValue("First name must be at least 2 characters");
    }

    if (!payload.password || payload.password.length < 6) {
      return rejectWithValue("Password must be at least 6 characters");
    }

    if (!payload.email || !/\S+@\S+\.\S+/.test(payload.email)) {
      return rejectWithValue("Invalid email address");
    }

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