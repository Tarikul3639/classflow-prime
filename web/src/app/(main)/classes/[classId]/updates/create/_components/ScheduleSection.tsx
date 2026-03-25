"use client";

import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/Input";
import type { CreateUpdateFormData } from "@/types/update.types";
import {
  getISODate,
  getISOTime,
  combineDateTime, // ✅ use UTC version
} from "@/utils/date.utils";

/**
 * Get local time "HH:mm" from ISO string (UTC)
 */
export function getLocalTimeFromISO(iso?: string): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso); // ISO → Date object (LOCAL timezone)
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Get local date "YYYY-MM-DD" from ISO string (UTC)
 */
export function getLocalDateFromISO(iso?: string): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

interface ScheduleSectionProps {
  form: CreateUpdateFormData;
  setForm: React.Dispatch<React.SetStateAction<CreateUpdateFormData>>;
}

export function ScheduleSection({ form, setForm }: ScheduleSectionProps) {
  // Extract LOCAL date & time from ISO (safe for input fields)
  const dateValue = getLocalDateFromISO(form.eventAt ?? "");
  const timeValue = getLocalTimeFromISO(form.eventAt ?? "");

  /**
   * Handle calendar date selection
   * - Always build YYYY-MM-DD (safe format)
   * - Combine with existing time
   * - Convert to UTC before saving
   */
  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");

    const newDate = `${yyyy}-${mm}-${dd}`;
    const baseTime = timeValue || "10:00";

    // Convert LOCAL → UTC ISO
    const newISO = combineDateTime(newDate, baseTime);

    setForm((prev) => ({
      ...prev,
      eventAt: newISO || "",
    }));
  };

  /**
   * Handle time input change
   * - Use existing date if available
   * - Fallback to today (LOCAL)
   * - Convert to UTC before saving
   */
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;

    const baseDate =
      getISODate(form.eventAt ?? "") || getISODate(new Date().toISOString())!;

    // Convert LOCAL → UTC ISO
    const newISO = combineDateTime(baseDate, newTime);

    setForm((prev) => ({
      ...prev,
      eventAt: newISO || "",
    }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
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
          selected={form.eventAt ? new Date(form.eventAt) : undefined}
          onSelect={handleDateChange}
          className="w-full md:w-90 bg-slate-50 border border-slate-200 rounded-xl p-4"
        />

        {/* Time Input */}
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
