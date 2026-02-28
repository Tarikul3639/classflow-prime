"use client";

import React, { useState } from "react";
import { Search, MoreHorizontal, ShieldCheck, Plus } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  role: "admin" | "professor" | "cr" | "student";
  verified?: boolean;
  avatarBg?: string;
  avatarText?: string;
}

export default function MembersPage({
  params,
}: {
  params: { classId: string };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All Roles" },
    { id: "admins", label: "Admins" },
    { id: "reps", label: "Class Reps" },
    { id: "students", label: "Students" },
  ];

  const administrators: Member[] = [
    {
      id: "1",
      name: "Sarah Jenkins",
      email: "sarah.j@university.edu",
      role: "admin",
      verified: true,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC2soKSSI5SdO4i8te6PnDp8UV8SaYhaQw70VSP8EZuy7ZqTn3WjnesX3cscOuUo38oXWVbJ-Xn9dkPb3sb--UUcYqBKgkJt_QTvNZK6_fKZbA9Fw1kJWna5oJksuxzhTx8VkGIpjEOC2BBorPlw_WjVzNixEi5R7fjvTmf1raU9pEliN93iEGnWBZOtyEnkheDuvQ7UChxUGDmZ6nEPPdjIZKYYhQcnuigJgX54DL3rzFz_Hqu4ok7x1-Okz7MUQm_YQ8r8pbDclUE",
    },
    {
      id: "2",
      name: "Dr. Alan Grant",
      email: "alan.grant@university.edu",
      role: "professor",
      verified: true,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAPkjGtPP3qY00d_gM_0LJNAyoZmgt4yS6yiRHjRxLzug8qetgQqjYvZVjXnFaCibYsqYU_snKExi80DFGtwhegzXrnAImernt3lvfaZFzwehstPoa5Hfp7XrVmjxQsOx6NW6VilDd2u3gHuJr6dHvQVVWwg0HqP3gPlIL9-DGZ4ycTbAWUW-d8QLjdtR0X544VpV_oW-hp1XRJ2QgQ8Q_elOH4TCzzNm_-W6al-RrQ65_wrP97hHjj-kfsoibFsWXslBFnI_AO2JKk",
    },
  ];

  const students: Member[] = [
    {
      id: "3",
      name: "Marcus Chen",
      email: "marcus.c@student.edu",
      role: "cr",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBUZznvGwj0voW-l_fT2YbonJtVfUSWFv-rhvDjNRiEeR483IYrszhb2It_nU3G5cOFGxTzYAtzMiXWit80wKYCdYA_wl-Uncz8R8Ht5Q3VMXw1zWb53w1Dyn0vwWfKSW6HMIsEZLvVaPFpHsZHgd7jmk40PiZk8bo7kXqxmLjrVKUKrwJayL6Tk-Yln31mciTJNgRmGrFEB21AVLaa4KKnJCp4AgQnAA_vEIOKA5KX42tBIfnSG4oOnGuJzSL1G796lQvpMbtZ6T-l",
    },
    {
      id: "4",
      name: "Emily Johnson",
      email: "emily.j@student.edu",
      role: "student",
      initials: "EJ",
      avatarBg: "bg-orange-100",
      avatarText: "text-orange-600",
    },
    {
      id: "5",
      name: "Alice Freeman",
      email: "alice.free@student.edu",
      role: "student",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBE-oK1wSWvUc-UGoREMOM_qxA4WnmMoT5xzJottnxpFU5AbWIsKk7GTsZaprDIt08zyI28ezA0acfFeVI_p9Zd6XEKzJ_E8jnYga8LpXcjvjOkkZr9hYmVu87Tizk0Fi3Of7hjIlQI1FFJ6Jbr7-WVLuXWRxjVl2kPv4bqwSCHU5KUVS2RW51g4d7JG3eNoNr_a-6XEaM7s3HJk5MFymWuFsqjo1HmzgieAAGSOwONHyOJx2LRBO5ETLBtzwj00wYnODL5SA4E_kBI",
    },
    {
      id: "6",
      name: "David Kim",
      email: "david.kim@student.edu",
      role: "student",
      initials: "DK",
      avatarBg: "bg-pink-100",
      avatarText: "text-pink-600",
    },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-primary uppercase">
            Admin
          </span>
        );
      case "professor":
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-primary uppercase">
            Professor
          </span>
        );
      case "cr":
        return (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-600 uppercase">
            CR
          </span>
        );
      default:
        return null;
    }
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
            placeholder="Search members by name or email"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Role Chips */}
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

      {/* Members Content */}
      <div className="px-4 py-2 space-y-4 pb-8 mx-auto w-full">
        {/* Administrators Section */}
        <div>
          <div className="flex justify-between items-center py-2 mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Administrators ({administrators.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {administrators.map((member) => (
              <div
                key={member.id}
                className="group flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-primary/30 transition-all shadow-sm"
              >
                <div className="relative">
                  <img
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                    src={member.avatar}
                  />
                  {member.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <ShieldCheck
                        className="text-primary bg-blue-100 rounded-full p-0.5"
                        size={14}
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate">{member.name}</p>
                    {getRoleBadge(member.role)}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {member.email}
                  </p>
                </div>
                <button className="text-slate-500 hover:text-primary p-2 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Students Section */}
        <div>
          <div className="flex justify-between items-center py-2 mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Students ({students.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {students.map((member) => (
              <div
                key={member.id}
                className="group flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-primary/30 transition-all shadow-sm"
              >
                {member.avatar ? (
                  <img
                    alt={member.name}
                    className="w-10 h-10 rounded-full object-cover"
                    src={member.avatar}
                  />
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full ${member.avatarBg} flex items-center justify-center ${member.avatarText} font-bold text-sm`}
                  >
                    {member.initials}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold truncate">{member.name}</p>
                    {getRoleBadge(member.role)}
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {member.email}
                  </p>
                </div>
                <button className="text-slate-500 hover:text-primary p-2 transition-colors">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
