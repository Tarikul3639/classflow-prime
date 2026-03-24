import { createSlice } from "@reduxjs/toolkit";
import { fetchEnrolledClasses, IClass } from "../thunks/fetch-enrolled-classes.thunk";

interface ClassesState {
    classes: IClass[];
    loading: boolean;
    error: string | null;
}

const initialState: ClassesState = {
    classes: [],
    loading: false,
    error: null,
};

export const fetchEnrolledClassesSlice = createSlice({
    name: "fetchEnrolledClasses",
    initialState,
    reducers: {}, // You can keep this empty for now
    extraReducers: (builder) => {
        builder
            .addCase(fetchEnrolledClasses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnrolledClasses.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload;
            })
            .addCase(fetchEnrolledClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch classes";
            });
    },
});

export default fetchEnrolledClassesSlice.reducer;