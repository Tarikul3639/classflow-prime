import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, getErrorMessage } from '@/lib/api/axios';

/**
 * Sign out current session.
 * Backend: POST /auth/signout
 */

interface SignOutResponse {
  success: boolean;
  message: string;
}
export const signoutCurrentThunk = createAsyncThunk<
  SignOutResponse,
  void,
  { rejectValue: string }
>('auth/signoutCurrent', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post<SignOutResponse>(
      '/auth/signout',
      payload,
    );

    if (!data.success) {
      return rejectWithValue(data.message || "Sign out failed");
    }

    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

/**
 * Sign out from all devices.
 * Backend: POST /auth/signout/all
 */
export const signoutAllThunk = createAsyncThunk<
  SignOutResponse,
  void,
  { rejectValue: string }
>('auth/signoutAll', async (_: void, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post<SignOutResponse>('/auth/signout/all');

    if (!data.success) {
      return rejectWithValue(data.message || "Sign out failed");
    }

    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});