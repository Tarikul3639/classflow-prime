import { createSlice } from '@reduxjs/toolkit';

import type { IRequestStatus } from '../../auth/auth.types';
import { createAgentThunk } from '../thunks/create-agent.thunk';
import type { IAgent } from '../agent.types';

export type CreateAgentState = {
    agent: IAgent | null;
    apiKey: string | null;
    status: IRequestStatus;
};

export const initialState: CreateAgentState = {
    agent: null,
    apiKey: null,
    status: {
        loading: false,
        error: null,
        message: null,
    },
};

export const createAgentSlice = createSlice({
    name: 'agent/create',
    initialState,
    reducers: {
        clearCreateAgentStatus: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAgentThunk.pending, (state) => {
                state.status.loading = true;
                state.status.error = null;
                state.status.message = null;
            })
            .addCase(createAgentThunk.fulfilled, (state, action) => {
                state.status.loading = false;
                state.status.message = action.payload.message;
                state.agent = action.payload.data.agent;
                state.apiKey = action.payload.data.agent.apiKey;
            })
            .addCase(createAgentThunk.rejected, (state, action) => {
                state.status.loading = false;
                state.status.error = action.payload ?? 'Failed to create agent';
            });
    },
});

export const { clearCreateAgentStatus } = createAgentSlice.actions;

export default createAgentSlice.reducer;