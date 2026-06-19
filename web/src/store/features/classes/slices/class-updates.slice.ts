import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Thunks
import { fetchClassUpdate } from "../thunks/fetch-class-update.thunk";
import { createClassUpdate } from "../thunks/create-class-update.thunk";
import { fetchSingleClassUpdate } from "../thunks/fetch-single-class-update.thunk";
import { updateClassUpdate } from "../thunks/update-class-update.thunk";
import { togglePinClassUpdate } from "../thunks/toggle-pin-class-update.thunk";
import { deleteSingleClassUpdate } from "../thunks/delete-single-class-update.thunk";

// Types
import type { ClassUpdateItem } from "@/types/update.types";
import type { ApiError } from "@/api/extract-error";
import type { UpdateErrorFieldType } from "../class.types";

// State Structure
interface ClassBucket {
    items: ClassUpdateItem[];

    fetch: {
        loading: boolean;
        isFetched: boolean;
        error: ApiError | null;
    };

    create: {
        loading: boolean;
        error: ApiError<UpdateErrorFieldType> | null;
    };

    update: {
        loading: boolean;
        error: ApiError<UpdateErrorFieldType> | null;
    };

    togglePin: {
        loading: boolean;
        error: ApiError | null;
    };

    delete: {
        loading: boolean;
        error: ApiError | null;
    };
}

export interface ClassUpdatesState {
    updatesByClass: {
        [classId: string]: ClassBucket;
    };
}

