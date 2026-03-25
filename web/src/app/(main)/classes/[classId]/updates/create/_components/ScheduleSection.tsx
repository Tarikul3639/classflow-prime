"use client";

import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/Input";
import type { CreateUpdateFormData } from "@/types/update.types";
import { getISODate, getISOTime, combineDateTimeLocal } from "@/utils/date.utils";

interface ScheduleSectionProps {
  form: CreateUpdateFormData;
  setForm: React.Dispatch<React.SetStateAction<CreateUpdateFormData>>;
}

export function ScheduleSection({ form, setForm }: ScheduleSectionProps) {
  const dateValue = getISODate(form.eventAt ?? "");
  const timeValue = getISOTime(form.eventAt ?? "");

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");

    const newDate = `${yyyy}-${mm}-${dd}`;
    const baseTime = timeValue || "10:00";

    const newISO = combineDateTimeLocal(newDate, baseTime);

    setForm((prev) => ({ ...prev, eventAt: newISO || "" }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;

    const baseDate =
      getISODate(form.eventAt ?? "") ||
      getISODate(new Date().toISOString())!;

    const newISO = combineDateTimeLocal(baseDate, newTime);

    setForm((prev) => ({ ...prev, eventAt: newISO || "" }));
  };

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
        <Calendar
          mode="single"
          selected={form.eventAt ? new Date(form.eventAt) : undefined}
          onSelect={handleDateChange}
          className="w-full md:w-90 bg-slate-50 border border-slate-200 rounded-xl p-4"
        />

        <div className="flex-1 space-y-4">
          <Input
            label="Start Time"
            type="time"
            value={timeValue ?? ""}
            onChange={handleTimeChange}
          />
        </div>
      </div>
    </div>
  );
}