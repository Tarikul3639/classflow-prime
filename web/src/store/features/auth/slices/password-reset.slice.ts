import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  requestPasswordResetThunk,
  verifyCodePasswordResetThunk,
  resendCodePasswordResetThunk,
  confirmNewPasswordPasswordResetThunk,
} from "../thunks/password-reset.thunk";

export type ForgotPasswordStep = "email" | "otp" | "password" | "success";

export interface IRequestStatus {
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialStatus: IRequestStatus = {
  loading: false,
  error: null,
  message: null,
};

export interface AuthPasswordResetState {
  currentStep: ForgotPasswordStep;
  email: string;
  resetToken: string | null;
  // Individual Statuses
  requestStatus: IRequestStatus;
  verifyStatus: IRequestStatus;
  resendStatus: IRequestStatus;
  confirmStatus: IRequestStatus;
}

export const initialState: AuthPasswordResetState = {
  currentStep: "email",
  email: "",
  resetToken: null,
  requestStatus: { ...initialStatus },
  verifyStatus: { ...initialStatus },
  resendStatus: { ...initialStatus },
  confirmStatus: { ...initialStatus },
};

export const passwordResetSlice = createSlice({
  name: "auth/passwordReset",
  initialState,
  reducers: {
    setResetEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    goToStep: (state, action: PayloadAction<ForgotPasswordStep>) => {
      state.currentStep = action.payload;
    },
    clearPasswordResetStatus: (state) => {
      state.requestStatus = { ...initialStatus };
      state.verifyStatus = { ...initialStatus };
      state.resendStatus = { ...initialStatus };
      state.confirmStatus = { ...initialStatus };
    },
    resetForgotPasswordFlow: () => initialState,
  },
  extraReducers: (builder) => {
    // Request Code
    builder
      .addCase(requestPasswordResetThunk.pending, (state) => {
        state.requestStatus.loading = true;
        state.requestStatus.error = null;
      })
      .addCase(requestPasswordResetThunk.fulfilled, (state, action) => {
        state.requestStatus.loading = false;
        state.requestStatus.message = action.payload.message;
        state.currentStep = "otp";
      })
      .addCase(requestPasswordResetThunk.rejected, (state, action) => {
        state.requestStatus.loading = false;
        state.requestStatus.error = action.payload as string;
      });

    // Verify OTP
    builder
      .addCase(verifyCodePasswordResetThunk.pending, (state) => {
        state.verifyStatus.loading = true;
        state.verifyStatus.error = null;
      })
      .addCase(verifyCodePasswordResetThunk.fulfilled, (state, action) => {
        state.verifyStatus.loading = false;
        state.resetToken = action.payload.data.resetToken; // Note: resetToken from backend to be used in confirm step
        state.currentStep = "password";
      })
      .addCase(verifyCodePasswordResetThunk.rejected, (state, action) => {
        state.verifyStatus.loading = false;
        state.verifyStatus.error = action.payload as string;
      });

    // Resend OTP
    builder
      .addCase(resendCodePasswordResetThunk.pending, (state) => {
        state.resendStatus.loading = true;
        state.resendStatus.error = null;
      })
      .addCase(resendCodePasswordResetThunk.fulfilled, (state, action) => {
        state.resendStatus.loading = false;
        state.resendStatus.message = action.payload.message;
      })
      .addCase(resendCodePasswordResetThunk.rejected, (state, action) => {
        state.resendStatus.loading = false;
        state.resendStatus.error = action.payload as string;
      });

    // Confirm Password
    builder
      .addCase(confirmNewPasswordPasswordResetThunk.pending, (state) => {
        state.confirmStatus.loading = true;
        state.confirmStatus.error = null;
      })
      .addCase(confirmNewPasswordPasswordResetThunk.fulfilled, (state) => {
        state.confirmStatus.loading = false;
        state.currentStep = "success";
      })
      .addCase(
        confirmNewPasswordPasswordResetThunk.rejected,
        (state, action) => {
          state.confirmStatus.loading = false;
          state.confirmStatus.error = action.payload as string;
        },
      );
  },
});

export const {
  setResetEmail,
  goToStep,
  clearPasswordResetStatus,
  resetForgotPasswordFlow,
} = passwordResetSlice.actions;
export default passwordResetSlice.reducer;
