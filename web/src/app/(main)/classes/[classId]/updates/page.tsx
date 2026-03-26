"use client";

import { useState, useEffect } from "react";
import { Filters as FilterChips } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/EmptyState";
import { BellOff } from "lucide-react";

import CreateUpdateCard from "./_components/CreateUpdateCard";
import DateHeader from "./_components/DateHeader";
import UpdateCard from "./_components/UpdateCard";
import SearchBar from "./_components/SearchBar";

import { formatRelativeDate } from "@/utils/date.utils";
import { UPDATE_TYPE_CONFIG, UpdateCategory } from "@/types/update.types";

import { fetchClassUpdate } from "@/store/features/classes/thunks/fetch-class-update.thunk";
import { togglePinClassUpdate } from "@/store/features/classes/thunks/toggle-pin-class-update.thunk";
import { deleteSingleClassUpdate } from "@/store/features/classes/thunks/delete-single-class-update.thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

interface Filter {
  id: string;
  label: string;
}

export default function UpdatesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { updates, loading } = useAppSelector(
    (state) => state.classes.fetchClassUpdates,
  );
  const { classDetails } = useAppSelector(
    (state) => state.classes.fetchSingleClass,
  );

  const { error } = useAppSelector((state) => state.classes.fetchClassUpdates);

  useEffect(() => {
    if (classId && classId !== "undefined") {
      dispatch(fetchClassUpdate(classId));
    }
  }, [dispatch, classId]);

  const filters: Filter[] = [
    { id: "all", label: "All Updates" },
    ...Object.entries(UPDATE_TYPE_CONFIG).map(([key, config]) => ({
      id: key,
      label: config.label + "s",
    })),
  ];

  // ১. Filter by search & category
  const filteredUpdates = updates.filter((u) => {
    const matchesSearch =
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || u.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // ২. Sort updates: pinned first, then by eventAt/createdAt descending
  const sortedUpdates = filteredUpdates.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (
      new Date(b.eventAt ?? b.createdAt).getTime() -
      new Date(a.eventAt ?? a.createdAt).getTime()
    );
  });

  // ৩. Group by relative date
  const grouped: Record<string, typeof sortedUpdates> = {};
  sortedUpdates.forEach((u) => {
    const dateKey = formatRelativeDate(u.eventAt ?? u.createdAt, {
      showTime: false,
      showYear: true,
      relativeDaysLimit: 3,
    });
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(u);
  });

  // ৪. Sort headers: Today > Tomorrow > Yesterday > others descending
  const priority = ["Today", "Tomorrow", "Yesterday"];
  const sortedDateKeys = Object.keys(grouped).sort((a, b) => {
    const aP = priority.indexOf(a);
    const bP = priority.indexOf(b);
    if (aP !== -1 || bP !== -1)
      return (aP === -1 ? Infinity : aP) - (bP === -1 ? Infinity : bP);
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const handleTogglePin = async (updateId: string, isPinned: boolean) => {
    // 1. Optimistic UI update
    const promise = dispatch(
      togglePinClassUpdate({ classId, updateId, isPinned }),
    ).unwrap();

    // 2. Show toast notifications based on the promise state
    toast.promise(promise, {
      loading: "Updating pin status...",
      success: () => {
        return !isPinned
          ? "Update pinned successfully"
          : "Update unpinned successfully";
      },
      error: (err) => {
        return err.message || "Failed to update pin status";
      },
      position: "top-center",
    });
  };

  // Delete handler
  const handleDelete = async (updateId: string) => {
    const promise = dispatch(
      deleteSingleClassUpdate({ classId, updateId }),
    ).unwrap();

    toast.promise(promise, {
      loading: "Deleting update...",
      success: "Update deleted successfully",
      error: (err) => err.message || "Failed to delete the update",
      position: "top-center",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Search + Filters */}
      <div className="p-4 flex flex-col gap-3 bg-slate-100/50 mx-auto w-full">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterChips
          filters={filters}
          active={activeFilter}
          onChange={setActiveFilter}
        />
      </div>

      <div className="px-4 py-2 space-y-4 pb-8 mx-auto w-full">
        {/* Create Card */}
        {(classDetails?.isInstructor || classDetails?.isAssistant) && (
          <CreateUpdateCard classId={classId} />
        )}

        {/* Updates grouped by date */}
        {sortedDateKeys.map((dateKey) => (
          <div key={dateKey} className="space-y-3">
            <DateHeader label={dateKey} />
            <div className="space-y-3">
              {grouped[dateKey].map((update) => {
                const config =
                  UPDATE_TYPE_CONFIG[update.category as UpdateCategory];
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
                    onTogglePin={() =>
                      handleTogglePin(update._id, update.isPinned)
                    }
                    onEdit={() =>
                      router.push(`/classes/${classId}/updates/${update._id}`)
                    }
                    onDelete={() => handleDelete(update._id)}
                    showActions={
                      classDetails?.isInstructor || classDetails?.isAssistant
                    }
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {sortedDateKeys.length === 0 && !loading && (
          <EmptyState
            icon={BellOff}
            title="No updates yet"
            description="New announcements will appear here."
          />
        )}
      </div>
    </div>
  );
}
