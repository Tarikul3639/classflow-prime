"use client";

import React from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/Input";
import type { CreateUpdateFormData } from "@/types/update.types";
import { localToISO, isoToLocalDate, isoToLocalTime } from "@/utils/date.utils";

interface ScheduleSectionProps {
  form: CreateUpdateFormData;
  setForm: React.Dispatch<React.SetStateAction<CreateUpdateFormData>>;
}

export function ScheduleSection({ form, setForm }: ScheduleSectionProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateValue = form.eventAt ? isoToLocalDate(form.eventAt) : "";
  const timeValue = form.eventAt ? isoToLocalTime(form.eventAt) : "10:00";

  const update = (localDate: string, localTime: string) => {
    setForm((prev) => ({ ...prev, eventAt: localToISO(localDate, localTime) }));
  };

  const handleDateChange = (selected: Date | undefined) => {
    if (!selected) return;
    const newDate = `${selected.getFullYear()}-${String(selected.getMonth() + 1).padStart(2, "0")}-${String(selected.getDate()).padStart(2, "0")}`;
    update(newDate, timeValue);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const baseDate = dateValue || isoToLocalDate(new Date().toISOString());
    update(baseDate, e.target.value);
  };

  const handleClear = () => {
    setForm((prev) => ({ ...prev, eventAt: null }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-primary">
            <CalendarIcon size={16} />
          </div>
          <h3 className="text-[10px] md:text-[11px] font-bold text-[#617789] uppercase tracking-wider">
            Schedule
          </h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Calendar
          mode="single"
          selected={dateValue ? new Date(`${dateValue}T00:00:00`) : undefined}
          onSelect={handleDateChange}
          disabled={(date) => date < today} // Disable past dates
          modifiers={{
            eventDate: (date) => {
              if (!form.eventAt) return false;

              return new Date(date).toDateString() ===
                new Date(form.eventAt).toDateString();
            },
            past: (date) => date < today,
            todayOnly: (date) => {
              return date.toDateString() === new Date().toDateString();
            }
          }}
          modifiersClassNames={{
            eventDate:
              "[&>button]:!bg-red-500 [&>button]:!text-white [&>button]:!border-0 [&>button]:!outline-none [&>button]:!ring-0 [&>button]:focus-visible:!outline-none [&>button]:active:!ring-0 [&>button]:!shadow-none",

            past: "[&>button]:opacity-40 [&>button]:cursor-not-allowed [&>button]:line-through",
            todayOnly:
              "[&>button]:bg-primary [&>button]:text-white [&>button]:rounded-md [&>button]:border-none [&>button]:hover:bg-primary/90 [&>button]:hover:text-white",
          }}
          classNames={{
            day: "w-full [&>button:hover]:!bg-red-400 [&>button:hover]:!text-white",
          }}
          className="w-full md:w-90 bg-slate-50 border border-slate-200 rounded-xl p-4"
        />

        <div className="flex-1 space-y-4">
          <Input
            label="Start Time"
            type="time"
            value={timeValue}
            onChange={handleTimeChange}
          />

          {form.eventAt && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Stored as UTC:{" "}
                <span className="font-mono text-slate-600">{form.eventAt}</span>
              </p>
              {form.eventAt && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 transition-colors duration-150 cursor-pointer"
                >
                  <X size={12} />
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
