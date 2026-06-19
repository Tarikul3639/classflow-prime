// class-actions.slice.ts
import { createSlice } from "@reduxjs/toolkit";
import {
    leaveClass,
    deleteClass,
    markClassAsEnded,
    fetchClassSettings,
    regenerateClassCode,
    toggleJoiningAllowed,
} from "../../thunks/settings/class-setting.thunk";

// ─── Bucket Interface ───────────────────────────────────────────────
interface ClassActionsBucket {
    classCode: string | null;
    isJoiningAllowed: boolean;

    leaveClass: { loading: boolean; error: string | null };
    deleteClass: { loading: boolean; error: string | null };
    markAsEnded: { loading: boolean; error: string | null };
    fetchClassSettings: { loading: boolean; isFetched: boolean; error: string | null };
    regenerateClassCode: { loading: boolean; error: string | null };
    toggleJoiningAllowed: { loading: boolean; error: string | null };
}

// ─── State Interface ────────────────────────────────────────────────
export interface ClassActionsState {
    actionsByClass: {
        [classId: string]: ClassActionsBucket;
    };
}

// ─── Factory ────────────────────────────────────────────────────────
const createInitialClassActionsBucket = (): ClassActionsBucket => ({
    classCode: null,
    isJoiningAllowed: true,

    leaveClass: { loading: false, error: null },
    deleteClass: { loading: false, error: null },
    markAsEnded: { loading: false, error: null },
    fetchClassSettings: { loading: false, isFetched: false, error: null },
    regenerateClassCode: { loading: false, error: null },
    toggleJoiningAllowed: { loading: false, error: null },
});

// ─── Initial State ──────────────────────────────────────────────────
const initialState: ClassActionsState = {
    actionsByClass: {},
};

// ─── Helper ─────────────────────────────────────────────────────────
const ensureBucket = (state: ClassActionsState, classId: string) => {
    if (!state.actionsByClass[classId]) {
        state.actionsByClass[classId] = createInitialClassActionsBucket();
    }
};

// ─── Slice ──────────────────────────────────────────────────────────
const classActionsSlice = createSlice({
    name: "classActions",
    initialState,

    reducers: {
        clearClassCode: (state, action: { payload: string }) => {
            const bucket = state.actionsByClass[action.payload];
            if (bucket) bucket.classCode = null;
        },
        clearErrors: (state, action: { payload: string }) => {
            const bucket = state.actionsByClass[action.payload];
            if (bucket) {
                bucket.leaveClass.error = null;
                bucket.deleteClass.error = null;
                bucket.markAsEnded.error = null;
                bucket.fetchClassSettings.error = null;
                bucket.regenerateClassCode.error = null;
                bucket.toggleJoiningAllowed.error = null;
            }
        },
    },

    extraReducers: (builder) => {
        builder

            // ─── Leave Class ─────────────────────────────────────────────
            .addCase(leaveClass.pending, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].leaveClass.loading = true;
                state.actionsByClass[classId].leaveClass.error = null;
            })
            .addCase(leaveClass.fulfilled, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].leaveClass.loading = false;
            })
            .addCase(leaveClass.rejected, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].leaveClass.loading = false;
                state.actionsByClass[classId].leaveClass.error =
                    action.payload || "Failed to leave class.";
            })

            // ─── Delete Class ────────────────────────────────────────────
            .addCase(deleteClass.pending, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].deleteClass.loading = true;
                state.actionsByClass[classId].deleteClass.error = null;
            })
            .addCase(deleteClass.fulfilled, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].deleteClass.loading = false;
            })
            .addCase(deleteClass.rejected, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].deleteClass.loading = false;
                state.actionsByClass[classId].deleteClass.error =
                    action.payload || "Failed to delete class.";
            })

            // ─── Mark As Ended ───────────────────────────────────────────
            .addCase(markClassAsEnded.pending, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].markAsEnded.loading = true;
                state.actionsByClass[classId].markAsEnded.error = null;
            })
            .addCase(markClassAsEnded.fulfilled, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].markAsEnded.loading = false;
            })
            .addCase(markClassAsEnded.rejected, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].markAsEnded.loading = false;
                state.actionsByClass[classId].markAsEnded.error =
                    action.payload || "Failed to mark class as ended.";
            })

            // ─── Fetch Class Settings ────────────────────────────────────
            .addCase(fetchClassSettings.pending, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].fetchClassSettings.loading = true;
                state.actionsByClass[classId].fetchClassSettings.isFetched = false;
                state.actionsByClass[classId].fetchClassSettings.error = null;
                state.actionsByClass[classId].classCode = null;
                state.actionsByClass[classId].isJoiningAllowed = true;
            })
            .addCase(fetchClassSettings.fulfilled, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].fetchClassSettings.loading = false;
                state.actionsByClass[classId].fetchClassSettings.isFetched = true;
                state.actionsByClass[classId].classCode = action.payload.code;
                state.actionsByClass[classId].isJoiningAllowed = action.payload.isJoiningAllowed;
            })
            .addCase(fetchClassSettings.rejected, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].fetchClassSettings.loading = false;
                state.actionsByClass[classId].fetchClassSettings.isFetched = true;
                state.actionsByClass[classId].fetchClassSettings.error =
                    action.payload || "Failed to fetch class settings.";
            })

            // ─── Regenerate Class Code ───────────────────────────────────
            .addCase(regenerateClassCode.pending, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].regenerateClassCode.loading = true;
                state.actionsByClass[classId].regenerateClassCode.error = null;
            })
            .addCase(regenerateClassCode.fulfilled, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].regenerateClassCode.loading = false;
                state.actionsByClass[classId].classCode = action.payload.code;
            })
            .addCase(regenerateClassCode.rejected, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].regenerateClassCode.loading = false;
                state.actionsByClass[classId].regenerateClassCode.error =
                    action.payload || "Failed to regenerate class code.";
            })

            // ─── Toggle Joining Allowed ──────────────────────────────────
            .addCase(toggleJoiningAllowed.pending, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].toggleJoiningAllowed.error = null;
            })
            .addCase(toggleJoiningAllowed.fulfilled, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].isJoiningAllowed =
                    !state.actionsByClass[classId].isJoiningAllowed;
            })
            .addCase(toggleJoiningAllowed.rejected, (state, action) => {
                const classId = action.meta.arg;
                ensureBucket(state, classId);
                state.actionsByClass[classId].toggleJoiningAllowed.error =
                    action.payload || "Failed to toggle joining allowed.";
            });
    },
});

export const { clearClassCode, clearErrors } = classActionsSlice.actions;
export default classActionsSlice.reducer;