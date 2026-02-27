import { createSlice } from "@reduxjs/toolkit";
import { IAuthState } from "@/redux/slices/auth/types";
import { signInThunk } from "./thunks/signInThunk";
import { signUpThunk } from "./thunks/signUpThunk";
import { logoutThunk } from "./thunks/logoutThunk";
import { verifyAuthThunk } from "./thunks/verifyAuthThunk";
import { deactivateAccountThunk } from "./thunks/deactivateAccountThunk";
import { changePasswordThunk } from "./thunks/changePasswordThunk";
import { profileUpdateThunk } from "./thunks/profileUpdateThunk";

// Initial State
const initialState: IAuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  requestStatus: {
    signIn: { loading: false, error: null },
    signUp: { loading: false, error: null },
    logout: { loading: false, error: null },
    refresh: { loading: false, error: null },
    deactivateAccount: { loading: false, error: null },
    changePassword: { loading: false, error: null },
    profileUpdate: { loading: false, error: null },
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Logout handled in extraReducers
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(signInThunk.pending, (state) => {
        state.requestStatus.signIn.loading = true;
        state.requestStatus.signIn.error = null;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.requestStatus.signIn.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.requestStatus.signIn.loading = false;
        state.requestStatus.signIn.error = action.payload as string;
      });

    // Register
    builder
      .addCase(signUpThunk.pending, (state) => {
        state.requestStatus.signUp.loading = true;
        state.requestStatus.signUp.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.requestStatus.signUp.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.requestStatus.signUp.loading = false;
        state.requestStatus.signUp.error = action.payload as string;
      });

    // Verify Auth (refresh/page load)
    builder
      .addCase(verifyAuthThunk.pending, (state) => {
        state.requestStatus.refresh.loading = true;
        state.requestStatus.refresh.error = null;
      })
      .addCase(verifyAuthThunk.fulfilled, (state, action) => {
        state.requestStatus.refresh.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(verifyAuthThunk.rejected, (state) => {
        state.requestStatus.refresh.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.requestStatus.logout.loading = false;
      state.requestStatus.logout.error = null;
    });
    // Deactivate Account
    builder
      .addCase(deactivateAccountThunk.pending, (state) => {
        state.requestStatus.deactivateAccount.loading = true;
        state.requestStatus.deactivateAccount.error = null;
        state.error = null;
      })
      .addCase(deactivateAccountThunk.fulfilled, (state) => {
        state.requestStatus.deactivateAccount.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(deactivateAccountThunk.rejected, (state, action) => {
        state.requestStatus.deactivateAccount.loading = false;
        state.requestStatus.deactivateAccount.error = action.payload as string;
        state.error = action.payload as string;
      });

    // Change Password
    builder
      .addCase(changePasswordThunk.pending, (state) => {
        state.requestStatus.changePassword.loading = true;
        state.requestStatus.changePassword.error = null;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.requestStatus.changePassword.loading = false;
        state.error = null;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.requestStatus.changePassword.loading = false;
        state.requestStatus.changePassword.error = action.payload as string;
        state.error = action.payload as string;
      });

    // Profile Update
    builder
      .addCase(profileUpdateThunk.pending, (state) => {
        state.requestStatus.profileUpdate.loading = true;
        state.requestStatus.profileUpdate.error = null;
        state.error = null;
      })
      .addCase(profileUpdateThunk.fulfilled, (state, action) => {
        state.requestStatus.profileUpdate.loading = false;
        if (state.user) {
          state.user = {
            ...state.user,
            name: action.payload.name,
            avatarUrl: action.payload.avatarUrl,
          };
        }
        state.error = null;
      })
      .addCase(profileUpdateThunk.rejected, (state, action) => {
        state.requestStatus.profileUpdate.loading = false;
        state.requestStatus.profileUpdate.error = action.payload as string;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
