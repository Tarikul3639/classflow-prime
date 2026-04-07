import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

// ─── 1. Base Selector ─────────────────────────────────────────────────────────
const selectFacultyBucket = (state: RootState, classId: string) =>
    state.classes.classFaculty.facultiesByClass[classId];

// ─── 2. Faculties List ────────────────────────────────────────────────────────
export const selectClassFaculties = createSelector(
    [selectFacultyBucket],
    (bucket) => bucket?.faculties ?? []
);

// ─── 3. Single Faculty by ID ──────────────────────────────────────────────────
export const selectSingleFaculty = createSelector(
    [selectFacultyBucket, (_: RootState, __: string, facultyId: string) => facultyId],
    (bucket, facultyId) =>
        bucket?.faculties.find((f) => f.facultyId === facultyId) ?? null
);

// ─── 4. Loading State ─────────────────────────────────────────────────────────
export const selectClassFacultyLoading = createSelector(
    [selectFacultyBucket],
    (bucket) =>
        bucket?.loading ?? {
            fetch: false,
            create: false,
            update: false,
            delete: false,
        }
);

// ─── 5. Error State ───────────────────────────────────────────────────────────
export const selectClassFacultyError = createSelector(
    [selectFacultyBucket],
    (bucket) =>
        bucket?.error ?? {
            fetch: null,
            fetchSingle: null,
            create: null,
            update: null,
            delete: null,
        }
);

// ─── 6. Is Already Fetched Guard ─────────────────────────────────────────────
export const selectIsFacultyFetched = createSelector(
    [selectFacultyBucket],
    (bucket) => !!bucket && bucket.faculties.length > 0
);