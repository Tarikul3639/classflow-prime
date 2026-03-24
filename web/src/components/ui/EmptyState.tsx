"use client";

import React from "react";
import { LucideIcon, BellOff } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const EmptyState = ({
  icon: Icon = BellOff,
  title = "No Data Available",
  description = "There is currently no data to display. Please check back later or adjust your filters.",
  className = "",
}: EmptyStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[60vh] md:min-h-[60vh] text-center ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-5">
        <Icon className="text-slate-400" size={24} />
      </div>

      <p className="text-[15px] font-semibold text-slate-900 mb-1.5">{title}</p>

      <p className="text-[13px] text-slate-400 max-w-55 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
