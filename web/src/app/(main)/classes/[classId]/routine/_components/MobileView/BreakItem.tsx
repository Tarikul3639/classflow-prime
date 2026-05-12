import React from "react";
import { RoutinePeriod } from "@/types/routine.types";

interface BreakItemProps {
  period: RoutinePeriod;
}

export const BreakItem: React.FC<BreakItemProps> = ({ period }) => {
  return (
    <div className="flex items-center justify-between bg-white border border-dashed border-gray-200 rounded-2xl px-4 py-3 mb-3">
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
        {period.label || "Break"}
      </span>
      <span className="text-[10px] text-gray-400">
        {period.startTime} – {period.endTime}
      </span>
    </div>
  );
};