import { createSlice } from '@reduxjs/toolkit';

import type { IRequestStatus } from '../../auth/auth.types';
import { deleteAgentThunk } from '../thunks/delete-agent.thunk';

export type DeleteAgentState = {
    status: IRequestStatus;
};

export const initialState: DeleteAgentState = {
    status: {
        loading: false,
        error: null,
        message: null,
    },
};

export const deleteAgentSlice = createSlice({
    name: 'agent/delete',
    initialState,
    reducers: {
        clearDeleteAgentStatus: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteAgentThunk.pending, (state) => {
                state.status.loading = true;
                state.status.error = null;
                state.status.message = null;
            })
            .addCase(deleteAgentThunk.fulfilled, (state, action) => {
                state.status.loading = false;
                state.status.message = action.payload.message;
            })
            .addCase(deleteAgentThunk.rejected, (state, action) => {
                state.status.loading = false;
                state.status.error = action.payload ?? 'Failed to delete agent';
            });
    },
});

export const { clearDeleteAgentStatus } = deleteAgentSlice.actions;

export default deleteAgentSlice.reducer;