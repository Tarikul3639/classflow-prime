import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, getErrorMessage } from '@/api/axios';
import type { IDeleteAgentResponse } from '../agent.types';

export const deleteAgentThunk = createAsyncThunk<
    IDeleteAgentResponse,
    string,
    { rejectValue: string }
>(
    'agent/delete',
    async (agentId, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.delete<IDeleteAgentResponse>(
                `/agents/${agentId}`,
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