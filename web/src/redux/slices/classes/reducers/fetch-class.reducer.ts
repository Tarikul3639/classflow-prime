import { createSlice } from "@reduxjs/toolkit";
import { IClassDetails } from "../thunks/fetch-class.thunk";
import { fetchClass } from "../thunks/fetch-class.thunk";

interface FetchClassState {
    classDetails: IClassDetails | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: FetchClassState = {
    classDetails: {
        classId: "",
        department: "",
        title: "",
        members: 0,
        instructor: "",
        semester: "",
        themeColor: "#3B82F6",
        coverImage: "",
        avatarUrl: null,
        status: "active",
    },
    isLoading: false,
    error: null,
};
const fetchClassSlice = createSlice({
    name: "fetchClass",
    initialState,
    reducers: {
        // reset state when closing the Class Details Modal
        resetClassDetailsState: (state) => {
            state.classDetails = null;
            state.isLoading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClass.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.classDetails = null;
            })
            .addCase(fetchClass.fulfilled, (state, action) => {
                state.isLoading = false;
                state.classDetails = action.payload;
                state.error = null;
            })
            .addCase(fetchClass.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || "Failed to fetch class details";
                state.classDetails = null;
            });
    },
});

export const { resetClassDetailsState } = fetchClassSlice.actions;
export default fetchClassSlice.reducer;