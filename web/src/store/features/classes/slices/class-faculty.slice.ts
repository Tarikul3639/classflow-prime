import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createClassFaculty,
    deleteClassFaculty,
    fetchClassFaculties,
} from "../thunks/class-faculty.thunk";
import { updateSingleClassFaculty } from "../thunks/update-single-class-faculty.thunk";
import { fetchSingleClassFaculty } from "../thunks/fetch-single-class-faculty.thunk";

import type { ClassFaculty } from "../class.types";

// ─── Bucket Structure ───────────────────────────────────────────────
interface ClassFacultyBucket {
    faculties: ClassFaculty[];

    fetch: {
        loading: boolean;
        isFetched: boolean;
        error: string | null;
    };

    fetchSingle: {
        loading: boolean;
        isFetched: boolean;
        error: string | null;
    };

    create: {
        loading: boolean;
        error: string | null;
    };

    update: {
        loading: boolean;
        error: string | null;
    };

    delete: {
        loading: boolean;
        error: string | null;
    };
}

// ─── State ─────────────────────────────────────────────────────────
interface ClassFacultyState {
    facultiesByClass: {
        [classId: string]: ClassFacultyBucket;
    };
}

// ─── Factory ───────────────────────────────────────────────────────
const createEmptyBucket = (): ClassFacultyBucket => ({
    faculties: [],

    fetch: {
        loading: false,
        isFetched: false,
        error: null,
    },

    fetchSingle: {
        loading: false,
        isFetched: false,
        error: null,
    },

    create: {
        loading: false,
        error: null,
    },

    update: {
        loading: false,
        error: null,
    },

    delete: {
        loading: false,
        error: null,
    },
});

const initialState: ClassFacultyState = {
    facultiesByClass: {},
};

// ─── Slice ─────────────────────────────────────────────────────────
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
                key: keyof Omit<ClassFacultyBucket, "faculties">;
            }>
        ) => {
            const { classId, key } = action.payload;
            const bucket = state.facultiesByClass[classId];

            if (bucket) {
                bucket[key].error = null;
            }
        },

        clearAllErrors: (state, action: PayloadAction<string>) => {
            const bucket = state.facultiesByClass[action.payload];

            if (bucket) {
                bucket.fetch.error = null;
                bucket.fetchSingle.error = null;
                bucket.create.error = null;
                bucket.update.error = null;
                bucket.delete.error = null;
            }
        },
    },

    extraReducers: (builder) => {
        builder

            // ── Fetch All ───────────────────────────────────

            .addCase(fetchClassFaculties.pending, (state, action) => {
                const classId = action.meta.arg;

                if (!state.facultiesByClass[classId]) {
                    state.facultiesByClass[classId] = createEmptyBucket();
                }

                state.facultiesByClass[classId].fetch.loading = true;
                state.facultiesByClass[classId].fetch.isFetched = false;
                state.facultiesByClass[classId].fetch.error = null;
            })

            .addCase(fetchClassFaculties.fulfilled, (state, action) => {
                const classId = action.meta.arg;
                const bucket = state.facultiesByClass[classId];

                if (bucket) {
                    bucket.fetch.loading = false;
                    bucket.fetch.isFetched = true;
                    bucket.faculties = action.payload;
                }
            })

            .addCase(fetchClassFaculties.rejected, (state, action) => {
                const classId = action.meta.arg;
                const bucket = state.facultiesByClass[classId];

                if (bucket) {
                    bucket.fetch.loading = false;
                    bucket.fetch.isFetched = true;
                    bucket.fetch.error =
                        action.payload ?? "Failed to fetch faculties.";
                }
            })

            // ── Fetch Single ────────────────────────────────

            .addCase(fetchSingleClassFaculty.pending, (state, action) => {
                const { classId } = action.meta.arg;

                if (!state.facultiesByClass[classId]) {
                    state.facultiesByClass[classId] = createEmptyBucket();
                }

                state.facultiesByClass[classId].fetchSingle.loading = true;
                state.facultiesByClass[classId].fetchSingle.isFetched = false;
                state.facultiesByClass[classId].fetchSingle.error = null;
            })

            .addCase(fetchSingleClassFaculty.fulfilled, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];

                if (bucket) {
                    bucket.fetchSingle.loading = false;
                    bucket.fetchSingle.isFetched = true;
                    const fetched = action.payload;
                    const index = bucket.faculties.findIndex(
                        (f) => f.facultyId === fetched.facultyId
                    );

                    if (index !== -1) {
                        bucket.faculties[index] = fetched;
                    } else {
                        bucket.faculties.push(fetched);
                    }
                }
            })

            .addCase(fetchSingleClassFaculty.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];

                if (bucket) {
                    bucket.fetchSingle.loading = false;
                    bucket.fetchSingle.isFetched = true;
                    bucket.fetchSingle.error =
                        action.payload ?? "Failed to fetch faculty details.";
                }
            })

            // ── Create ──────────────────────────────────────

            .addCase(createClassFaculty.pending, (state, action) => {
                const { classId } = action.meta.arg;

                if (!state.facultiesByClass[classId]) {
                    state.facultiesByClass[classId] = createEmptyBucket();
                }

                state.facultiesByClass[classId].create.loading = true;
                state.facultiesByClass[classId].create.error = null;
            })

            .addCase(createClassFaculty.fulfilled, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];

                if (bucket) {
                    bucket.create.loading = false;
                    bucket.faculties.push(action.payload);
                }
            })

            .addCase(createClassFaculty.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];

                if (bucket) {
                    bucket.create.loading = false;
                    bucket.create.error =
                        action.payload ?? "Failed to create faculty.";
                }
            })

            // ── Update ──────────────────────────────────────

            .addCase(updateSingleClassFaculty.pending, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];

                if (bucket) {
                    bucket.update.loading = true;
                    bucket.update.error = null;
                }
            })

            .addCase(updateSingleClassFaculty.fulfilled, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];

                if (bucket) {
                    bucket.update.loading = false;

                    const updated = action.payload;

                    const index = bucket.faculties.findIndex(
                        (f) => f.facultyId === updated.facultyId
                    );

                    if (index !== -1) {
                        bucket.faculties[index] = updated;
                    }
                }
            })

            .addCase(updateSingleClassFaculty.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];

                if (bucket) {
                    bucket.update.loading = false;
                    bucket.update.error =
                        action.payload ?? "Failed to update faculty.";
                }
            })

            // ── Delete ──────────────────────────────────────

            .addCase(deleteClassFaculty.pending, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];

                if (bucket) {
                    bucket.delete.loading = true;
                    bucket.delete.error = null;
                }
            })

            .addCase(deleteClassFaculty.fulfilled, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];

                if (bucket) {
                    bucket.delete.loading = false;

                    bucket.faculties = bucket.faculties.filter(
                        (f) => f.facultyId !== action.payload.facultyId
                    );
                }
            })

            .addCase(deleteClassFaculty.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.facultiesByClass[classId];

                if (bucket) {
                    bucket.delete.loading = false;
                    bucket.delete.error =
                        action.payload ?? "Failed to delete faculty.";
                }
            });
    },
});

export const {
    clearClassFaculties,
    clearError,
    clearAllErrors,
} = classFacultySlice.actions;

export default classFacultySlice.reducer;