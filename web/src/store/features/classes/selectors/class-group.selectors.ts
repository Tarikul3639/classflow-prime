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

// ─── 3. Loading State ─────────────────────────────────────────────────────
export const selectClassGroupLoading = createSelector(
    [selectGroupBucket],
    (bucket) =>
        bucket?.loading ?? {
            fetch: false,
            fetchSingle: false,
            create: false,
            update: false,
            delete: false,
        }
);

// ─── 4. Error State ───────────────────────────────────────────────────────
export const selectClassGroupError = createSelector(
    [selectGroupBucket],
    (bucket) =>
        bucket?.error ?? {
            fetch: null,
            fetchSingle: null,
            create: null,
            update: null,
            delete: null,
        }
);

// ─── 5. Is Already Fetched Guard ─────────────────────────────────────────
export const selectIsGroupsFetched = createSelector(
    [selectGroupBucket],
    (bucket) => !!bucket
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
