import { createSlice } from '@reduxjs/toolkit';
import { IRequestStatus } from '../auth.types';
import { signoutAllThunk, signoutCurrentThunk } from '../thunks/signout.thunk';

export interface SignOutState {
    signoutCurrent: IRequestStatus;
    signoutAll: IRequestStatus;
}

const initialState: SignOutState = {
    signoutCurrent: { loading: false, error: null, message: null },
    signoutAll: { loading: false, error: null, message: null },
};

export const signOutSlice = createSlice({
    name: 'auth/signOut',
    initialState,
    reducers: {
        resetSignOutStatus: () => initialState,
    },
    extraReducers: (builder) => {
        // Signout Current
        builder
            .addCase(signoutCurrentThunk.pending, (state) => {
                state.signoutCurrent.loading = true;
                state.signoutCurrent.error = null;
                state.signoutCurrent.message = null;
            })
            .addCase(signoutCurrentThunk.fulfilled, (state, action) => {
                state.signoutCurrent.loading = false;
                state.signoutCurrent.message = action.payload?.message ?? 'Signed out';
            })
            .addCase(signoutCurrentThunk.rejected, (state, action) => {
                state.signoutCurrent.loading = false;
                state.signoutCurrent.error = (action.payload as string) ?? 'Signout failed';
            });

        // Signout All
        builder
            .addCase(signoutAllThunk.pending, (state) => {
                state.signoutAll.loading = true;
                state.signoutAll.error = null;
                state.signoutAll.message = null;
            })
            .addCase(signoutAllThunk.fulfilled, (state, action) => {
                state.signoutAll.loading = false;
                state.signoutAll.message = action.payload?.message ?? 'Signed out from all devices';
            })
            .addCase(signoutAllThunk.rejected, (state, action) => {
                state.signoutAll.loading = false;
                state.signoutAll.error = (action.payload as string) ?? 'Signout failed';
            });
    },
});

export const { resetSignOutStatus } = signOutSlice.actions;
export default signOutSlice.reducer;