import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient, getErrorMessage } from '@/api/axios';
import type { ICreateAgentRequest, ICreateAgentResponse } from '../agent.types';

export const createAgentThunk = createAsyncThunk<
    ICreateAgentResponse,
    ICreateAgentRequest,
    { rejectValue: string }
>(
    'agent/create',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.post<ICreateAgentResponse>(
                '/agents',
                payload,
            );

            if (!data.success) {
                return rejectWithValue(data.message);
            }

            return data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);