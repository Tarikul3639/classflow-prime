"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface ClassCardProps {
  name: string;
  instructor: string;
  schedule: string;
  status: "Active" | "Ended";
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

export default function ClassCard({
  name,
  instructor,
  schedule,
  status,
  icon: Icon,
  iconBg,
  iconColor,
}: ClassCardProps) {
  const isEnded = status === "Ended";

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 ${
        isEnded ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor}`}
        >
          <Icon size={20} />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm">{name}</p>
          <p className="text-xs text-slate-500">
            {instructor} • {schedule}
          </p>
        </div>
      </div>
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          isEnded
            ? "bg-slate-200 text-slate-600"
            : "bg-green-100 text-green-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
}