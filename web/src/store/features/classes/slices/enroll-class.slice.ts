import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enrollClass, IEnrollResponse } from "../thunks/enroll-class.thunk";

interface EnrollClassState {
    isEnrolling: boolean;
    success: boolean;
    error: string | null;
    lastEnrolledId: string | null;
}

const initialState: EnrollClassState = {
    isEnrolling: false,
    success: false,
    error: null,
    lastEnrolledId: null,
};

export const enrollClassSlice = createSlice({
    name: "enrollClass",
    initialState,
    reducers: {
        // Clear state when closing the Enroll Modal
        resetEnrollState: (state) => {
            state.isEnrolling = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(enrollClass.pending, (state) => {
                state.isEnrolling = true;
                state.error = null;
                state.success = false;
            })
            .addCase(enrollClass.fulfilled, (state, action: PayloadAction<IEnrollResponse>) => {
                state.isEnrolling = false;
                state.success = true;
                state.lastEnrolledId = action.payload.data.classId;
                state.error = null;
            })
            .addCase(enrollClass.rejected, (state, action) => {
                state.isEnrolling = false;
                state.success = false;
                state.error = action.payload?.message || "Failed to enroll class";
            });
    },
});

export const { resetEnrollState } = enrollClassSlice.actions;
export default enrollClassSlice.reducer;