"use client";

import React, { useState } from "react";
import {
  Search,
  BookOpen,
  FlaskConical,
  Megaphone,
  Download,
  MessageCircle,
  LucideIcon,
  Plus,
} from "lucide-react";

// Types
interface Update {
  _id: string;
  type: "featured" | "standard" | "attachment" | "announcement";
  priority?: "urgent" | "normal";
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  courseCode?: string;
  courseName?: string;
  description: string;
  author?: {
    _id: string;
    name: string;
    avatar?: string;
    initials?: string;
  };
  timestamp: string;
  date: string;
  image?: string;
  attachment?: {
    name: string;
    size: string;
    type: string;
    url?: string;
  };
  engagement?: {
    avatars?: string[];
    commentCount?: number;
  };
}

interface Filter {
  id: string;
  label: string;
}

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
        name: "Guest_Lecture_Slides.pdf",
        size: "1.2 MB",
        type: "pdf",
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
        {/* Search */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={20} />
          </div>
          <input
            className="block w-full rounded-xl border-none bg-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            placeholder="Search updates, announcements..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((filter) => (
            <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  activeFilter === filter.id
                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                    : "bg-slate-200 text-slate-600 border border-transparent hover:border-slate-200"
                }`}
              >
                {filter.label}
              </button>
          ))}
        </div>
      </div>

      {/* Updates Content */}
      <div className="px-4 py-2 space-y-4 pb-8 mx-auto w-full">
        {/* Add New Update - Dashed Border */}
        <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-transparent p-6 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Plus className="text-primary" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">Post New Update</h4>
            <p className="text-sm text-slate-600 mt-1">
              Share announcements, assignments, or important information
            </p>
          </div>
          <button className="mt-2 px-6 py-2.5 rounded-xl border border-primary/30 bg-white/50 text-primary font-bold text-sm hover:bg-blue-50 transition-colors flex items-center gap-2">
            <span>Create Update</span>
          </button>
        </div>

        {Object.entries(groupedUpdates).map(([dateKey, dateUpdates]) => (
          <div key={dateKey}>
            {/* Date Header */}
            {dateKey !== "today" || dateUpdates[0].type !== "featured" ? (
              <div className="flex items-center gap-4 py-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {dateLabels[dateKey] || dateKey}
                </h3>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>
            ) : null}

            {/* Updates */}
            {dateUpdates.map((update) => {
              // Standard Update
              const Icon = update.icon;
              return (
                <article
                  key={update._id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3 hover:border-primary/30 transition-all mb-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <div
                          className={`w-10 h-10 rounded-full ${update.iconBg} flex items-center justify-center ${update.iconColor}`}
                        >
                          <Icon size={20} />
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          {update.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {update.courseCode} • {update.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {update.description}
                  </p>

                  {/* Attachment */}
                  {update.attachment && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 rounded">
                        <Download size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {update.attachment.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {update.attachment.size}
                        </p>
                      </div>
                      <button className="text-primary hover:text-blue-800">
                        <Download size={20} />
                      </button>
                    </div>
                  )}

                  {/* Engagement */}
                  {update.engagement && (
                    <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                      <div className="flex -space-x-2">
                        {update.engagement.avatars?.map((avatar, idx) => (
                          <img
                            key={idx}
                            alt="User Avatar"
                            className="w-6 h-6 rounded-full border-2 border-white"
                            src={avatar}
                          />
                        ))}
                        {update.engagement.commentCount &&
                          update.engagement.commentCount > 2 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                              +{update.engagement.commentCount - 2}
                            </div>
                          )}
                      </div>
                      {update.engagement.commentCount && (
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <MessageCircle size={14} />
                          {update.engagement.commentCount} comments
                        </span>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}