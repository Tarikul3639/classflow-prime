"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Search,
  GraduationCap,
  Users,
  Copy,
  Plus,
  UserPlus,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

// Types
interface ClassItem {
  id: string;
  code: string;
  title: string;
  department: string;
  instructor: string;
  members: number;
  classCode: string;
  avatar: string;
  badgeBg: string;
  badgeText: string;
}

const Classes: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filters = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "archived", label: "Archived" },
  ];

  const classes: ClassItem[] = [
    {
      id: "1",
      code: "CS101",
      title: "Data Structures",
      department: "Computer Science Dept.",
      instructor: "Prof. Alan Turing",
      members: 45,
      classCode: "XJ9-22B",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBWjfyC45SiOxiHCiYxJBYfJWPoz4gipczWkq4afrlMljef2yRNmCTq9TOkKIs9PSCI2Jy7XGRkDLkgYhCPygbjvRh8r0wqzENwKWnQf88zCChwkbbafylrxC6Tn6L5GG6eU85CNdvuZml3Js5NK_V_q-KLiJXSDBaK1kzBM-pfqGJF0KI9zux6NnKUAYhB2ltRnJ470wPpTNaj2BFdb5Jib_9o95IQeB4qI3SMMRF2Rq06fFwVmT6tMjhW_yclTlkHlp9fdPcYMg",
      badgeBg: "bg-blue-50",
      badgeText: "text-pribg-primary",
    },
    {
      id: "2",
      code: "PSY101",
      title: "Intro to Psychology",
      department: "Humanities Dept.",
      instructor: "Dr. Sigmund Freud",
      members: 128,
      classCode: "PSY-ORG",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA6SUD5TiCX469S1NAdZT6QVEeu4NNJMzFseA3lVrwVqxn3cKmjhgZLBtikIWmkUwK__nFcqVoFSFuYVpJy0-LbVo5hwJTV275pnwQLPbe73vV185q9hD_aTPh-Vqi-nAyY1RzAiIHpgNsqlLENPCPqcW4wBZwvLFP3kH50uNmtkXOIK-j8aeDuplIYS7Wn_0nuGMUVlOj7lF7Uv8xjyBPOsoAZ_LW2g5YQC-4gZnKh6M_u7-CYX2kqDNkrzVwD2ckUMsAusufDoQ",
      badgeBg: "bg-purple-50",
      badgeText: "text-purple-600",
    },
    {
      id: "3",
      code: "ART204",
      title: "Modern Art History",
      department: "Arts & Design",
      instructor: "Prof. Frida Kahlo",
      members: 32,
      classCode: "ART-VIV",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCXXxBi8iN6JqDd94orObAYe24RSDuDMLjLJ4lx-fmpw_8tTOuB7GuHMP9g1zadjtHdCXAW2e-TiR1yCeWw2vxCFsdJXVrjV4iMj5NlLVF5i204oDVuiO3gFNtm9OHpulUQ1T3lYlO3f3ABznyLN59mvkA5xbIbrRLEI0UIY-KiO6_YR9DbkC4h2CUT4gnBmU_wTPayx377cOKSm27Pn9wtA5MqATlKfdxxkbXe6DjQ4Ct665N11zoc-aHTV337Ak6RMVMunwFm6g",
      badgeBg: "bg-emerald-50",
      badgeText: "text-emerald-600",
    },
    {
      id: "4",
      code: "PHY301",
      title: "Quantum Physics",
      department: "Physics Dept.",
      instructor: "Dr. Marie Curie",
      members: 18,
      classCode: "QTM-PHY",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDBidkEAMcoWotacBTcoZvxkTDKJuPXr0fkj-nHGHw3z1HyfDNLSkcSFTMqs13chwhGQRXa0XQwSTIRK_PMLt_A1OYfyoOZfjYxxHsI0-v3xp5nmBVPk9JiJbVbBPufxJcUXgWtba_e6w6UXrKZfcoeHBG52OY1gXrGlQRDbMahmZ0eByxa4Ft9jDHP7aGe8vyFyXriEicsex09tFNh-Gm2QMHucy-StptlEPbbe7TerS3F4i-tSmbxQUsYIe6HiNdk2ep4gN3SeQ",
      badgeBg: "bg-orange-50",
      badgeText: "text-orange-600",
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
          <div className="flex items-center gap-4 flex-1 pb-4 min-w-0">
            {/* Visual Anchor: A themed icon box */}
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <BookOpen className="size-5.5" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">
                My Classes
              </h1>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-slate-600 text-xs font-medium">
                  {classes.length} active sessions
                </p>
              </div>
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
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md ${classItem.badgeBg} ${classItem.badgeText} text-[10px] font-bold uppercase tracking-wide mb-2`}
                    >
                      {classItem.code}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-tight mb-0.5 truncate">
                      {classItem.title}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {classItem.department}
                    </p>
                  </div>
                  <img
                    alt={classItem.instructor}
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 shrink-0 ml-2"
                    src={classItem.avatar}
                  />
                </div>

                {/* Instructor Info */}
                <div className="flex items-center gap-1.5 mb-3 pb-3 border-b border-slate-100">
                  <GraduationCap
                    className="text-slate-400 shrink-0"
                    size={14}
                  />
                  <span className="text-xs text-slate-600 truncate">
                    {classItem.instructor}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Users className="text-slate-400" size={14} />
                    <span className="text-xs text-slate-600 font-medium">
                      {classItem.members}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-1.5 cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(classItem.classCode);
                    }}
                  >
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      {classItem.classCode}
                    </span>
                    <Copy
                      className="text-slate-400 group-hover:text-pribg-primary transition-colors"
                      size={13}
                    />
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
