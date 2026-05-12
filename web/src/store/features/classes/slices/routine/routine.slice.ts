import { createSlice } from "@reduxjs/toolkit";
import type { Routine } from "@/types/routine.types";
import { createRoutine } from "../../thunks/routine/createRoutine.thunk";
import { fetchRoutine } from "../../thunks/routine/fetchRoutine.thunk";
import { addSlot } from "../../thunks/routine/addSlotThunk";
import { editSlot } from "../../thunks/routine/editSlotThunk";
import { removeSlot } from "../../thunks/routine/removeSlotThunk";
import { deleteRoutine } from "../../thunks/routine/deleteRoutine.thunk";

// ── Types ───────────────────────────────────────────────────────────────────

interface ActionState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

interface RoutineState {
    routines: Record<string, Routine>;
    createRoutine: ActionState;
    fetchRoutine: ActionState;
    addSlot: ActionState;
    editSlot: ActionState;
    removeSlot: ActionState;
    deleteRoutine: ActionState;
}

// ── Initial State ───────────────────────────────────────────────────────────

const defaultActionState: ActionState = {
    loading: false,

    error: null,

    success: false,
};

const initialState: RoutineState = {
    routines: {},

    createRoutine: {
        ...defaultActionState,
    },

    fetchRoutine: {
        ...defaultActionState,
    },

    addSlot: {
        ...defaultActionState,
    },

    editSlot: {
        ...defaultActionState,
    },
    removeSlot: {
        ...defaultActionState,
    },
    deleteRoutine: {
        ...defaultActionState,
    },
};

// ── Slice ───────────────────────────────────────────────────────────────────

const routineSlice = createSlice({
    name: "routine",

    initialState,

    reducers: {
        resetRoutineState: (state) => {
            state.createRoutine = {
                ...defaultActionState,
            };

            state.fetchRoutine = {
                ...defaultActionState,
            };

            state.addSlot = {
                ...defaultActionState,
            };

            state.editSlot = {
                ...defaultActionState,
            };
        },
    },

    extraReducers: (builder) => {
        builder

            // ── Create Routine ──────────────────────────────────────────────
            .addCase(createRoutine.pending, (state) => {
                state.createRoutine.loading = true;

                state.createRoutine.error = null;

                state.createRoutine.success = false;
            })

            .addCase(
                createRoutine.fulfilled,
                (state, action) => {
                    state.createRoutine.loading = false;

                    state.createRoutine.success = true;

                    state.createRoutine.error = null;

                    const routine = action.payload;

                    if (routine?.classId) {
                        state.routines[
                            routine.classId
                        ] = routine;
                    }
                },
            )

            .addCase(
                createRoutine.rejected,
                (state, action) => {
                    state.createRoutine.loading = false;

                    state.createRoutine.error =
                        (action.payload as string) ||
                        "Failed to create routine";
                },
            )

            // ── Fetch Routine ───────────────────────────────────────────────
            .addCase(fetchRoutine.pending, (state) => {
                state.fetchRoutine.loading = true;

                state.fetchRoutine.error = null;

                state.fetchRoutine.success = false;
            })

            .addCase(
                fetchRoutine.fulfilled,
                (state, action) => {
                    state.fetchRoutine.loading = false;

                    state.fetchRoutine.success = true;

                    state.fetchRoutine.error = null;

                    const routine = action.payload;

                    if (routine?.classId) {
                        state.routines[
                            routine.classId
                        ] = routine;
                    }
                },
            )

            .addCase(
                fetchRoutine.rejected,
                (state, action) => {
                    state.fetchRoutine.loading = false;

                    state.fetchRoutine.error =
                        (action.payload as string) ||
                        "Failed to fetch routine";
                },
            )

            // ── Add Slot ────────────────────────────────────────────────────
            .addCase(addSlot.pending, (state) => {
                state.addSlot.loading = true;

                state.addSlot.error = null;

                state.addSlot.success = false;
            })

            .addCase(addSlot.fulfilled, (state, action) => {
                state.addSlot.loading = false;

                state.addSlot.success = true;

                state.addSlot.error = null;

                const routine = action.payload;

                if (routine?.classId) {
                    state.routines[
                        routine.classId
                    ] = routine;
                }
            })

            .addCase(addSlot.rejected, (state, action) => {
                state.addSlot.loading = false;

                state.addSlot.error =
                    (action.payload as string) ||
                    "Failed to add slot";
            })

            // ── Edit Slot ───────────────────────────────────────────────────
            .addCase(editSlot.pending, (state) => {
                state.editSlot.loading = true;

                state.editSlot.error = null;

                state.editSlot.success = false;
            })

            .addCase(editSlot.fulfilled, (state, action) => {
                state.editSlot.loading = false;

                state.editSlot.success = true;

                state.editSlot.error = null;

                const routine = action.payload;

                if (routine?.classId) {
                    state.routines[
                        routine.classId
                    ] = routine;
                }
            })

            .addCase(editSlot.rejected, (state, action) => {
                state.editSlot.loading = false;

                state.editSlot.error =
                    (action.payload as string) ||
                    "Failed to edit slot";
            })

            // ── Remove Slot ─────────────────────────────────────────────────
            .addCase(removeSlot.pending, (state) => {
                state.removeSlot.loading = true;
                state.removeSlot.error = null;
                state.removeSlot.success = false;
            })

            .addCase(removeSlot.fulfilled, (state, action) => {
                state.removeSlot.loading = false;
                state.removeSlot.success = true;
                state.removeSlot.error = null;

                const routine = action.payload;

                if (routine?.classId) {
                    state.routines[routine.classId] = routine;
                }
            })

            .addCase(removeSlot.rejected, (state, action) => {
                state.removeSlot.loading = false;

                state.removeSlot.error =
                    (action.payload as string) ||
                    "Failed to remove slot";
            })

            // ── Delete Routine ─────────────────────────────────────────────

            .addCase(deleteRoutine.pending, (state) => {
                state.deleteRoutine.loading = true;

                state.deleteRoutine.error = null;

                state.deleteRoutine.success = false;
            })

            .addCase(deleteRoutine.fulfilled, (state, action) => {
                state.deleteRoutine.loading = false;

                state.deleteRoutine.success = true;

                state.deleteRoutine.error = null;

                delete state.routines[action.payload.classId];
            })

            .addCase(deleteRoutine.rejected, (state, action) => {
                state.deleteRoutine.loading = false;

                state.deleteRoutine.error =
                    (action.payload as string) ||
                    "Failed to delete routine";
            })

    },
});

export const { resetRoutineState } =
    routineSlice.actions;

export default routineSlice.reducer;