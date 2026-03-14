import { createSlice } from '@reduxjs/toolkit';
import { IRequestStatus } from '../auth.types';

import {
  requestPasswordResetThunk,
  verifyCodePasswordResetThunk,
  resendCodePasswordResetThunk,
  confirmNewPasswordPasswordResetThunk,
} from '../thunks/password-reset.thunk';

export type AuthPasswordResetStatusState = {
  requestPasswordReset: IRequestStatus;
  verifyCodePasswordReset: IRequestStatus;
  resendCodePasswordReset: IRequestStatus;
  confirmNewPasswordPasswordReset: IRequestStatus;
};

export const initialState: AuthPasswordResetStatusState = {
  requestPasswordReset: { loading: false, error: null, message: null },
  verifyCodePasswordReset: { loading: false, error: null, message: null },
  resendCodePasswordReset: { loading: false, error: null, message: null },
  confirmNewPasswordPasswordReset: { loading: false, error: null, message: null },
};

export const passwordResetStatusSlice = createSlice({
  name: 'auth/passwordResetStatus',
  initialState,
  reducers: {
    clearPasswordResetStatus: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestPasswordResetThunk.pending, (state) => {
        state.requestPasswordReset.loading = true;
        state.requestPasswordReset.error = null;
        state.requestPasswordReset.message = null;
      })
      .addCase(requestPasswordResetThunk.fulfilled, (state, action) => {
        state.requestPasswordReset.loading = false;
        state.requestPasswordReset.message =
          action.payload?.message ?? 'Reset code sent';
      })
      .addCase(requestPasswordResetThunk.rejected, (state, action) => {
        state.requestPasswordReset.loading = false;
        state.requestPasswordReset.error = action.payload ?? 'Request failed';
      });

    builder
      .addCase(verifyCodePasswordResetThunk.pending, (state) => {
        state.verifyCodePasswordReset.loading = true;
        state.verifyCodePasswordReset.error = null;
        state.verifyCodePasswordReset.message = null;
      })
      .addCase(verifyCodePasswordResetThunk.fulfilled, (state, action) => {
        state.verifyCodePasswordReset.loading = false;
        state.verifyCodePasswordReset.message =
          action.payload?.message ?? 'Code verified';
      })
      .addCase(verifyCodePasswordResetThunk.rejected, (state, action) => {
        state.verifyCodePasswordReset.loading = false;
        state.verifyCodePasswordReset.error = action.payload ?? 'Verify failed';
      });

    builder
      .addCase(resendCodePasswordResetThunk.pending, (state) => {
        state.resendCodePasswordReset.loading = true;
        state.resendCodePasswordReset.error = null;
        state.resendCodePasswordReset.message = null;
      })
      .addCase(resendCodePasswordResetThunk.fulfilled, (state, action) => {
        state.resendCodePasswordReset.loading = false;
        state.resendCodePasswordReset.message =
          action.payload?.message ?? 'Reset code resent';
      })
      .addCase(resendCodePasswordResetThunk.rejected, (state, action) => {
        state.resendCodePasswordReset.loading = false;
        state.resendCodePasswordReset.error = action.payload ?? 'Resend failed';
      });

    builder
      .addCase(confirmNewPasswordPasswordResetThunk.pending, (state) => {
        state.confirmNewPasswordPasswordReset.loading = true;
        state.confirmNewPasswordPasswordReset.error = null;
        state.confirmNewPasswordPasswordReset.message = null;
      })
      .addCase(confirmNewPasswordPasswordResetThunk.fulfilled, (state, action) => {
        state.confirmNewPasswordPasswordReset.loading = false;
        state.confirmNewPasswordPasswordReset.message =
          action.payload?.message ?? 'Password reset successful';
      })
      .addCase(confirmNewPasswordPasswordResetThunk.rejected, (state, action) => {
        state.confirmNewPasswordPasswordReset.loading = false;
        state.confirmNewPasswordPasswordReset.error = action.payload ?? 'Reset failed';
      });
  },
});

export const { clearPasswordResetStatus } = passwordResetStatusSlice.actions;
export default passwordResetStatusSlice.reducer;