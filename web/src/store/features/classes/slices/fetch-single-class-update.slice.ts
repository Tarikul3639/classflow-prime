import { createSlice } from "@reduxjs/toolkit";
import { fetchSingleClassUpdate } from "../thunks/fetch-single-class-update.thunk";
import type { ClassUpdateItem } from "@/types/update.types";

interface ClassUpdateDetailState {
    currentUpdate: ClassUpdateItem | null;
    loading: boolean;
    error: string | null;
}

const initialState: ClassUpdateDetailState = {
    currentUpdate: null,
    loading: false,
    error: null,
};

const fetchSingleClassUpdateSlice = createSlice({
    name: "classUpdateDetail",
    initialState,
    reducers: {
        // Optional: A reducer to clear the current update details, if needed
        clearCurrentUpdate: (state) => {
            state.currentUpdate = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSingleClassUpdate.pending, (state) => {
                state.loading = true;
                state.error = null;
                // Previously, we were clearing currentUpdate here, but it's better to keep it until we know the result of the fetch
                // state.currentUpdate = null; 
            })
            .addCase(fetchSingleClassUpdate.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUpdate = action.payload; // Single Object
                state.error = null;
            })
            .addCase(fetchSingleClassUpdate.rejected, (state, action) => {
                state.loading = false;
                state.currentUpdate = null;
                // Use the error message from the rejected action payload, or a default message
                state.error = action.payload?.message || "Failed to fetch the specific update.";
            });
    },
});

export const { clearCurrentUpdate } = fetchSingleClassUpdateSlice.actions;
export default fetchSingleClassUpdateSlice.reducer;