import { createSlice } from '@reduxjs/toolkit';

import type { IRequestStatus } from '../../auth/auth.types';
import { fetchAgentsThunk } from '../thunks/fetch-agents.thunk';
import type { IAgent } from '../agent.types';

export type FetchAgentsState = {
    agents: IAgent[];
    status: IRequestStatus;
};

export const initialState: FetchAgentsState = {
    agents: [],
    status: {
        loading: false,
        error: null,
        message: null,
    },
};

export const fetchAgentsSlice = createSlice({
    name: 'agent/fetch',
    initialState,
    reducers: {
        clearFetchAgentsStatus: (state) => {
            state.status = {
                loading: false,
                error: null,
                message: null,
            };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgentsThunk.pending, (state) => {
                state.status.loading = true;
                state.status.error = null;
                state.status.message = null;
            })
            .addCase(fetchAgentsThunk.fulfilled, (state, action) => {
                state.status.loading = false;
                state.status.message = 'Agents loaded';
                state.agents = action.payload;
            })
            .addCase(fetchAgentsThunk.rejected, (state, action) => {
                state.status.loading = false;
                state.status.error = action.payload ?? 'Failed to load agents';
            });
    },
});

export const { clearFetchAgentsStatus } = fetchAgentsSlice.actions;

export default fetchAgentsSlice.reducer;