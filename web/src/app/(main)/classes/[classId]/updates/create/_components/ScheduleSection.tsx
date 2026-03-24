"use client";

import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/Input";
import type { CreateUpdateFormData } from "@/types/update.types";

interface ScheduleSectionProps {
  form: CreateUpdateFormData;
  setForm: React.Dispatch<React.SetStateAction<CreateUpdateFormData>>;
}

export function ScheduleSection({ form, setForm }: ScheduleSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-primary">
          <CalendarIcon size={16} />
        </div>
        <h3 className="text-[10px] md:text-[11px] font-bold text-[#617789] uppercase tracking-wider">
          Schedule
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar */}
        <Calendar
          mode="single"
          selected={form.date ? new Date(form.date + "T00:00:00") : undefined}
          onSelect={(date) => {
            if (!date) return;
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            setForm({ ...form, date: `${yyyy}-${mm}-${dd}` });
          }}
          className="w-full md:w-90 bg-slate-50 border border-slate-200 rounded-xl p-4"
          classNames={{
            caption_label: "text-[14px] md:text-[15px] font-bold",
            day: "w-full aspect-square flex items-center justify-center rounded-lg transition-colors",
            day_button: "text-[12px] md:text-[13px]",
            today: "bg-gray-500 text-white font-semibold rounded",
          }}
        />

        {/* Time Input */}
        <div className="flex-1 space-y-4">
          <Input
            label="Start Time"
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
