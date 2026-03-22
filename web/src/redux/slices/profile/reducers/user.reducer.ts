import { createSlice } from "@reduxjs/toolkit";
import { IRequestStatus } from "../../auth/auth.types";
import { meThunk } from "../thunks/user.thunk";

import { IUser } from "../profile.types";
import { updateProfileThunk } from "../thunks/update.thunk";

export type MeState = {
    user: IUser | null;
    status: IRequestStatus;
};

export const initialState: MeState = {
    user: null,
    status: { loading: false, error: null, message: null },
};

export const userSlice = createSlice({
    name: "profile/me",
    initialState,
    reducers: {
        clearMeStatus: () => initialState,
    },
    extraReducers: (builder) => {
        // me
        builder
            .addCase(meThunk.pending, (state) => {
                state.status.loading = true;
                state.status.error = null;
                state.status.message = null;
            })
            .addCase(meThunk.fulfilled, (state, action) => {
                state.status.loading = false;
                state.status.message = "User loaded";
                state.user = action.payload;
            })
            .addCase(updateProfileThunk.fulfilled, (state, action) => {
                state.status.loading = false;
                state.status.message = "Profile updated";
                if (state.user) {
                    state.user.name = action.payload.data.user.name;
                    state.user.email = action.payload.data.user.email;
                    state.user.bio = action.payload.data.user.bio;
                    state.user.avatarUrl = action.payload.data.user.avatarUrl;
                } // Update user data with the updated profile
            })
            .addCase(meThunk.rejected, (state, action) => {
                state.status.loading = false;
                state.status.error = action.payload ?? "Failed to load user";
            });
    },
});

export const { clearMeStatus } = userSlice.actions;
export default userSlice.reducer;