const createEmptyBucket = (): ClassBucket => ({
    items: [],

    fetch: {
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

    togglePin: {
        loading: false,
        error: null,
    },

    delete: {
        loading: false,
        error: null,
    },
});

const initialState: ClassUpdatesState = {
    updatesByClass: {},
};

const classUpdatesSlice = createSlice({
    name: "classUpdates",
    initialState,

    reducers: {
        clearClassUpdates: (state, action: PayloadAction<string>) => {
            delete state.updatesByClass[action.payload];
        },

        clearUpdateError: (state, action) => {
            const { classId } = action.payload;

            const bucket = state.updatesByClass[classId];

            if (bucket) {
                bucket.update.error = null;
            }
        },
    },

    extraReducers: (builder) => {
        builder

            // ── Fetch ─────────────────────────────────────────

            .addCase(fetchClassUpdate.pending, (state, action) => {
                const classId = action.meta.arg;

                if (!state.updatesByClass[classId]) {
                    state.updatesByClass[classId] = createEmptyBucket();
                }

                state.updatesByClass[classId].fetch.loading = true;
                state.updatesByClass[classId].fetch.isFetched = false;
                state.updatesByClass[classId].fetch.error = null;
            })

            .addCase(fetchClassUpdate.fulfilled, (state, action) => {
                const classId = action.meta.arg;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.fetch.loading = false;
                    bucket.fetch.isFetched = true;
                    bucket.items = action.payload;
                }
            })

            .addCase(fetchClassUpdate.rejected, (state, action) => {
                const classId = action.meta.arg;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.fetch.loading = false;
                    bucket.fetch.isFetched = true;
                    bucket.fetch.error =
                        action.payload ?? {
                            message: "Failed to fetch class updates.",
                        };
                }
            })

            // ── Create ────────────────────────────────────────

            .addCase(createClassUpdate.pending, (state, action) => {
                const { classId } = action.meta.arg;

                if (!state.updatesByClass[classId]) {
                    state.updatesByClass[classId] = createEmptyBucket();
                }

                state.updatesByClass[classId].create.loading = true;
                state.updatesByClass[classId].create.error = null;
            })

            .addCase(createClassUpdate.fulfilled, (state, action) => {
                const newItem: ClassUpdateItem = action.payload;
                const classId = newItem.classId;
                const bucket = classId
                    ? state.updatesByClass[classId]
                    : undefined;

                if (bucket) {
                    bucket.create.loading = false;
                    bucket.items.unshift(newItem);
                }
            })

            .addCase(createClassUpdate.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.create.loading = false;
                    bucket.create.error =
                        action.payload ?? {
                            message: "Failed to create update.",
                        };
                }
            })

            // ── Toggle Pin ────────────────────────────────────

            .addCase(togglePinClassUpdate.pending, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.togglePin.loading = true;
                    bucket.togglePin.error = null;
                }
            })

            .addCase(togglePinClassUpdate.fulfilled, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.togglePin.loading = false;

                    const index = bucket.items.findIndex(
                        (u) => u._id === action.payload.updateId
                    );

                    if (index !== -1) {
                        bucket.items[index].isPinned = action.payload.isPinned;
                    }
                }
            })

            .addCase(togglePinClassUpdate.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.togglePin.loading = false;
                    bucket.togglePin.error =
                        action.payload ?? {
                            message: "Failed to toggle pin status.",
                        };
                }
            })

            // ── Delete ────────────────────────────────────────

            .addCase(deleteSingleClassUpdate.pending, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.delete.loading = true;
                    bucket.delete.error = null;
                }
            })

            .addCase(deleteSingleClassUpdate.fulfilled, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.delete.loading = false;

                    bucket.items = bucket.items.filter(
                        (u) => u._id !== action.payload.updateId
                    );
                }
            })

            .addCase(deleteSingleClassUpdate.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.delete.loading = false;
                    bucket.delete.error =
                        action.payload ?? {
                            message: "Failed to delete the update.",
                        };
                }
            })

            // ── Fetch Single Update ───────────────────────────

            .addCase(fetchSingleClassUpdate.pending, (state, action) => {
                const { classId } = action.meta.arg;

                if (!state.updatesByClass[classId]) {
                    state.updatesByClass[classId] = createEmptyBucket();
                }

                state.updatesByClass[classId].fetch.loading = true;
                state.updatesByClass[classId].fetch.error = null;
                state.updatesByClass[classId].fetch.isFetched = false;
            })

            .addCase(fetchSingleClassUpdate.fulfilled, (state, action) => {
                const { classId, update } = action.payload;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.fetch.loading = false;
                    bucket.fetch.isFetched = true;
                    const index = bucket.items.findIndex(
                        (u) => u._id === update._id
                    );

                    if (index !== -1) {
                        bucket.items[index] = update;
                    } else {
                        bucket.items.unshift(update);
                    }
                }
            })

            .addCase(fetchSingleClassUpdate.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.fetch.loading = false;
                    bucket.fetch.error =
                        action.payload ?? {
                            message: "Failed to fetch update.",
                        };
                    bucket.fetch.isFetched = true;
                }
            })

            // ── Update ────────────────────────────────────────

            .addCase(updateClassUpdate.pending, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.update.loading = true;
                    bucket.update.error = null;
                }
            })

            .addCase(updateClassUpdate.fulfilled, (state, action) => {
                const updatedItem = action.payload;
                const classId = updatedItem.classId;

                const bucket = classId
                    ? state.updatesByClass[classId]
                    : undefined;

                if (bucket) {
                    bucket.update.loading = false;

                    const index = bucket.items.findIndex(
                        (i) => i._id === updatedItem._id
                    );

                    if (index !== -1) {
                        bucket.items[index] = updatedItem;
                    }
                }
            })

            .addCase(updateClassUpdate.rejected, (state, action) => {
                const { classId } = action.meta.arg;
                const bucket = state.updatesByClass[classId];

                if (bucket) {
                    bucket.update.loading = false;
                    bucket.update.error =
                        action.payload ?? {
                            message: "Failed to update.",
                        };
                    bucket.fetch.isFetched = true;
                }
            });
    },
});

export const {
    clearClassUpdates,
    clearUpdateError,
} = classUpdatesSlice.actions;

export default classUpdatesSlice.reducer;