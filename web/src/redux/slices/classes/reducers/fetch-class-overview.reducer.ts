import { createSlice } from "@reduxjs/toolkit";
import { fetchClassOverview } from "../thunks/fetch-class-overview.thunk";

interface ClassOverviewState {
    data: {
        classId: string;
        about: string | null;
        studentsCount: number;
        eventsCount: number;
    } | null;
    loading: boolean;
    error: string | null;
}

const initialState: ClassOverviewState = {
    data: null,
    loading: false,
    error: null,
};

const classOverviewSlice = createSlice({
    name: "classOverview",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchClassOverview.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClassOverview.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchClassOverview.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload?.message || "Failed to fetch class overview.";
            });
    },
});

export default classOverviewSlice.reducer;
