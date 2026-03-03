"use client";

import React, { useState } from "react";
import { BookOpen, FlaskConical, Megaphone } from "lucide-react";
import SearchBar from "./_components/SearchBar";
import FilterChips from "./_components/FilterChips";
import CreateUpdateCard from "./_components/CreateUpdateCard";
import UpdatesList from "./_components/UpdatesList";
import { Update, Filter } from "@/types/update";

export default function UpdatesPage({
  params,
}: {
  params: { classId: string };
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters: Filter[] = [
    { id: "all", label: "All Updates" },
    { id: "exams", label: "Exams" },
    { id: "tests", label: "Class Tests" },
    { id: "assignments", label: "Assignments" },
    { id: "announcements", label: "Announcements" },
  ];

  const updates: Update[] = [
    {
      _id: "2",
      type: "standard",
      icon: BookOpen,
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
      title: "Chapter 5 Quiz Announcement",
      courseCode: "CS-101",
      courseName: "Advanced Mathematics",
      description:
        "Reminder: The quiz on Chapter 5 will cover Eigenvalues and Eigenvectors. Please bring your calculators.",
      timestamp: "10:30 AM",
      date: "today",
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
      courseCode: "CS-101",
      courseName: "Advanced Mathematics",
      description:
        "The submission portal for Lab 3 is now open. Deadline is extended to Friday midnight.",
      timestamp: "9:15 AM",
      date: "today",
      attachment: {
        name: "Lab_3_Guidelines_Final_v2.pdf",
        size: "2.4 MB",
        type: "pdf",
      },
    },
    {
      _id: "4",
      type: "announcement",
      icon: Megaphone,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Guest Lecture Tomorrow",
      courseCode: "CS-101",
      courseName: "Advanced Mathematics",
      description:
        "Don't miss tomorrow's guest lecture by Dr. Sarah Jenkins from TechCorp. Attendance is mandatory.",
      timestamp: "Yesterday",
      date: "yesterday",
      attachment: {
        name: "Guest_Lecture_Slides",
        size: "1.2 MB",
        type: "link",
      },
    },
  ];

  // Group updates by date
  const groupedUpdates = updates.reduce(
    (acc, update) => {
      const dateKey = update.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(update);
      return acc;
    },
    {} as Record<string, Update[]>,
  );

  const dateLabels: Record<string, string> = {
    today: "Today",
    yesterday: "Yesterday",
  };

  return (
    <>
      {/* Filters & Search */}
      <div className="p-4 flex flex-col gap-3 bg-slate-100/50 mx-auto w-full">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterChips
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Updates Content */}
      <div className="px-4 py-2 space-y-4 pb-8 mx-auto w-full">
        <CreateUpdateCard classId={params.classId} />
        <UpdatesList groupedUpdates={groupedUpdates} dateLabels={dateLabels} />
      </div>
    </>
  );
}
