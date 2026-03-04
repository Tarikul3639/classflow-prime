"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { FacultyCard } from "./_components/FacultyCard";

interface Faculty {
  _id: string;
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  avatar?: string;
  initials?: string;
  classroomCode?: string;
}

export default function FacultyPage({
  params,
}: {
  params: { classId: string };
}) {
  const faculties: Faculty[] = [
    {
      _id: "1",
      name: "Dr. Alan Grant",
      title: "Senior Professor & Head of Dept.",
      location: "Room 402, Science Block",
      email: "alan.grant@university.edu",
      phone: "+1 (234) 567-890",
      classroomCode: "SCI-402",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAPkjGtPP3qY00d_gM_0LJNAyoZmgt4yS6yiRHjRxLzug8qetgQqjYvZVjXnFaCibYsqYU_snKExi80DFGtwhegzXrnAImernt3lvfaZFzwehstPoa5Hfp7XrVmjxQsOx6NW6VilDd2u3gHuJr6dHvQVVWwg0HqP3gPlIL9-DGZ4ycTbAWUW-d8QLjdtR0X544VpV_oW-hp1XRJ2QgQ8Q_elOH4TCzzNm_-W6al-RrQ65_wrP97hHjj-kfsoibFsWXslBFnI_AO2JKk",
    },
    {
      _id: "2",
      name: "Sarah Jenkins",
      title: "Associate Professor",
      location: "Room 315, Annex B",
      email: "sarah.j@university.edu",
      phone: "+1 (234) 567-891",
      classroomCode: "ANN-315",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC2soKSSI5SdO4i8te6PnDp8UV8SaYhaQw70VSP8EZuy7ZqTn3WjnesX3cscOuUo38oXWVbJ-Xn9dkPb3sb--UUcYqBKgkJt_QTvNZK6_fKZbA9Fw1kJWna5oJksuxzhTx8VkGIpjEOC2BBorPlw_WjVzNixEi5R7fjvTmf1raU9pEliN93iEGnWBZOtyEnkheDuvQ7UChxUGDmZ6nEPPdjIZKYYhQcnuigJgX54DL3rzFz_Hqu4ok7x1-Okz7MUQm_YQ8r8pbDclUE",
    },
    {
      _id: "3",
      name: "Robert Miller",
      title: "Assistant Professor",
      location: "Room 108, Main Hall",
      email: "r.miller@university.edu",
      phone: "+1 (234) 567-895",
      classroomCode: "MAIN-108",
      initials: "RM",
    },
  ];

  return (
    <main className="bg-slate-50 p-4 space-y-4 pb-8 mx-auto">
      {/* Add New Faculty - Dashed Border */}
      <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-transparent p-6 flex flex-col items-center text-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
          <Plus className="text-primary" size={24} />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-base">
            Add Faculty Information
          </h4>
          <p className="text-sm text-slate-600 mt-1">
            Help complete the faculty directory for this class
          </p>
        </div>
        <Link
          href={`/classes/${params.classId}/faculty/1`}
          className="mt-2 px-4 py-2.5 rounded-lg border border-primary/30 bg-white/50 text-primary font-bold text-[11px] md:text-[12px] lg:text-[13px] hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Suggest Faculty</span>
        </Link>
      </div>

      {/* Section Title */}
      <div className="mt-6 mb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">
          Class Instructors
        </h3>
      </div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {faculties.map((faculty) => (
          <FacultyCard faculty={faculty} />
        ))}
      </div>
    </main>
  );
}
