import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchClassUpdate } from "../thunks/fetch-class-update.thunk";
import { updateClassUpdate } from "../thunks/update-class-update.thunk"; 
import type { ClassUpdateItem } from "@/types/update.types";
import type { ApiError } from "../class.types";

interface ClassUpdatesState {
    updates: ClassUpdateItem[];
    loading: boolean;
    updating: boolean;
    error: ApiError;
}

const initialState: ClassUpdatesState = {
    updates: [],
    loading: false,
    updating: false,
    error: {
        field: null,
        message: null,
    },
};

const classUpdatesSlice = createSlice({
    name: "classUpdates",
    initialState,
    reducers: {
        clearUpdates: (state) => {
            state.updates = [];
            state.error = { field: null, message: null };
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch All Updates ---
            .addCase(fetchClassUpdate.pending, (state) => {
                state.loading = true;
                state.error = { field: null, message: null };
            })
            .addCase(fetchClassUpdate.fulfilled, (state, action) => {
                state.loading = false;
                state.updates = action.payload;
            })
            .addCase(fetchClassUpdate.rejected, (state, action) => {
                state.loading = false;
                state.error = {
                    field: null,
                    message: action.payload?.message || "Failed to fetch class updates.",
                };
            })

            // --- Update (Edit) Class Update ---
            .addCase(updateClassUpdate.pending, (state) => {
                state.updating = true;
                state.error = { field: null, message: null };
            })
            .addCase(updateClassUpdate.fulfilled, (state, action: PayloadAction<ClassUpdateItem>) => {
                state.updating = false;
                // ১. লিস্ট থেকে ইনডেক্স খুঁজে বের করা
                const index = state.updates.findIndex(u => u._id === action.payload._id);

                // ২. যদি খুঁজে পাওয়া যায়, তবে ডাটা আপডেট করে দেওয়া
                if (index !== -1) {
                    state.updates[index] = action.payload;
                }
            })
            .addCase(updateClassUpdate.rejected, (state, action) => {
                state.updating = false;
                state.error = {
                    field: action.payload?.field || null,
                    message: action.payload?.message || "Failed to update the class update.",
                };
            });
    },
});

export const { clearUpdates } = classUpdatesSlice.actions;
export default classUpdatesSlice.reducer;