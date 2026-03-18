import { createSlice } from '@reduxjs/toolkit';

import { SignInThunk } from '../thunks/signin.thunks';
import { IRequestStatus } from '../auth.types';
import { signoutAllThunk, signoutCurrentThunk } from '../thunks/signout.thunk';

export type AuthSessionStatusState = {
    signIn: IRequestStatus;
    signoutCurrent: IRequestStatus;
    signoutAll: IRequestStatus;
};

export const initialState: AuthSessionStatusState = {
    signIn: { loading: false, error: null, message: null },
    signoutCurrent: { loading: false, error: null, message: null },
    signoutAll: { loading: false, error: null, message: null },
};

export const sessionStatusSlice = createSlice({
    name: 'auth/sessionStatus',
    initialState,
    reducers: {
        clearSessionStatus: () => initialState,
    },
    extraReducers: (builder) => {
        // signIn
        builder
            .addCase(SignInThunk.pending, (state) => {
                state.signIn.loading = true;
                state.signIn.error = null;
                state.signIn.message = null;
            })
            .addCase(SignInThunk.fulfilled, (state, action) => {
                state.signIn.loading = false;
                state.signIn.message = action.payload?.message ?? null;
            })
            .addCase(SignInThunk.rejected, (state, action) => {
                state.signIn.loading = false;
                state.signIn.error = action.payload ?? 'Sign in failed';
            });

        // signout current
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
                state.signoutCurrent.error = action.payload ?? 'Signout failed';
            });

        // signout all
        builder
            .addCase(signoutAllThunk.pending, (state) => {
                state.signoutAll.loading = true;
                state.signoutAll.error = null;
                state.signoutAll.message = null;
            })
            .addCase(signoutAllThunk.fulfilled, (state, action) => {
                state.signoutAll.loading = false;
                state.signoutAll.message =
                    action.payload?.message ?? 'Signed out from all devices';
            })
            .addCase(signoutAllThunk.rejected, (state, action) => {
                state.signoutAll.loading = false;
                state.signoutAll.error = action.payload ?? 'Signout failed';
            });
    },
});

export const { clearSessionStatus } = sessionStatusSlice.actions;
export default sessionStatusSlice.reducer;