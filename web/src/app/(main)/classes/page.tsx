"use client";

import React, { useState } from "react";
import { Search, Users, Plus, UserPlus, BookOpen } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Classes: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "archived", label: "Archived" },
  ];

  const classes = [
    {
      id: 1,
      department: "Computer Science",
      title: "Data Structures & Algorithms",
      students: 45,
      instructor: "Prof. Alan Turing",
      semester: "Spring 2025",
      themeColor: "#3A8BFF",
      initials: null,
      coverImage: "https://i.pravatar.cc/150?img=12",
      status: "active",
    },
    {
      id: 2,
      department: "Software Engineering",
      title: "Web Development",
      students: 60,
      instructor: "Linus Torvalds",
      semester: "Spring 2025",
      themeColor: "#22C55E",
      initials: "LT",
      coverImage:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      status: "active",
    },
    {
      id: 3,
      department: "Artificial Intelligence",
      title: "Machine Learning",
      students: 38,
      instructor: "Andrew Ng",
      semester: "Spring 2025",
      themeColor: "#F59E0B",
      initials: "AN",
      coverImage:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      status: "active",
    },
    {
      id: 4,
      department: "Mathematics",
      title: "Linear Algebra",
      students: 52,
      instructor: "Gilbert Strang",
      semester: "Spring 2025",
      themeColor: "#EF4444",
      initials: "GS",
      coverImage:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      status: "active",
    },
    {
      id: 5,
      department: "Physics",
      title: "Quantum Mechanics",
      students: 28,
      instructor: "Richard Feynman",
      semester: "Spring 2025",
      themeColor: "#8B5CF6",
      initials: "RF",
      coverImage:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      status: "archived",
    },
    {
      id: 6,
      department: "Business",
      title: "Entrepreneurship",
      students: 34,
      instructor: "Elon Musk",
      semester: "Spring 2025",
      themeColor: "#14B8A6",
      initials: "EM",
      avatar: null,
      status: "active",
    },
    {
      id: 7,
      department: "Design",
      title: "UI/UX Fundamentals",
      students: 41,
      instructor: "Don Norman",
      semester: "Spring 2025",
      themeColor: "#EC4899",
      initials: "DN",
      avatar: null,
      status: "active",
    },
    {
      id: 8,
      department: "Cyber Security",
      title: "Ethical Hacking",
      students: 25,
      instructor: "Kevin Mitnick",
      semester: "Spring 2025",
      themeColor: "#0EA5E9",
      initials: "KM",
      avatar: null,
      status: "archived",
    },
  ];

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
        <div className="px-4 lg:px-8 pt-4 pb-4">
          <div className="flex items-center gap-3 mx-auto mb-2">
            <div className="flex items-center gap-4 flex-1 pb-4 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
                <BookOpen className="size-5.5" />
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">
                  My Classes
                </h1>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-slate-600 text-xs font-medium">
                    {classes.length} active sessions
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/classes/join"
                className="flex items-center gap-2 bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <UserPlus size={18} />
                <span>Join</span>
              </Link>
              <Link
                href="/classes/create"
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 border border-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
              >
                <Plus size={18} />
                <span>Create</span>
              </Link>
            </div>

            {/* Mobile Buttons */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                href="/classes/join"
                className="flex items-center justify-center w-10 h-10 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
              >
                <UserPlus size={18} />
              </Link>
              <Link
                href="/classes/create"
                className="flex items-center justify-center w-10 h-10 bg-primary border border-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Plus size={18} />
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-slate-400" size={18} />
              </div>
              <input
                className="block w-full rounded-xl border-none bg-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="Search by class name or code..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-4 lg:px-8 pb-4">
          <div className="mx-auto flex gap-2 overflow-x-auto no-scrollbar">
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
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        <div className="mx-auto px-4 lg:px-8 py-6">
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((classItem) => (
              <Link
                href={`/classes/${classItem.id}/overview`}
                key={classItem.id}
                className="group relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                style={{
                  border: `1px solid ${classItem.themeColor}20`,
                  boxShadow: `0 2px 10px ${classItem.themeColor}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${classItem.themeColor}60`;
                  e.currentTarget.style.boxShadow = `0 4px 50px ${classItem.themeColor}25`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${classItem.themeColor}30`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* --- Top Image/Banner Section --- */}
                <div className="relative h-32 overflow-hidden bg-slate-100">
                  {/* Background Image */}

                  <Avatar className="absolute inset-0 w-full h-full object-cover rounded-none">
                    <AvatarImage className="object-cover"
                      src={classItem.coverImage || undefined}
                      alt={classItem.title}
                    />
                    <AvatarFallback
                      className="rounded-none w-full h-full text-4xl font-bold tracking-widest flex items-center justify-center"
                      style={{
                        backgroundColor:
                          `${classItem.themeColor}50` || "#0066FF",
                        color: classItem.themeColor,
                      }}
                    >
                      {classItem.title
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Badge: Active/Status */}
                  <div
                    className="absolute top-3 right-3 text-[11px] font-semibold capitalize tracking-widest px-2 py-0.5 pb-1 rounded-sm text-white"
                    style={{
                      backgroundColor: classItem.themeColor || "#0066FF",
                    }}
                  >
                    {classItem.status || "Active"}
                  </div>

                  {/* Department Label Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span
                      className="inline-block px-2.5 py-0.75 bg-white/90 backdrop-blur-md rounded-sm text-[10px] font-semibold uppercase tracking-wider"
                      style={{ color: classItem.themeColor || "#0066FF" }}
                    >
                      {classItem.department}
                    </span>
                  </div>
                </div>

                {/* --- Content Section --- */}
                <div className="p-4 space-y-3 flex flex-col flex-1 bg-white">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#203044] leading-tight line-clamp-2">
                    {classItem.title}
                  </h3>

                  {/* Instructor Info */}
                  <div className="flex items-center gap-2 ml-1">
                    <Avatar className="w-8 h-8 border border-slate-200">
                      <AvatarImage
                        src={classItem.avatar || undefined}
                        alt={classItem.instructor}
                      />
                      <AvatarFallback
                        className="w-full h-full text-xs font-semibold p-1"
                        style={{
                          backgroundColor: classItem.themeColor,
                          color: "#fff",
                        }}
                      >
                        {classItem.initials ||
                          classItem.instructor
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-[9px] uppercase font-bold leading-none text-black opacity-60">
                        Instructor
                      </p>
                      <span className="text-xs font-semibold text-on-surface">
                        {classItem.instructor}
                      </span>
                    </div>
                  </div>

                  {/* Divider and Footer */}
                  <div className="pt-2 mt-auto border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#4d5d73]">
                      {/* Material Icon (Using Lucide React if available or standard span) */}
                      <Users size={16} className="text-slate-400" />
                      <span className="text-xs font-semibold">
                        {classItem.students} Students
                      </span>
                    </div>

                    {/* Semester Tag */}
                    <div
                      className="text-xs font-semibold px-2 py-1 rounded"
                      style={{
                        backgroundColor:
                          `${classItem.themeColor}15` || "#0066FF15",
                        color: classItem.themeColor || "#0066FF",
                      }}
                    >
                      {classItem.semester}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Classes;
