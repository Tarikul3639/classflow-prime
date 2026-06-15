import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient, getErrorMessage } from '@/api/axios';
import type { IUpdateAgentRequest, IUpdateAgentResponse } from '../agent.types';

interface UpdatePayload {
    agentId: string;
    body: IUpdateAgentRequest;
}

export const updateAgentThunk = createAsyncThunk<
    IUpdateAgentResponse,
    UpdatePayload,
    { rejectValue: string }
>(
    'agent/update',
    async (payload, { rejectWithValue }) => {
        try {
            const { data } = await apiClient.patch<IUpdateAgentResponse>(
                `/agents/${payload.agentId}`,
                payload.body,
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