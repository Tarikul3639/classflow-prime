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