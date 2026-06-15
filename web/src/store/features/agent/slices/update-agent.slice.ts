import { createSlice } from '@reduxjs/toolkit';

import type { IRequestStatus } from '../../auth/auth.types';
import { updateAgentThunk } from '../thunks/update-agent.thunk';

export type UpdateAgentState = {
    status: IRequestStatus;
};

export const initialState: UpdateAgentState = {
    status: {
        loading: false,
        error: null,
        message: null,
    },
};

export const updateAgentSlice = createSlice({
    name: 'agent/update',
    initialState,
    reducers: {
        clearUpdateAgentStatus: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateAgentThunk.pending, (state) => {
                state.status.loading = true;
                state.status.error = null;
                state.status.message = null;
            })
            .addCase(updateAgentThunk.fulfilled, (state, action) => {
                state.status.loading = false;
                state.status.message = action.payload.message;
            })
            .addCase(updateAgentThunk.rejected, (state, action) => {
                state.status.loading = false;
                state.status.error = action.payload ?? 'Failed to update agent';
            });
    },
});

export const { clearUpdateAgentStatus } = updateAgentSlice.actions;

export default updateAgentSlice.reducer;