"use client";

import React from "react";
import { Plus } from "lucide-react";
import Link from "next/link";

interface CreateUpdateCardProps {
  classId: string;
}

export default function CreateUpdateCard({ classId }: CreateUpdateCardProps) {
  return (
    <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-transparent p-6 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
        <Plus className="text-primary" size={24} />
      </div>
      <div>
        <h4 className="font-bold text-slate-900 text-base">
          Post New Update
        </h4>
        <p className="text-sm text-slate-600 mt-1">
          Share announcements, assignments, or important information
        </p>
      </div>
      <Link
        href={`/classes/${classId}/updates/1`}
        className="mt-2 px-4 py-2.5 rounded-lg border border-primary/30 bg-white/50 text-primary font-bold text-[11px] md:text-[12px] lg:text-[13px] hover:bg-blue-50 transition-colors flex items-center gap-2"
      >
        <span>Create Update</span>
      </Link>
    </div>
  );
}