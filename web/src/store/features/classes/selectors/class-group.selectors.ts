import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

// ─── Base Selector ────────────────────────────────────────────────────────
const selectGroupBucket = (state: RootState, classId: string) =>
    state.classes.classGroups.groupsByClass[classId];

// ─── 1. All Groups for a Class ────────────────────────────────────────────
export const selectClassGroups = createSelector(
    [selectGroupBucket],
    (bucket) => bucket?.groups ?? []
);

// ─── 2. Single Group by ID ───────────────────────────────────────────────
export const selectSingleGroup = createSelector(
    [
        selectGroupBucket,
        (_: RootState, __: string, groupId: string) => groupId,
    ],
    (bucket, groupId) => bucket?.groups.find((g) => g.groupId === groupId) ?? null
);

// ─── 5. Is Already Fetched Guard ─────────────────────────────────────────
export const selectIsGroupsFetched = createSelector(
    [selectGroupBucket],
    (bucket) => bucket?.fetch?.isFetched ?? false
);

// ─── 6. Group Count ──────────────────────────────────────────────────────
export const selectGroupCount = createSelector(
    [selectClassGroups],
    (groups) => groups.length
);

// ─── 7. Group by Name (Optional) ─────────────────────────────────────────
export const selectGroupByName = createSelector(
    [
        selectClassGroups,
        (_: RootState, __: string, groupName: string) => groupName,
    ],
    (groups, groupName) => groups.find((g) => g.name === groupName) ?? null
);
