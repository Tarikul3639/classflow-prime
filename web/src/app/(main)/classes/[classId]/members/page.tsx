"use client";

import React, { useState } from "react";
import MemberSearch from "./_components/MemberSearch";
import { Filters as RoleFilters } from "@/components/ui/Filters";
import MemberCard from "./_components/MemberCard";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  role: "admin" | "professor" | "student";
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
    { id: "students", label: "Students" },
  ];

  const members: Member[] = [
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
    {
      id: "3",
      name: "Marcus Chen",
      email: "marcus.c@student.edu",
      role: "student",
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

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "admins" && member.role === "admin") ||
      (activeFilter === "students" && member.role === "student");

    return matchesSearch && matchesFilter;
  });

  const groupedMembers = {
    Administrator: filteredMembers.filter(
      (m) => m.role === "admin" || m.role === "professor",
    ),
    Students: filteredMembers.filter((m) => m.role === "student"),
  };

  return (
    <>
      {/* Filters & Search */}
      <div className="p-4 flex flex-col gap-3 bg-slate-100/50 mx-auto w-full">
        <MemberSearch value={searchQuery} onChange={setSearchQuery} />
        <RoleFilters
          filters={filters}
          active={activeFilter}
          onChange={setActiveFilter}
        />
      </div>

      {/* Members Content */}
      <div className="px-4 py-2 space-y-4 pb-8 mx-auto w-full">
        {Object.entries(groupedMembers).map(
          ([groupName, members]) =>
            members.length > 0 && (
              <div key={groupName}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  {groupName} ({members.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {members.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      onMenuClick={(id) =>
                        console.log("Menu clicked for member ID:", id)
                      }
                    />
                  ))}
                </div>
              </div>
            ),
        )}
      </div>
    </>
  );
}
