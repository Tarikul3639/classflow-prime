import { createSlice } from "@reduxjs/toolkit";
import { fetchClassUpdate } from "../thunks/fetch-class-update.thunk";
import type { ClassUpdateItem } from "@/types/update.types";
import { togglePinClassUpdate } from "../thunks/toggle-pin-class-update.thunk";

interface ClassUpdatesState {
    updates: ClassUpdateItem[];
    loading: {
        fetch: boolean;
        update: boolean;
        togglePin: boolean;
    };
    error: {
        fetch: string | null;
        update: string | null;
        togglePin: string | null;
    };
}

const initialState: ClassUpdatesState = {
    updates: [],
    loading: {
        fetch: false,
        update: false,
        togglePin: false,
    },
    error: {
        fetch: null,
        update: null,
        togglePin: null,
    },
};

const classUpdatesSlice = createSlice({
    name: "classUpdates",
    initialState,
    reducers: {
        // Optional: A reducer to clear updates, if needed
        clearUpdates: (state) => {
            state.updates = [];
            state.error = { fetch: null, update: null, togglePin: null };
            state.loading = { fetch: false, update: false, togglePin: false };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClassUpdate.pending, (state) => {
                state.loading.fetch = true;
                state.error.fetch = null;
            })
            .addCase(fetchClassUpdate.fulfilled, (state, action) => {
                state.loading.fetch = false;
                state.error.fetch = null;
                state.updates = action.payload;
            })
            .addCase(fetchClassUpdate.rejected, (state, action) => {
                state.loading.fetch = false;
                // Use the error message from the rejected action payload, or a default message
                state.error.fetch = action.payload?.message || "Failed to fetch class updates.";
            })

            // Toggle Pin
            .addCase(togglePinClassUpdate.pending, (state) => {
                state.loading.togglePin = true;
                state.error.togglePin = null;
            })
            .addCase(togglePinClassUpdate.fulfilled, (state, action) => {
                state.loading.togglePin = false;
                state.error.togglePin = null;
                // Update the specific update in the list with the new pinned status
                const index = state.updates.findIndex(u => u._id === action.payload.updateId);
                if (index !== -1) {
                    state.updates[index].isPinned = action.payload.isPinned;
                }
            })
            .addCase(togglePinClassUpdate.rejected, (state, action) => {
                state.loading.togglePin = false;
                state.error.togglePin = action.payload?.message || "Failed to toggle pin status.";
            });
    },
});

export const { clearUpdates } = classUpdatesSlice.actions;
export default classUpdatesSlice.reducer;