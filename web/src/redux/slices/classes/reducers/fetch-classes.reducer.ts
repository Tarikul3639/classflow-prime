import { createSlice } from "@reduxjs/toolkit";
import { fetchClasses, IClass } from "../thunks/fetch-classes.thunk";

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

export const fetchClassesSlice = createSlice({
    name: "fetchClasses",
    initialState,
    reducers: {}, // You can keep this empty for now
    extraReducers: (builder) => {
        builder
            .addCase(fetchClasses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Saving to Redux State:", action.payload);
                state.classes = action.payload;
            })
            .addCase(fetchClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch classes";
            });
    },
});

export default fetchClassesSlice.reducer;