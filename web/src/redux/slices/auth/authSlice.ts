import { createSlice } from "@reduxjs/toolkit";
import { tokenManager } from "@/lib/api/token-manager";
import type { IAuthState } from "./types";
import { signInThunk } from "./thunks/signInThunk";
import { signUpThunk } from "./thunks/signUpThunk";
import { signOutThunk } from "./thunks/signOutThunk";
import { getCurrentUserThunk } from "./thunks/getCurrentUserThunk";
import { verifyEmailThunk } from "./thunks/verifyEmailThunk";
import { resendVerificationThunk } from "./thunks/resendVerificationThunk";
import { sendPasswordResetOTPThunk } from "./thunks/sendPasswordResetOTPThunk";
import { verifyPasswordResetOTPThunk } from "./thunks/verifyPasswordResetOTPThunk";
import { resendPasswordResetOTPThunk } from "./thunks/resendPasswordResetOTPThunk"; 
import { resetPasswordThunk } from "./thunks/resetPasswordThunk";

// Initial State
const initialState: IAuthState = {
  user: null,
  isAuthenticated: false,
  requestStatus: {
    signIn: { loading: false, error: null, message: null },
    signUp: { loading: false, error: null, message: null },
    signOut: { loading: false, error: null, message: null },
    getCurrentUser: { loading: false, error: null, message: null },
    verifyEmail: { loading: false, error: null, message: null },
    resendVerification: { loading: false, error: null, message: null },
    sendPasswordResetOTP: { loading: false, error: null, message: null },
    resendPasswordResetOTP: { loading: false, error: null, message: null },
    verifyPasswordResetOTP: { loading: false, error: null, message: null },
    resetPassword: { loading: false, error: null, message: null },
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state, action: { payload: keyof IAuthState["requestStatus"] }) {
      state.requestStatus[action.payload].error = null;
    },
    clearAllErrors(state) {
      Object.keys(state.requestStatus).forEach((key) => {
        state.requestStatus[key as keyof typeof state.requestStatus].error = null;
      });
    },
    signOut(state) {
      state.user = null;
      state.isAuthenticated = false;
      tokenManager.clearTokens();
    },
  },
  extraReducers: (builder) => {
    // ==================== SIGN IN ====================
    builder
      .addCase(signInThunk.pending, (state) => {
        state.requestStatus.signIn.loading = true;
        state.requestStatus.signIn.error = null;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.requestStatus.signIn.loading = false;
        state.requestStatus.signIn.error = null;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.requestStatus.signIn.loading = false;
        state.requestStatus.signIn.error = action.payload as string;
      });

    // ==================== SIGN UP ====================
    builder
      .addCase(signUpThunk.pending, (state) => {
        state.requestStatus.signUp.loading = true;
        state.requestStatus.signUp.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.requestStatus.signUp.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.requestStatus.signUp.error = null;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.requestStatus.signUp.loading = false;
        state.requestStatus.signUp.error = action.payload as string;
      });

    // ==================== SIGN OUT ====================
    builder
      .addCase(signOutThunk.pending, (state) => {
        state.requestStatus.signOut.loading = true;
        state.requestStatus.signOut.error = null;
      })
      .addCase(signOutThunk.fulfilled, (state) => {
        state.requestStatus.signOut.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(signOutThunk.rejected, (state, action) => {
        state.requestStatus.signOut.loading = false;
        state.requestStatus.signOut.error = action.payload as string;
        state.user = null;
        state.isAuthenticated = false;
      });

    // ==================== GET CURRENT USER ====================
    builder
      .addCase(getCurrentUserThunk.pending, (state) => {
        state.requestStatus.getCurrentUser.loading = true;
        state.requestStatus.getCurrentUser.error = null;
      })
      .addCase(getCurrentUserThunk.fulfilled, (state, action) => {
        state.requestStatus.getCurrentUser.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUserThunk.rejected, (state, action) => {
        state.requestStatus.getCurrentUser.loading = false;
        state.requestStatus.getCurrentUser.error = action.payload as string;
        state.user = null;
        state.isAuthenticated = false;
      });

    // ==================== VERIFY EMAIL ====================
    builder
      .addCase(verifyEmailThunk.pending, (state) => {
        state.requestStatus.verifyEmail.loading = true;
        state.requestStatus.verifyEmail.error = null;
      })
      .addCase(verifyEmailThunk.fulfilled, (state, action) => {
        state.requestStatus.verifyEmail.loading = false;
        state.user = action.payload;
      })
      .addCase(verifyEmailThunk.rejected, (state, action) => {
        state.requestStatus.verifyEmail.loading = false;
        state.requestStatus.verifyEmail.error = action.payload as string;
      });

    // ==================== RESEND VERIFICATION ====================
    builder
      .addCase(resendVerificationThunk.pending, (state) => {
        state.requestStatus.resendVerification.loading = true;
        state.requestStatus.resendVerification.error = null;
      })
      .addCase(resendVerificationThunk.fulfilled, (state) => {
        state.requestStatus.resendVerification.loading = false;
      })
      .addCase(resendVerificationThunk.rejected, (state, action) => {
        state.requestStatus.resendVerification.loading = false;
        state.requestStatus.resendVerification.error = action.payload as string;
      });

    // ==================== SEND PASSWORD RESET OTP ====================
    builder
      .addCase(sendPasswordResetOTPThunk.pending, (state) => {
        state.requestStatus.sendPasswordResetOTP.loading = true;
        state.requestStatus.sendPasswordResetOTP.error = null;
      })
      .addCase(sendPasswordResetOTPThunk.fulfilled, (state) => {
        state.requestStatus.sendPasswordResetOTP.loading = false;
      })
      .addCase(sendPasswordResetOTPThunk.rejected, (state, action) => {
        state.requestStatus.sendPasswordResetOTP.loading = false;
        state.requestStatus.sendPasswordResetOTP.error = action.payload as string;
      });

    // ==================== VERIFY PASSWORD RESET OTP ====================
    builder
      .addCase(verifyPasswordResetOTPThunk.pending, (state) => {
        state.requestStatus.verifyPasswordResetOTP.loading = true;
        state.requestStatus.verifyPasswordResetOTP.error = null;
      })
      .addCase(verifyPasswordResetOTPThunk.fulfilled, (state) => {
        state.requestStatus.verifyPasswordResetOTP.loading = false;
      })
      .addCase(verifyPasswordResetOTPThunk.rejected, (state, action) => {
        state.requestStatus.verifyPasswordResetOTP.loading = false;
        state.requestStatus.verifyPasswordResetOTP.error = action.payload as string;
      });

    // ==================== RESET PASSWORD ====================
    builder
      .addCase(resetPasswordThunk.pending, (state) => {
        state.requestStatus.resetPassword.loading = true;
        state.requestStatus.resetPassword.error = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.requestStatus.resetPassword.loading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.requestStatus.resetPassword.loading = false;
        state.requestStatus.resetPassword.error = action.payload as string;
      });
  },
});

export const { clearError, clearAllErrors, signOut } = authSlice.actions;
export default authSlice.reducer;