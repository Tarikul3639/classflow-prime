"use client";

import React from "react";
import { LucideIcon, ChevronRight } from "lucide-react";

interface PreferenceItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  onClick: () => void;
}

export default function PreferenceItem({
  icon: Icon,
  title,
  description,
  value,
  onClick,
}: PreferenceItemProps) {
  return (
    <div className="py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-slate-100 rounded-lg">
          <Icon className="text-slate-600" size={18} />
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 text-primary font-semibold text-xs"
      >
        {value}
        <ChevronRight size={14} />
      </button>
    </div>
  );
}