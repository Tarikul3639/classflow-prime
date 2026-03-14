import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, getErrorMessage } from '@/lib/api/axios';

type SignInPayload = { email: string; password: string };
type SignInResult = { user: any; tokens: { accessToken: string; refreshToken: string } };

export const signinThunk = createAsyncThunk<SignInResult, SignInPayload>(
    'auth/signin',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.post('/auth/signin', payload);

            // store tokens
            localStorage.setItem('accessToken', data.tokens.accessToken);
            localStorage.setItem('refreshToken', data.tokens.refreshToken);

            return data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);