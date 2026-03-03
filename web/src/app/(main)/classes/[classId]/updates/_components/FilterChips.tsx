"use client";

import React from "react";

interface Filter {
  id: string;
  label: string;
}

interface FilterChipsProps {
  filters: Filter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export default function FilterChips({
  filters,
  activeFilter,
  onFilterChange,
}: FilterChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
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
  );
}