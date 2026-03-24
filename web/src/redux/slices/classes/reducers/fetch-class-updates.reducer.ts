import { createSlice } from "@reduxjs/toolkit";
import { fetchClassUpdate } from "../thunks/fetch-class-update.thunk";
import type { ClassUpdateItem } from "@/types/update.types";

interface ClassUpdatesState {
    updates: ClassUpdateItem[];
    loading: boolean;
    error: string | null;
}

const initialState: ClassUpdatesState = {
    updates: [],
    loading: false,
    error: null,
};

const classUpdatesSlice = createSlice({
    name: "classUpdates",
    initialState,
    reducers: {
        // Optional: A reducer to clear updates, if needed
        clearUpdates: (state) => {
            state.updates = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClassUpdate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassUpdate.fulfilled, (state, action) => {
                state.loading = false;
                state.updates = action.payload;
            })
            .addCase(fetchClassUpdate.rejected, (state, action) => {
                state.loading = false;
                // Use the error message from the rejected action payload, or a default message
                state.error = action.payload?.message || "Failed to fetch class updates.";
            });
    },
});

export const { clearUpdates } = classUpdatesSlice.actions;
export default classUpdatesSlice.reducer;