"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Bell,
  Search,
  BookOpen,
  FlaskConical,
  Megaphone,
  Download,
  MessageCircle,
  LucideIcon,
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

const GlobalUpdates: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Demo Data - Easy to replace with API
  const filters: Filter[] = [
    { id: "all", label: "All Updates" },
    { id: "exams", label: "Exams" },
    { id: "tests", label: "Class Tests" },
    { id: "vivas", label: "Vivas" },
    { id: "assignments", label: "Assignments" },
  ];

  const updates: Update[] = [
    {
      _id: "1",
      type: "featured",
      priority: "urgent",
      title: "Final Exam Schedule Released",
      courseCode: "CSE 401",
      courseName: "Software Engineering",
      description:
        "The final exam schedule has been released. Please check your email for details.",
      author: {
        _id: "12345",
        name: "Dr. Ahmed",
        initials: "DA",
      },
      timestamp: "2h ago",
      date: "today",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDARn0zGyhXFkkwkzDTElLido6Q3C_BNsB0ke-3n-luKOI7HKiyENh3z_goh8wvtcHdtJnlcmbwyGHJCcgUT0UEak_E8HUQWdiOaytTsUUVghuiQqpwa5r8-aTX5gM8YnIkKJzasNcT75ziYO50Klc7c3C0Dn0zXHBahyFhtF2LleVyr4p25pKL7FYZ_U8AZtVlxpf5EGbDnymJohtJRGB9Q9EajhWcGp2LbXmglip6H0JBIasak2Iol1Ga9lbgYn_YF3Oui3lN7lHr",
    },
    {
      _id: "2",
      type: "standard",
      icon: BookOpen,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Chapter 5 Quiz",
      courseCode: "MATH 203",
      courseName: "Linear Algebra",
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
      courseCode: "PHY 102",
      courseName: "Physics II",
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
      title: "Guest Lecture",
      courseCode: "BUS 301",
      courseName: "Business Ethics",
      description:
        "Don't miss tomorrow's guest lecture by Mr. Sarah Jenkins from TechCorp. Attendance is mandatory.",
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
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-slate-50 pb-4 pt-4 px-4 lg:px-8 border-b border-slate-200">
        <div className="flex items-center gap-3 max-w-7xl mx-auto">
          <button className="group flex items-center justify-center p-2 rounded-lg hover:bg-white transition-colors border border-slate-200 bg-white cursor-pointer hover:border-blue-600/30">
            <ArrowLeft
              className="text-slate-900 group-hover:text-blue-600 group-hover:-translate-x-0.5 transition-all duration-200"
              size={18}
            />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 truncate">
              Global Updates
            </h1>
            <p className="text-slate-500 text-sm truncate">
              Stay informed with the latest updates across all your classes
            </p>
          </div>
          <button className="p-2 rounded-full hover:bg-white border border-slate-200 bg-white text-slate-900 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto mt-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={20} />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2.5 border-none outline-none rounded-xl bg-slate-200/70 text-slate-900 placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:shadow-sm shadow-blue-500 focus:bg-white transition-all text-sm font-medium"
              placeholder="Search updates, classes..."
              type="text"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="max-w-7xl mx-auto mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                activeFilter === filter.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 border border-transparent hover:border-slate-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          {/* Main Content: Feed */}
          <main className="space-y-4">
            {Object.entries(groupedUpdates).map(([dateKey, dateUpdates]) => (
              <div key={dateKey}>
                {/* Date Header */}
                {dateKey !== "today" || dateUpdates[0].type !== "featured" ? (
                  <div className="flex items-center gap-4 py-2">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                      {dateLabels[dateKey] || dateKey}
                    </h3>
                    <div className="h-px flex-1 bg-slate-200"></div>
                  </div>
                ) : null}

                {/* Updates */}
                {dateUpdates.map((update) => {
                  // Featured Update
                  if (update.type === "featured") {
                    return (
                      <div
                        key={update._id}
                        className="relative overflow-hidden rounded-2xl shadow-sm bg-white group cursor-pointer transition-transform active:scale-[0.98] mb-4"
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                        <div
                          className="h-48 w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                          style={{
                            backgroundImage: `url('${update.image}')`,
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                          <div className="flex items-center gap-2 mb-2">
                            {update.priority === "urgent" && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500 text-white">
                                Urgent
                              </span>
                            )}
                            <span className="text-xs font-medium text-slate-200">
                              {update.courseCode}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-white leading-tight mb-1">
                            {update.title}
                          </h2>
                          <div className="flex items-center text-slate-300 text-xs gap-2">
                            <div className="w-5 h-5 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center text-[10px] font-bold">
                              {update.author?.initials}
                            </div>
                            <span>
                              {update.author?.name} • {update.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Standard Update
                  const Icon = update.icon;
                  return (
                    <article
                      key={update._id}
                      className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3 active:bg-slate-50 transition-colors mb-4"
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
                              {update.courseCode} • {update.courseName}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-medium text-slate-400">
                          {update.timestamp}
                        </span>
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
                          <button className="text-blue-600 hover:text-blue-800">
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default GlobalUpdates;