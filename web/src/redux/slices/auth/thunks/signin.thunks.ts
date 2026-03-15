import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, getErrorMessage } from '@/lib/api/axios';
import type { IUser, ITokens } from '../auth.types';

/**
 * Sign in.
 * Backend: POST /auth/signin
 */
interface SignInRequest {
    email: string;
    password: string;
}
interface SignInResponse {
    success: boolean;
    message: string;
    data: {
        user: IUser;
        tokens: ITokens;
    };
}

export const SignInThunk = createAsyncThunk<
    SignInResponse,
    SignInRequest,
    { rejectValue: string }
>('auth/signin', async (payload, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.post<SignInResponse>(
            '/auth/signin',
            payload,
        );
        if (!data.success) {
            return rejectWithValue(data.message || "Sign in failed");
        }

        // store tokens
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);

        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});