import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/axios';
import { extractErrorMessage } from '@/lib/api/error.utils';
import { tokenManager } from '@/lib/api/token-manager';

export const signOutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    console.log('🚪 Signing out...');

    const refreshToken = tokenManager.getRefreshToken();

    await apiClient.post('/auth/signout', { refreshToken });

    // Clear tokens
    tokenManager.clearTokens();

    console.log('✅ Sign-out successful');
  } catch (err: any) {
    console.error('❌ Sign-out error:', err);
    // Clear tokens even if request fails
    tokenManager.clearTokens();
    return rejectWithValue(extractErrorMessage(err));
  }
});