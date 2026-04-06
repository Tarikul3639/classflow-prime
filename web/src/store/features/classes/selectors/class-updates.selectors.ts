import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/store/store";
import { formatRelativeDate } from "@/utils/date.utils";
import { ClassUpdateItem } from "@/types/update.types";

/**
 * 1. Base Selector
 * Extracts the raw fetchClassUpdates state from the store.
 */
const selectClassUpdatesState = (state: RootState) => state.classes.fetchClassUpdates;

/**
 * 2. Filtered and Sorted Selector
 * Handles search queries, category filters, and complex sorting rules.
 * Memoized to prevent unnecessary re-calculations.
 */
export const selectFilteredAndSortedUpdates = createSelector(
    [
        selectClassUpdatesState,
        (_: RootState, searchQuery: string) => searchQuery,
        (_: RootState, __: string, activeFilter: string) => activeFilter,
    ],
    (classUpdatesState, searchQuery, activeFilter) => {
        const { updates } = classUpdatesState;

        // Filter by Search Query (Title/Description) and Category
        const filtered = updates.filter((u: ClassUpdateItem) => {
            const matchesSearch =
                u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === "all" || u.category === activeFilter;
            return matchesSearch && matchesFilter;
        });

        // Sorting Logic:
        // 1. Pinned items always at the top.
        // 2. Upcoming events (eventAt) closest to today first.
        // 3. Regular updates by creation date (Newest first).
        return [...filtered].sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;

            // If both have event dates, sort ascending (closest future event first)
            if (a.eventAt && b.eventAt) {
                return new Date(a.eventAt).getTime() - new Date(b.eventAt).getTime();
            }

            // Items with event dates take precedence over items without
            if (a.eventAt && !b.eventAt) return -1;
            if (!a.eventAt && b.eventAt) return 1;

            // Fallback: Newest created first
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }
);

/**
 * 3. Grouped Selector (Final output for Component)
 * Transforms the sorted array into an object grouped by relative date keys.
 */
export const selectGroupedUpdates = createSelector(
    [selectFilteredAndSortedUpdates],
    (sortedUpdates) => {
        const groups: Record<string, ClassUpdateItem[]> = {};

        // Grouping updates into date buckets
        sortedUpdates.forEach((u) => {
            const dateKey = u.isPinned
                ? "Pinned Updates"
                : formatRelativeDate(u.eventAt ?? u.createdAt, {
                    showTime: false,
                    showYear: true,
                    relativeDaysLimit: 3,
                });

            if (!groups[dateKey]) groups[dateKey] = [];
            groups[dateKey].push(u);
        });

        // Sort the Group Headers (Keys)
        const sortedKeys = Object.keys(groups).sort((a, b) => {
            // Always put 'Pinned Updates' section first
            if (a === "Pinned Updates") return -1;
            if (b === "Pinned Updates") return 1;

            const priority = ["Today", "Tomorrow", "Yesterday"];
            const aP = priority.indexOf(a);
            const bP = priority.indexOf(b);

            // Handle Priority list (Today > Tomorrow > Yesterday)
            if (aP !== -1 || bP !== -1) {
                return (aP === -1 ? Infinity : aP) - (bP === -1 ? Infinity : bP);
            }

            const dateA = new Date(a).getTime();
            const dateB = new Date(b).getTime();
            const now = new Date().getTime();

            // If both are future dates, show closest first
            if (dateA > now && dateB > now) return dateA - dateB;

            // Default: Latest historical date first
            return dateB - dateA;
        });

        return { grouped: groups, sortedDateKeys: sortedKeys };
    }
);

/**
 * 4. Helper Selectors
 * Simple selectors for UI loading and error states.
 */
export const selectClassUpdatesLoading = createSelector(
    [selectClassUpdatesState],
    (state) => state.loading
);

export const selectClassUpdatesError = createSelector(
    [selectClassUpdatesState],
    (state) => state.error
);