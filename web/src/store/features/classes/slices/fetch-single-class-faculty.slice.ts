import { createSlice } from "@reduxjs/toolkit";
import {
    fetchSingleClassFaculty,
} from "../thunks/fetch-single-class-faculty.thunk";
import type { ClassFaculty } from "../thunks/class-faculty.thunk";
import { updateSingleClassFaculty } from "../thunks/update-single-class-faculty.thunk";

interface FetchSingleClassFacultyState {
    faculty: ClassFaculty | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: FetchSingleClassFacultyState = {
    faculty: null,
    isLoading: false,
    error: null,
};

const fetchSingleClassFacultySlice = createSlice({
    name: "fetchSingleClassFaculty",
    initialState,
    reducers: {
        // Optional: A reducer to clear the current faculty details, if needed
        clearCurrentFaculty: (state) => {
            state.faculty = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSingleClassFaculty.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                // Previously, we were clearing faculty here, but it's better to keep it until we know the result of the fetch
                // state.faculty = null; 
            })
            .addCase(fetchSingleClassFaculty.fulfilled, (state, action) => {
                state.isLoading = false;
                state.faculty = action.payload; // Single Object
                state.error = null;
            })
            .addCase(fetchSingleClassFaculty.rejected, (state, action) => {
                state.isLoading = false;
                state.faculty = null;
                // Use the error message from the rejected action payload, or a default message
                state.error = action.payload || "Failed to fetch the specific faculty.";
            });
    },
});

export const { clearCurrentFaculty } = fetchSingleClassFacultySlice.actions;
export default fetchSingleClassFacultySlice.reducer;