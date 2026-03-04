"use client";

import React, { useState } from "react";
import { BookOpen, FlaskConical, Megaphone } from "lucide-react";
import SearchBar from "./_components/SearchBar";
import { Filters as FilterChips } from "@/components/ui/Filters";
import CreateUpdateCard from "./_components/CreateUpdateCard";
import { Update, Filter } from "@/types/update";
import DateHeader from "./_components/DateHeader";
import UpdateCard from "./_components/UpdateCard";

export default function UpdatesPage({
  params,
}: {
  params: { classId: string };
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters: Filter[] = [
    { id: "all", label: "All Updates" },
    { id: "exam", label: "Exams" },
    { id: "test", label: "Class Tests" },
    { id: "assignment", label: "Assignments" },
    { id: "announcement", label: "Announcements" },
  ];

  const updates: Update[] = [
    {
      _id: "2",
      type: "standard",
      icon: BookOpen,
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
      title: "Chapter 5 Quiz",
      courseCode: "MATH 203",
      courseName: "Linear Algebra",
      description:
        "Reminder: The quiz on Chapter 5 will cover Eigenvalues and Eigenvectors. Please bring your calculators.",
      timestamp: "10:30 AM",
      date: "today",
      eventDate: "Wed, Oct 27",
      eventTime: "10:30 AM",
      engagement: {
        avatars: [
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBf7mfhNK7lu-43GqULI3kmwF4p-wofl4sA54MdriW_v2aB5hqG_8VVoT9hv-cmAfMoOXWdg2A1OXZtGcaGfhRsAoOKb9tDZOqIg0SvI0-ATWchVQzlFZHu1Vkm_yR8H6rJbQv1FC6-5JN3kozaTpMLakt7wR3KHxCkZzWlel6A28j5gX_1Hykz27tDcSP8iYcak23nH7Tg_TBw1qQBnz0ctqH5czh_KyvtFL1xV7rJFoR6qe7OgPUUcViUN-5wJGHYWmfDwNYq2-G6",
          "https://lh3.googleusercontent.com/aida-public/AB6AXuDQv0O4sE4uqJOCnMqJNEUSyYvC3pfBUoelPXm6FEz973o4kyuwxjiCdzrB5TK6YBAu7Tly6S8X40_3F7BFTBWd6JTBiVsNRYWrD0wHZlL42c5e2ySsw-NURdlQlKnij_CFAJVZxN01PDEa3BU-an_smMTfVDU2Gn9sCpzq2dpTsWLHF0xruqJOJj2Id77YOFsYbscWSX_-UAqCKc-8r-G70jBt6p5f7M1gAn2tlJRu-z8u08lseNIVSYKa9oRU2dEtgSVdt9ojkQDK",
        ],
        commentCount: 14,
      },
    },
    {
      _id: "3",
      type: "attachment",
      icon: FlaskConical,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Lab Report Submission",
      courseCode: "PHY 102",
      courseName: "Physics II",
      description:
        "The submission portal for Lab 3 is now open. Deadline is extended to Friday midnight.",
      timestamp: "9:15 AM",
      date: "today",
      eventDate: "Fri, Oct 29",
      eventTime: "11:59 PM",
      attachment: [
        {
          name: "Lab_3_Guidelines_Final_v2.pdf",
          size: "2.4 MB",
          url: "https://example.com/lab3-guidelines.pdf",
          type: "pdf",
        },
      ],
    },
    {
      _id: "4",
      type: "announcement",
      icon: Megaphone,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Guest Lecture",
      courseCode: "BUS 301",
      courseName: "Business Ethics",
      description:
        "Don't miss tomorrow's guest lecture by Mr. Sarah Jenkins from TechCorp. Attendance is mandatory.",
      timestamp: "Yesterday",
      date: "yesterday",
      eventDate: "Thu, Oct 28",
      eventTime: "2:00 PM",
    },
  ];

  // Filter first
  const filteredUpdates = updates.filter((update) => {
    const matchesSearch =
      update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      update.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all" || update.type === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Group filtered updates by date
  const groupedUpdates = filteredUpdates.reduce(
    (acc, update) => {
      const dateKey = update.date; // ex: "2026-03-05"
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(update);
      return acc;
    },
    {} as Record<string, typeof filteredUpdates>,
  );

  const dateLabels: Record<string, string> = {
    today: "Today",
    yesterday: "Yesterday",
  };

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
        <CreateUpdateCard classId={params.classId} />

        {Object.entries(groupedUpdates).map(([dateKey, dateUpdates]) => (
          <div key={dateKey}>
            {/* Date Header */}
            {dateKey !== "today" || dateUpdates[0].type !== "featured" ? (
              <DateHeader label={dateLabels[dateKey] || dateKey} />
            ) : null}
            
            {/* Updates */}
            <div className="space-y-3">
              {dateUpdates.map((update) => (
                <UpdateCard
                  key={update._id}
                  icon={update.icon}
                  iconBg={update.iconBg}
                  iconColor={update.iconColor}
                  title={update.title}
                  courseCode={update.courseCode}
                  courseName={update.courseName}
                  timestamp={update.timestamp}
                  eventDate={update.eventDate}
                  eventTime={update.eventTime}
                  description={update.description}
                  attachment={update.attachment}
                  engagement={update.engagement}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
