"use client";

import React from "react";

interface DateHeaderProps {
  label: string;
}

export default function DateHeader({ label }: DateHeaderProps) {
  return (
    <div className="flex items-center gap-4 py-4 pt-2">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </h3>
      <div className="h-px flex-1 bg-slate-200"></div>
    </div>
  );
}