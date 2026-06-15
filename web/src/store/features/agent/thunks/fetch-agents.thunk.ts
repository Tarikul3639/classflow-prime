import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, getErrorMessage } from '@/api/axios';
import type { IAgent, IFetchAgentsResponse } from '../agent.types';

export const fetchAgentsThunk = createAsyncThunk<
    IAgent[],
    void,
    { rejectValue: string }
>(
    'agent/fetch',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.get<IFetchAgentsResponse>('/agents');

            if (!data.success) {
                return rejectWithValue(data.message);
            }

            // Return the agents array from the response
            return data.data.agents;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);