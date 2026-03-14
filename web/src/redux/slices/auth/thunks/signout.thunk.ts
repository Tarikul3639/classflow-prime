import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, getErrorMessage } from '@/lib/api/axios';

/**
 * Sign out current session.
 * Backend: POST /auth/signout
 */
interface SignOutRequest {
  // Optionally, you can include fields like refreshToken if your backend requires it for signout.
  refreshToken?: string;
}

interface SignOutResponse {
  message: string;
}
export const signoutCurrentThunk = createAsyncThunk<
  SignOutResponse,
  SignOutRequest,
  { rejectValue: string }
>('auth/signoutCurrent', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post<SignOutResponse>(
      '/auth/signout',
      payload,
    );

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

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

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});