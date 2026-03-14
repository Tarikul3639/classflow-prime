import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, getErrorMessage } from '@/lib/api/axios';

export const signoutCurrentThunk = createAsyncThunk<any, { refreshToken?: string }>(
  'auth/signoutCurrent',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/auth/signout', payload);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const signoutAllThunk = createAsyncThunk<any>(
  'auth/signoutAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/auth/signout/all');

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);