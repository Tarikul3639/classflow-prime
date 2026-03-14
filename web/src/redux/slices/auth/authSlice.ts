import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { User } from './types';

import { SignInThunk } from './thunks/signin.thunks';
import { meThunk } from './thunks/me.thunk';
import { signoutAllThunk, signoutCurrentThunk } from './thunks/signout.thunk';

import {
  signupThunk,
  verifySignupEmailThunk,
  resendSignupVerificationThunk,
} from './thunks/signup.thunk';

import {
  requestPasswordResetThunk,
  verifyPasswordResetThunk,
  resendPasswordResetThunk,
  confirmPasswordResetThunk,
} from './thunks/password-reset.thunk';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;

  loading: boolean;
  error: string | null;

  // flows
  signup: {
    loading: boolean;
    error: string | null;
    emailForVerification: string | null;
    lastAction: 'idle' | 'signup' | 'verify' | 'resend';
  };

  passwordReset: {
    loading: boolean;
    error: string | null;
    emailForReset: string | null;
    isCodeVerified: boolean;
    lastAction: 'idle' | 'request' | 'verify' | 'resend' | 'confirm';
  };
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,

  loading: false,
  error: null,

  signup: {
    loading: false,
    error: null,
    emailForVerification: null,
    lastAction: 'idle',
  },

  passwordReset: {
    loading: false,
    error: null,
    emailForReset: null,
    isCodeVerified: false,
    lastAction: 'idle',
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    clearSignupState(state) {
      state.signup.loading = false;
      state.signup.error = null;
      state.signup.emailForVerification = null;
      state.signup.lastAction = 'idle';
    },
    clearPasswordResetState(state) {
      state.passwordReset.loading = false;
      state.passwordReset.error = null;
      state.passwordReset.emailForReset = null;
      state.passwordReset.isCodeVerified = false;
      state.passwordReset.lastAction = 'idle';
    },
    hardResetAuth(state) {
      state.user = null;
      state.isAuthenticated = false;

      state.loading = false;
      state.error = null;

      state.signup = {
        loading: false,
        error: null,
        emailForVerification: null,
        lastAction: 'idle',
      };

      state.passwordReset = {
        loading: false,
        error: null,
        emailForReset: null,
        isCodeVerified: false,
        lastAction: 'idle',
      };
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // -------------------------
    // SIGNIN
    // -------------------------
    builder.addCase(SignInThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(SignInThunk.fulfilled, (state, action: any) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    });
    builder.addCase(SignInThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload ?? 'Sign in failed';
      state.user = null;
      state.isAuthenticated = false;
    });

    // -------------------------
    // ME
    // -------------------------
    builder.addCase(meThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(meThunk.fulfilled, (state, action: any) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(meThunk.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload ?? 'Failed to load user';
      state.user = null;
      state.isAuthenticated = false;
    });

    // -------------------------
    // SIGNOUT
    // -------------------------
    builder.addCase(signoutCurrentThunk.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(signoutAllThunk.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    });

    // -------------------------
    // SIGNUP FLOW
    // -------------------------
    builder.addCase(signupThunk.pending, (state, action) => {
      state.signup.loading = true;
      state.signup.error = null;
      state.signup.lastAction = 'signup';

      // store email for verification screen (if present)
      const email = (action.meta.arg as any)?.email;
      if (typeof email === 'string') {
        state.signup.emailForVerification = email;
      }
    });
    builder.addCase(signupThunk.fulfilled, (state) => {
      state.signup.loading = false;
    });
    builder.addCase(signupThunk.rejected, (state, action: any) => {
      state.signup.loading = false;
      state.signup.error = action.payload ?? 'Signup failed';
    });

    builder.addCase(verifySignupEmailThunk.pending, (state) => {
      state.signup.loading = true;
      state.signup.error = null;
      state.signup.lastAction = 'verify';
    });
    builder.addCase(verifySignupEmailThunk.fulfilled, (state, action: any) => {
      state.signup.loading = false;

      // if backend returns user, set it
      const user = action.payload?.user;
      if (user) {
        state.user = user;
        state.isAuthenticated = true;
      }
    });
    builder.addCase(verifySignupEmailThunk.rejected, (state, action: any) => {
      state.signup.loading = false;
      state.signup.error = action.payload ?? 'Verification failed';
    });

    builder.addCase(resendSignupVerificationThunk.pending, (state) => {
      state.signup.loading = true;
      state.signup.error = null;
      state.signup.lastAction = 'resend';
    });
    builder.addCase(resendSignupVerificationThunk.fulfilled, (state) => {
      state.signup.loading = false;
    });
    builder.addCase(resendSignupVerificationThunk.rejected, (state, action: any) => {
      state.signup.loading = false;
      state.signup.error = action.payload ?? 'Resend failed';
    });

    // -------------------------
    // PASSWORD RESET FLOW
    // -------------------------
    builder.addCase(requestPasswordResetThunk.pending, (state, action) => {
      state.passwordReset.loading = true;
      state.passwordReset.error = null;
      state.passwordReset.lastAction = 'request';

      const email = (action.meta.arg as any)?.email;
      if (typeof email === 'string') {
        state.passwordReset.emailForReset = email;
      }

      // reset verify flag when requesting again
      state.passwordReset.isCodeVerified = false;
    });
    builder.addCase(requestPasswordResetThunk.fulfilled, (state) => {
      state.passwordReset.loading = false;
    });
    builder.addCase(requestPasswordResetThunk.rejected, (state, action: any) => {
      state.passwordReset.loading = false;
      state.passwordReset.error = action.payload ?? 'Request failed';
    });

    builder.addCase(verifyPasswordResetThunk.pending, (state) => {
      state.passwordReset.loading = true;
      state.passwordReset.error = null;
      state.passwordReset.lastAction = 'verify';
    });
    builder.addCase(verifyPasswordResetThunk.fulfilled, (state) => {
      state.passwordReset.loading = false;
      state.passwordReset.isCodeVerified = true;
    });
    builder.addCase(verifyPasswordResetThunk.rejected, (state, action: any) => {
      state.passwordReset.loading = false;
      state.passwordReset.error = action.payload ?? 'Verify failed';
      state.passwordReset.isCodeVerified = false;
    });

    builder.addCase(resendPasswordResetThunk.pending, (state) => {
      state.passwordReset.loading = true;
      state.passwordReset.error = null;
      state.passwordReset.lastAction = 'resend';
    });
    builder.addCase(resendPasswordResetThunk.fulfilled, (state) => {
      state.passwordReset.loading = false;
    });
    builder.addCase(resendPasswordResetThunk.rejected, (state, action: any) => {
      state.passwordReset.loading = false;
      state.passwordReset.error = action.payload ?? 'Resend failed';
    });

    builder.addCase(confirmPasswordResetThunk.pending, (state) => {
      state.passwordReset.loading = true;
      state.passwordReset.error = null;
      state.passwordReset.lastAction = 'confirm';
    });
    builder.addCase(confirmPasswordResetThunk.fulfilled, (state) => {
      state.passwordReset.loading = false;

      // After reset, user should re-login
      state.user = null;
      state.isAuthenticated = false;

      // clear flow state
      state.passwordReset.emailForReset = null;
      state.passwordReset.isCodeVerified = false;
    });
    builder.addCase(confirmPasswordResetThunk.rejected, (state, action: any) => {
      state.passwordReset.loading = false;
      state.passwordReset.error = action.payload ?? 'Reset failed';
    });
  },
});

export const {
  clearAuthError,
  clearSignupState,
  clearPasswordResetState,
  hardResetAuth,
  setUser,
} = authSlice.actions;

export default authSlice.reducer;