"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";

// UI Components
import { Filters as FilterChips } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/EmptyState";
import { TopLoader } from "@/components/ui/TopLoader";
import CreateUpdateCard from "./_components/CreateUpdateCard";
import DateHeader from "./_components/DateHeader";
import UpdateCard from "./_components/UpdateCard";
import SearchBar from "./_components/SearchBar";

// Store & Thunks
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchClassUpdate } from "@/store/features/classes/thunks/fetch-class-update.thunk";
import { togglePinClassUpdate } from "@/store/features/classes/thunks/toggle-pin-class-update.thunk";
import { deleteSingleClassUpdate } from "@/store/features/classes/thunks/delete-single-class-update.thunk";

// Memoized Selectors (Abstracted Logic)
import {
  selectGroupedUpdates,
  selectClassUpdatesLoading
} from "@/store/features/classes/selectors/class-updates.selectors";

// Types & Configurations
import { UPDATE_TYPE_CONFIG, UpdateCategory } from "@/types/update.types";

interface Filter {
  id: string;
  label: string;
}

export default function UpdatesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();

  // Extract classId from URL params
  const classId = params.classId as string;

  // Local state for UI controls (Filtering and Searching)
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * 1. DATA SELECTION
   * We use selectGroupedUpdates to get data that is already filtered, 
   * sorted (Pinned -> EventAt -> CreatedAt), and grouped by Relative Dates.
   */
  const { grouped, sortedDateKeys } = useAppSelector((state) =>
    selectGroupedUpdates(state, searchQuery, activeFilter)
  );

  // Selector for the raw updates array (used to prevent redundant fetching)
  const { updates } = useAppSelector((state) => state.classes.fetchClassUpdates);

  // Selector for class details (to check permissions like isAdmin)
  const { classDetails } = useAppSelector((state) => state.classes.fetchSingleClass);

  // Select loading state for various operations (fetch, delete, pin)
  const loading = useAppSelector(selectClassUpdatesLoading);

  /**
   * 2. INITIALIZATION
   * Fetch updates from the server if they haven't been loaded yet.
   */
  useEffect(() => {
    if (!classId || !classDetails?.classId) return;
    if (updates.length > 0) return; // Skip if data already exists in store

    dispatch(fetchClassUpdate(classId));
  }, [dispatch, classId, classDetails?.classId, updates.length]);

  /**
   * 3. UI HELPERS
   * Map the configuration object to a list of filters for the FilterChips component.
   */
  const filters: Filter[] = [
    { id: "all", label: "All Updates" },
    ...Object.entries(UPDATE_TYPE_CONFIG).map(([key, config]) => ({
      id: key,
      label: config.label + "s",
    })),
  ];

  /**
   * 4. EVENT HANDLERS
   */

  // Handles Pining or Unpinning an update
  const handleTogglePin = async (updateId: string, isPinned: boolean) => {
    const promise = dispatch(
      togglePinClassUpdate({ classId, updateId, isPinned })
    ).unwrap();

    toast.promise(promise, {
      loading: "Updating pin status...",
      success: !isPinned ? "Pinned successfully" : "Unpinned successfully",
      error: (err) => err.message || "Failed to update pin",
    });
  };

  // Handles permanent deletion of an update
  const handleDelete = async (updateId: string) => {
    const promise = dispatch(deleteSingleClassUpdate({ classId, updateId })).unwrap();

    toast.promise(promise, {
      loading: "Deleting update...",
      success: "Update deleted successfully",
      error: (err) => err.message || "Failed to delete",
    });
  };

  // Determine user permissions
  const isAdmin = classDetails?.isInstructor || classDetails?.isAssistant;

  // Check if current list is empty after filtering/searching
  const isEmpty = sortedDateKeys.length === 0 && !loading.fetch;

  return (
    <main className="relative bg-slate-50 flex flex-col min-h-screen">
      {/* Sticky Top Header: Search and Filter Actions */}
      <div className="sticky top-0 z-10 p-4 flex flex-col gap-3 bg-white border-b border-slate-200">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterChips filters={filters} active={activeFilter} onChange={setActiveFilter} />
      </div>

      <div className="flex-1 px-4 py-4 space-y-6 pb-24 lg:pb-8">
        {/* Visual loader for any ongoing network activity */}
        <TopLoader isLoading={loading.fetch || loading.delete || loading.togglePin} />

        {/* Post Creation area: Only visible to authorized users */}
        {isAdmin && (
          <div className="shrink-0">
            <CreateUpdateCard classId={classId} />
          </div>
        )}

        {/* Conditional Rendering: Empty State vs Update List */}
        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center py-10">
            <EmptyState
              icon={GraduationCap}
              title={searchQuery ? "No matches found" : "No updates yet"}
              description={
                searchQuery
                  ? `Couldn't find anything for "${searchQuery}"`
                  : "Important announcements and class updates will appear here."
              }
            />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Iterate through Group Keys (e.g., "Pinned", "Today", "Tomorrow") */}
            {sortedDateKeys.map((dateKey) => (
              <section key={dateKey} className="space-y-3">
                <DateHeader label={dateKey} />

                <div className="space-y-3">
                  {/* Iterate through updates within this specific date group */}
                  {grouped[dateKey].map((update) => {
                    const config = UPDATE_TYPE_CONFIG[update.category as UpdateCategory];
                    return (
                      <UpdateCard
                        key={update._id}
                        icon={config.icon}
                        iconBg={config.iconBg}
                        iconColor={config.iconColor}
                        title={update.title}
                        createdAt={update.createdAt}
                        updatedAt={update.updatedAt}
                        eventAt={update.eventAt ?? undefined}
                        description={update.description}
                        materials={update.materials}
                        postedBy={update.postedBy}
                        isPinned={update.isPinned}
                        onTogglePin={() => handleTogglePin(update._id, update.isPinned)}
                        onEdit={() => router.push(`/classes/${classId}/updates/${update._id}`)}
                        onDelete={() => handleDelete(update._id)}
                        showActions={isAdmin}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}