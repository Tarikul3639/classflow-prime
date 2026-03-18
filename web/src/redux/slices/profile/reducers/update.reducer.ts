import { createSlice } from "@reduxjs/toolkit";
import { IRequestStatus } from "../../auth/auth.types";
import { updateProfileThunk } from "../thunks/update.thunk";

export type UpdateProfileState = {
    status: IRequestStatus;
};

export const initialState: UpdateProfileState = {
    status: { loading: false, error: null, message: null },
};

export const updateProfileSlice = createSlice({
    name: "profile/update",
    initialState,
    reducers: {
        clearUpdateStatus: () => initialState,
    },
    extraReducers: (builder) => {
        // update profile
        builder
            .addCase(updateProfileThunk.pending, (state) => {
                state.status.loading = true;
                state.status.error = null;
                state.status.message = null;
            })
            .addCase(updateProfileThunk.fulfilled, (state, action) => {
                state.status.loading = false;
                state.status.message = "Profile updated";
            })
            .addCase(updateProfileThunk.rejected, (state, action) => {
                state.status.loading = false;
                state.status.error = action.payload ?? "Failed to update profile";
            });
    },
});

export const { clearUpdateStatus } = updateProfileSlice.actions;
export default updateProfileSlice.reducer;