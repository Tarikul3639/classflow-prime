import { createSlice } from '@reduxjs/toolkit';
import { IRequestStatus } from '../auth.types';

import {
    signupThunk,
    verifySignupEmailThunk,
    resendSignupVerificationThunk,
} from '../thunks/signup.thunk';

export type AuthSignupStatusState = {
    signup: IRequestStatus;
    verifySignupEmail: IRequestStatus;
    resendSignupVerification: IRequestStatus;
};

export const initialState: AuthSignupStatusState = {
    signup: { loading: false, error: null, message: null },
    verifySignupEmail: { loading: false, error: null, message: null },
    resendSignupVerification: { loading: false, error: null, message: null },
};

export const signupStatusSlice = createSlice({
    name: 'auth/signupStatus',
    initialState,
    reducers: {
        clearSignupStatus: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupThunk.pending, (state) => {
                state.signup.loading = true;
                state.signup.error = null;
                state.signup.message = null;
            })
            .addCase(signupThunk.fulfilled, (state, action) => {
                state.signup.loading = false;
                state.signup.message =
                    action.payload?.message ??
                    'Signup successful. Verification code sent to email.';
            })
            .addCase(signupThunk.rejected, (state, action) => {
                state.signup.loading = false;
                state.signup.error = action.payload ?? 'Signup failed';
            });

        builder
            .addCase(verifySignupEmailThunk.pending, (state) => {
                state.verifySignupEmail.loading = true;
                state.verifySignupEmail.error = null;
                state.verifySignupEmail.message = null;
            })
            .addCase(verifySignupEmailThunk.fulfilled, (state, action) => {
                state.verifySignupEmail.loading = false;
                state.verifySignupEmail.message =
                    action.payload?.message ?? 'Email verified successfully';
            })
            .addCase(verifySignupEmailThunk.rejected, (state, action) => {
                state.verifySignupEmail.loading = false;
                state.verifySignupEmail.error = action.payload ?? 'Verification failed';
            });

        builder
            .addCase(resendSignupVerificationThunk.pending, (state) => {
                state.resendSignupVerification.loading = true;
                state.resendSignupVerification.error = null;
                state.resendSignupVerification.message = null;
            })
            .addCase(resendSignupVerificationThunk.fulfilled, (state, action) => {
                state.resendSignupVerification.loading = false;
                state.resendSignupVerification.message =
                    action.payload?.message ?? 'Verification code resent';
            })
            .addCase(resendSignupVerificationThunk.rejected, (state, action) => {
                state.resendSignupVerification.loading = false;
                state.resendSignupVerification.error = action.payload ?? 'Resend failed';
            });
    },
});

export const { clearSignupStatus } = signupStatusSlice.actions;
export default signupStatusSlice.reducer;