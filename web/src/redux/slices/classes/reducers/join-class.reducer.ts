import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { joinClass, IJoinResponse } from "../thunks/join-class.thunk";

interface JoinClassState {
    isJoining: boolean;
    success: boolean;
    error: string | null;
    lastJoinedId: string | null;
}

const initialState: JoinClassState = {
    isJoining: false,
    success: false,
    error: null,
    lastJoinedId: null,
};

export const joinClassSlice = createSlice({
    name: "joinClass",
    initialState,
    reducers: {
        // Clear state when closing the Join Modal
        resetJoinState: (state) => {
            state.isJoining = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(joinClass.pending, (state) => {
                state.isJoining = true;
                state.error = null;
                state.success = false;
            })
            .addCase(joinClass.fulfilled, (state, action: PayloadAction<IJoinResponse>) => {
                state.isJoining = false;
                state.success = true;
                state.lastJoinedId = action.payload.data.classId;
                state.error = null;
            })
            .addCase(joinClass.rejected, (state, action) => {
                state.isJoining = false;
                state.success = false;
                state.error = action.payload?.message || "Failed to join class";
            });
    },
});

export const { resetJoinState } = joinClassSlice.actions;
export default joinClassSlice.reducer;