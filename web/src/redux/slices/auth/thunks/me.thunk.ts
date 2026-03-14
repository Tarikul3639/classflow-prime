import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, getErrorMessage } from '@/lib/api/axios';

export const meThunk = createAsyncThunk<any>(
    'auth/me',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get('/auth/me');
            return data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);