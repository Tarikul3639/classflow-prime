import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";

// ─── Base selectors (primitives — no memoization needed) ──────────────────────

export const selectDashboardLoading = (state: RootState) =>
    state.dashboard.loading.fetchDashboard;

export const selectDashboardError = (state: RootState) =>
    state.dashboard.error.fetchDashboard;

export const selectClasses = (state: RootState) =>
    state.dashboard.classes;

export const selectUpdates = (state: RootState) =>
    state.dashboard.updates;

export const selectFaculty = (state: RootState) =>
    state.dashboard.faculty;

export const selectGroups = (state: RootState) =>
    state.dashboard.groups;

// ─── Derived selectors (memoized — these return new array references) ─────────

// Returns only classes with status "active"
export const selectActiveClasses = createSelector(
    selectClasses,
    (classes) => classes.filter((c) => c.status === "active"),
);

// Returns only pinned updates
export const selectPinnedUpdates = createSelector(
    selectUpdates,
    (updates) => updates.filter((u) => u.isPinned),
);

// Returns updates that have a future eventAt date
export const selectUpcomingEvents = createSelector(
    selectUpdates,
    (updates) =>
        updates.filter(
            (u) => u.eventAt && new Date(u.eventAt) > new Date(),
        ),
);