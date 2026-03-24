import { createSlice } from '@reduxjs/toolkit';
import { SignInThunk } from '../thunks/signin.thunks';
import { IRequestStatus } from '../auth.types';

export interface SignInState {
    status: IRequestStatus;
}

const initialState: SignInState = {
    status: { loading: false, error: null, message: null },
};

export const signInSlice = createSlice({
    name: 'auth/signIn',
    initialState,
    reducers: {
        resetSignInStatus: (state) => {
            state.status = initialState.status;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(SignInThunk.pending, (state) => {
                state.status.loading = true;
                state.status.error = null;
                state.status.message = null;
            })
            .addCase(SignInThunk.fulfilled, (state, action) => {
                state.status.loading = false;
                state.status.message = action.payload?.message ?? "Logged in successfully";
            })
            .addCase(SignInThunk.rejected, (state, action) => {
                state.status.loading = false;
                state.status.error = (action.payload as string) ?? 'Sign in failed';
            });
    },
});

export const { resetSignInStatus } = signInSlice.actions;
export default signInSlice.reducer;