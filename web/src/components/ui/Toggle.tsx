"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface ToggleProps {
  icon: LucideIcon;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

export const Toggle = ({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}: ToggleProps) => {
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
        onClick={onToggle}
        className={`relative inline-flex h-5 w-9 items-center rounded-full cursor-pointer transition-colors duration-200 ${
          enabled ? "bg-primary" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ${
            enabled ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
};
