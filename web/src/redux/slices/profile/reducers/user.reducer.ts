import { createSlice } from "@reduxjs/toolkit";
import { IRequestStatus } from "../../auth/auth.types";
import { meThunk } from "../thunks/me.thunk";
import { IUser } from "../profile.types";

export type MeState = {
    user: IUser | null;
    status: IRequestStatus;
};

export const initialState: MeState = {
    user: null,
    status: { loading: false, error: null, message: null },
};

export const meSlice = createSlice({
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
            .addCase(meThunk.rejected, (state, action) => {
                state.status.loading = false;
                state.status.error = action.payload ?? "Failed to load user";
            });
    },
});

export const { clearMeStatus } = meSlice.actions;
export default meSlice.reducer;
