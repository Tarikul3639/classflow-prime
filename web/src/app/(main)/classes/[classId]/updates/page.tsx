"use client";

import { useState, useEffect } from "react";
import { Filters as FilterChips } from "@/components/ui/Filters";
import { EmptyState } from "@/components/ui/EmptyState";
import { BellOff } from "lucide-react";

import CreateUpdateCard from "./_components/CreateUpdateCard";
import DateHeader from "./_components/DateHeader";
import UpdateCard from "./_components/UpdateCard";
import SearchBar from "./_components/SearchBar";

import { getDateKey, formatTime, formatDate } from "@/utils/date.utils";
import { UPDATE_TYPE_CONFIG, UpdateType } from "@/types/update.types";

import { fetchClassUpdate } from "@/store/features/classes/thunks/fetch-class-update.thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useParams } from "next/navigation";

interface Filter {
  id: string;
  label: string;
}

export default function UpdatesPage() {
  const dispatch = useAppDispatch();
  const params = useParams();
  const classId = params.classId as string;
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { updates, loading, error } = useAppSelector(
    (state) => state.classes.fetchClassUpdates,
  );
  const { classDetails } = useAppSelector((state) => state.classes.fetchSingleClass);

  useEffect(() => {
    if (!classId || classId === "undefined") return;
    dispatch(fetchClassUpdate(classId));
  }, [dispatch, classId]);

  const filters: Filter[] = [
    { id: "all", label: "All Updates" },
    ...Object.entries(UPDATE_TYPE_CONFIG).map(([key, config]) => ({
      id: key,
      label: config.label + "s",
    })),
  ];

  // const updates: ClassUpdateItem[] = [
  //   {
  //     _id: "2",
  //     classId: "cls-1",
  //     type: "assignment",
  //     title: "Chapter 5 Quiz",
  //     description:
  //       "Reminder: The quiz on Chapter 5 will cover Eigenvalues and Eigenvectors.",
  //     createdAt: "2026-03-24T08:30:00Z",
  //     eventAt: "2026-03-24T10:30:00Z",
  //     isPinned: false,
  //     postedBy: { _id: "u1", name: "John Doe", avatarUrl: null },
  //     attachments: [],
  //   },
  //   {
  //     _id: "3",
  //     classId: "cls-1",
  //     type: "material",
  //     title: "Lab Report Guidelines",
  //     description:
  //       "The submission portal for Lab 3 is now open. Deadline is extended.",
  //     createdAt: "2026-03-26T09:15:00Z",
  //     eventAt: "2026-03-26T23:59:00Z",
  //     isPinned: false,
  //     postedBy: { _id: "u1", name: "John Doe", avatarUrl: null },
  //     attachments: [
  //       {
  //         _id: "att-1",
  //         name: "Lab_3_Guidelines.pdf",
  //         size: "2.4 MB",
  //         url: "https://example.com/lab3.pdf",
  //         type: "pdf",
  //       },
  //     ],
  //   },
  // ];

  // Filter and group updates
  const filteredUpdates = updates.filter((update) => {
    const matchesSearch =
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || update.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Group updates by date key (today, tomorrow, yesterday, or formatted date)
  const groupedUpdates = filteredUpdates.reduce(
    (acc, update) => {
      const dateKey = getDateKey(update.eventAt ?? update.createdAt);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(update);
      return acc;
    },
    {} as Record<string, typeof filteredUpdates>,
  );

  return (
    <div className="min-h-screen">
      <div className="p-4 flex flex-col gap-3 bg-slate-100/50 mx-auto w-full">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterChips
          filters={filters}
          active={activeFilter}
          onChange={setActiveFilter}
        />
      </div>

      <div className="px-4 py-2 space-y-4 pb-8 mx-auto w-full">
        {classDetails?.isInstructor || classDetails?.isAssistant ? (
          <CreateUpdateCard classId={classId} />
        ) : null}

        {Object.entries(groupedUpdates).map(([dateKey, dateUpdates]) => (
          <div key={dateKey} className="space-y-3">
            <DateHeader label={dateKey} />

            <div className="space-y-3">
              {dateUpdates.map((update) => {
                const config = UPDATE_TYPE_CONFIG[update.type as UpdateType];

                return (
                  <UpdateCard
                    key={update._id}
                    icon={config.icon}
                    iconBg={config.iconBg}
                    iconColor={config.iconColor}
                    title={update.title}
                    timestamp={formatTime(update.createdAt)}
                    eventDate={
                      update.eventAt
                        ? formatDate(new Date(update.eventAt))
                        : undefined
                    }
                    eventTime={
                      update.eventAt ? formatTime(update.eventAt) : undefined
                    }
                    description={update.description}
                    attachment={update.attachments}
                    postedBy={update.postedBy}
                    isPinned={update.isPinned}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {Object.keys(groupedUpdates).length === 0 && !loading && (
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
