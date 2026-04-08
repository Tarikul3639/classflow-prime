import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    createClassGroup,
    updateClassGroup,
    deleteClassGroup,
    fetchClassGroups,
    fetchSingleClassGroup,
} from "../../thunks/groups/class-group.thunk";
import { ClassGroup, GroupErrorFieldType } from "@/types/group.types";
import type { ApiError } from "@/api/extract-error";

// ─── Group Bucket Interface ────────────────────────────────────────────────
interface ClassGroupBucket {
    groups: ClassGroup[];
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
        create: ApiError<GroupErrorFieldType> | null;
        update: ApiError<GroupErrorFieldType> | null;
        delete: string | null;
    };
}

// ─── State Interface ───────────────────────────────────────────────────────
export interface ClassGroupState {
    groupsByClass: {
        [classId: string]: ClassGroupBucket;
    };
}

// ─── Initial State ────────────────────────────────────────────────────────
const createEmptyBucket = (): ClassGroupBucket => ({
    groups: [],
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

const initialState: ClassGroupState = {
    groupsByClass: {},
};

// ─── Slice ────────────────────────────────────────────────────────────────
const classGroupSlice = createSlice({
    name: "classGroup",
    initialState,
    reducers: {
        clearClassGroups: (state, action: PayloadAction<string>) => {
            const classId = action.payload;
            if (state.groupsByClass[classId]) {
                delete state.groupsByClass[classId];
            }
        },
        clearGroupError: (
            state,
            action: PayloadAction<{
                classId: string;
                field: keyof ClassGroupBucket["error"];
            }>
        ) => {
            const { classId, field } = action.payload;
            if (state.groupsByClass[classId]) {
                state.groupsByClass[classId].error[field] = null;
            }
        },
    },
    extraReducers: (builder) => {
        // ─── Fetch Class Groups ───────────────────────────────────────────────
        builder
            .addCase(fetchClassGroups.pending, (state, action) => {
                const classId = action.meta.arg;
                if (!state.groupsByClass[classId]) {
                    state.groupsByClass[classId] = createEmptyBucket();
                }
                state.groupsByClass[classId].loading.fetch = true;
                state.groupsByClass[classId].error.fetch = null;
            })
            .addCase(fetchClassGroups.fulfilled, (state, action) => {
                const classId = action.meta.arg;
                const bucket = state.groupsByClass[classId];
                if (bucket) {
                    bucket.loading.fetch = false;
                    bucket.groups = action.payload.groups || [];
                }
            })
            .addCase(fetchClassGroups.rejected, (state, action) => {
                const classId = action.meta.arg;
                const bucket = state.groupsByClass[classId];
                if (bucket) {
                    bucket.loading.fetch = false;
                    bucket.error.fetch = action.payload ?? "Failed to fetch groups.";
                }
            });

        // ─── Fetch Single Class Group ──────────────────────────────────────────
        builder
            .addCase(fetchSingleClassGroup.pending, (state, action) => {
                const classId = action.meta.arg.classId;
                if (!state.groupsByClass[classId]) {
                    state.groupsByClass[classId] = createEmptyBucket();
                }
                state.groupsByClass[classId].loading.fetchSingle = true;
                state.groupsByClass[classId].error.fetchSingle = null;
            })
            .addCase(fetchSingleClassGroup.fulfilled, (state, action) => {
                const classId = action.meta.arg.classId;
                const bucket = state.groupsByClass[classId];
                if (bucket) {
                    bucket.loading.fetchSingle = false;
                    const group = action.payload;
                    const index = bucket.groups.findIndex(
                        (g) => g.groupId === group.groupId
                    );
                    if (index !== -1) {
                        bucket.groups[index] = group;
                    } else {
                        bucket.groups.unshift(group);
                    }
                }
            })
            .addCase(fetchSingleClassGroup.rejected, (state, action) => {
                const classId = action.meta.arg.classId;
                const bucket = state.groupsByClass[classId];
                if (bucket) {
                    bucket.loading.fetchSingle = false;
                    bucket.error.fetchSingle = action.payload ?? "Failed to fetch group details.";
                }
            });

        // ─── Create Class Group ───────────────────────────────────────────────
        builder
            .addCase(createClassGroup.pending, (state, action) => {
                const classId = action.meta.arg.classId;
                if (!state.groupsByClass[classId]) {
                    state.groupsByClass[classId] = createEmptyBucket();
                }
                state.groupsByClass[classId].loading.create = true;
                state.groupsByClass[classId].error.create = null;
            })
            .addCase(createClassGroup.fulfilled, (state, action) => {
                const newGroup: ClassGroup = action.payload;
                const classId = action.meta.arg.classId;
                const bucket = state.groupsByClass[classId];
                if (bucket) {
                    bucket.loading.create = false;
                    bucket.groups.unshift(newGroup);
                }
            })
            .addCase(createClassGroup.rejected, (state, action) => {
                const classId = action.meta.arg.classId;
                const bucket = state.groupsByClass[classId];
                if (bucket) {
                    bucket.loading.create = false;
                    bucket.error.create =
                        action.payload ?? { message: "Failed to create group." };
                }
            });

        // ─── Update Class Group ───────────────────────────────────────────────
        builder
            .addCase(updateClassGroup.pending, (state, action) => {
                const classId = action.meta.arg.classId;
                const bucket = state.groupsByClass[classId];
                if (bucket) {
                    bucket.loading.update = true;
                    bucket.error.update = null;
                }
            })
            .addCase(updateClassGroup.fulfilled, (state, action) => {
                const updatedGroup = action.payload;
                const classId = action.meta.arg.classId;
                const bucket = state.groupsByClass[classId];
                if (bucket) {
                    bucket.loading.update = false;
                    const index = bucket.groups.findIndex(
                        (g) => g.groupId === updatedGroup.groupId
                    );
                    if (index !== -1) {
                        bucket.groups[index] = updatedGroup;
                    }
                }
            })
            .addCase(updateClassGroup.rejected, (state, action) => {
                const classId = action.meta.arg.classId;
                const bucket = state.groupsByClass[classId];
                if (bucket) {
                    bucket.loading.update = false;
                    bucket.error.update =
                        action.payload ?? { message: "Failed to update group." };
                }
            });

        // ─── Delete Class Group ───────────────────────────────────────────────
        builder
            .addCase(deleteClassGroup.pending, (state, action) => {
                const classId = action.meta.arg.classId;
                const bucket = state.groupsByClass[classId];
                if (bucket) {
                    bucket.loading.delete = true;
                    bucket.error.delete = null;
                }
            })
            .addCase(deleteClassGroup.fulfilled, (state, action) => {
                const classId = action.meta.arg.classId;
                const bucket = state.groupsByClass[classId];
                if (bucket) {
                    bucket.loading.delete = false;
                    bucket.groups = bucket.groups.filter(
                        (g) => g.groupId !== action.payload.groupId
                    );
                }
            })
            .addCase(deleteClassGroup.rejected, (state, action) => {
                const classId = action.meta.arg.classId;
                const bucket = state.groupsByClass[classId];
                if (bucket) {
                    bucket.loading.delete = false;
                    bucket.error.delete = action.payload ?? "Failed to delete group.";
                }
            });
    },
});

export const { clearClassGroups, clearGroupError } = classGroupSlice.actions;
export default classGroupSlice.reducer;