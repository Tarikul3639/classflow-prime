import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createClassFaculty,
    deleteClassFaculty,
    fetchClassFaculties,
} from "../thunks/class-faculty.thunk";
import type { ClassFaculty } from "../class.types";
import { updateSingleClassFaculty } from "../thunks/update-single-class-faculty.thunk";
import { fetchSingleClassFaculty } from "../thunks/fetch-single-class-faculty.thunk";

// ─── Bucket Structure ─────────────────────────────────────────────────────────
interface ClassFacultyBucket {
    faculties: ClassFaculty[];
    loading: {
        fetch: boolean;
        fetchSingle: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
    };
    error: {
        fetch: string | null;
        fetchSingle: string | null;
        create: string | null;
        update: string | null;
        delete: string | null;
    };
}

// ─── State ────────────────────────────────────────────────────────────────────
interface ClassFacultyState {
    facultiesByClass: {
        [classId: string]: ClassFacultyBucket;
    };
}

// ─── Factory ──────────────────────────────────────────────────────────────────
const createEmptyBucket = (): ClassFacultyBucket => ({
    faculties: [],
    loading: {
        fetch: false,
        fetchSingle: false,
        create: false,
        update: false,
        delete: false,
    },
    error: {
        fetch: null,
        fetchSingle: null,
        create: null,
        update: null,
        delete: null,
    },
});

const initialState: ClassFacultyState = {
    facultiesByClass: {},
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const classFacultySlice = createSlice({
    name: "classFaculty",
    initialState,
    reducers: {
        clearClassFaculties: (state, action: PayloadAction<string>) => {
            delete state.facultiesByClass[action.payload];
        },
        clearError: (
            state,
            action: PayloadAction<{
                classId: string;
                key: keyof ClassFacultyBucket["error"];
            }>,
        ) => {
            const { classId, key } = action.payload;
            const bucket = state.facultiesByClass[classId];
            if (bucket) bucket.error[key] = null;
        },
        clearAllErrors: (state, action: PayloadAction<string>) => {
            const bucket = state.facultiesByClass[action.payload];
            if (bucket) {
                Object.keys(bucket.error).forEach((key) => {
                    bucket.error[key as keyof ClassFacultyBucket["error"]] = null;
                });
            }
        },
    },
    extraReducers: (builder) => {
        builder

            // ── Fetch All ─────────────────────────────────────────────────────
            .addCase(fetchClassFaculties.pending, (state, action) => {
                const classId = action.meta.arg;
                if (!state.facultiesByClass[classId]) {
                    state.facultiesByClass[classId] = createEmptyBucket();
                }
                state.facultiesByClass[classId].loading.fetch = true;
                state.facultiesByClass[classId].error.fetch = null;
            })
            .addCase(fetchClassFaculties.fulfilled, (state, action) => {
                const classId = action.meta.arg;
                const bucket = state.facultiesByClass[classId];
                if (bucket) {
                    bucket.loading.fetch = false;
                    bucket.faculties = action.payload;
                }
            })
            .addCase(fetchClassFaculties.rejected, (state, action) => {
                const classId = action.meta.arg;
                const bucket = state.facultiesByClass[classId];
                if (bucket) {
                    bucket.loading.fetch = false;
                    bucket.error.fetch = action.payload ?? "Failed to fetch faculties.";
                }
            })

            // ── Fetch Single ──────────────────────────────────────────────────
            .addCase(fetchSingleClassFaculty.pending, (state, action) => {
                const { classId } = action.meta.arg;
                if (!state.facultiesByClass[classId]) {
                    state.facultiesByClass[classId] = createEmptyBucket();
                }
                state.facultiesByClass[classId].loading.fetchSingle = true;
                state.facultiesByClass[classId].error.fetchSingle = null;
            })
            .addCase(fetchSingleClassFaculty.fulfilled, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];
                if (bucket) {
                    bucket.loading.fetchSingle = false;
                    const fetched = action.payload;
                    const index = bucket.faculties.findIndex(
                        (f) => f.facultyId === fetched.facultyId,
                    );
                    if (index !== -1) {
                        bucket.faculties[index] = fetched; // update existing
                    } else {
                        bucket.faculties.push(fetched); // insert if not found
                    }
                }
            })
            .addCase(fetchSingleClassFaculty.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];
                if (bucket) {
                    bucket.loading.fetchSingle = false;
                    bucket.error.fetchSingle =
                        action.payload ?? "Failed to fetch faculty details.";
                }
            })

            // ── Create ────────────────────────────────────────────────────────
            .addCase(createClassFaculty.pending, (state, action) => {
                const { classId } = action.meta.arg;
                if (!state.facultiesByClass[classId]) {
                    state.facultiesByClass[classId] = createEmptyBucket();
                }
                state.facultiesByClass[classId].loading.create = true;
                state.facultiesByClass[classId].error.create = null;
            })
            .addCase(createClassFaculty.fulfilled, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];
                if (bucket) {
                    bucket.loading.create = false;
                    bucket.faculties.push(action.payload);
                }
            })
            .addCase(createClassFaculty.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];
                if (bucket) {
                    bucket.loading.create = false;
                    bucket.error.create = action.payload ?? "Failed to create faculty.";
                }
            })

            // ── Update ────────────────────────────────────────────────────────
            .addCase(updateSingleClassFaculty.pending, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];
                if (bucket) {
                    bucket.loading.update = true;
                    bucket.error.update = null;
                }
            })
            .addCase(updateSingleClassFaculty.fulfilled, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];
                if (bucket) {
                    bucket.loading.update = false;
                    const updated = action.payload;
                    const index = bucket.faculties.findIndex(
                        (f) => f.facultyId === updated.facultyId,
                    );
                    if (index !== -1) bucket.faculties[index] = updated;
                }
            })
            .addCase(updateSingleClassFaculty.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];
                if (bucket) {
                    bucket.loading.update = false;
                    bucket.error.update = action.payload ?? "Failed to update faculty.";
                }
            })

            // ── Delete ────────────────────────────────────────────────────────
            .addCase(deleteClassFaculty.pending, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];
                if (bucket) {
                    bucket.loading.delete = true;
                    bucket.error.delete = null;
                }
            })
            .addCase(deleteClassFaculty.fulfilled, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];
                if (bucket) {
                    bucket.loading.delete = false;
                    bucket.faculties = bucket.faculties.filter(
                        (f) => f.facultyId !== action.payload.facultyId,
                    );
                }
            })
            .addCase(deleteClassFaculty.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];
                if (bucket) {
                    bucket.loading.delete = false;
                    bucket.error.delete = action.payload ?? "Failed to delete faculty.";
                }
            });
    },
});

export const { clearClassFaculties, clearError, clearAllErrors } =
    classFacultySlice.actions;
export default classFacultySlice.reducer;
