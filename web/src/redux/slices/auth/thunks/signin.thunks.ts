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
    user: IUser;
    tokens: ITokens;
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

        // store tokens
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);

        return data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});