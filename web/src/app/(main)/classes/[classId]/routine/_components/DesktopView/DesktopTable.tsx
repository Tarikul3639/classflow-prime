"use client";

import type { RoutinePeriod, DaySchedule, RoutineSlot } from "@/types/routine.types";
import { SubjectCard } from "./SubjectCard";

const TODAY_INDEX = new Date().getDay();

interface DesktopTableProps {
    periods: RoutinePeriod[];
    schedule: DaySchedule[];
    loading: boolean;
    error: string | null;
    onEdit: (day: string, slot: RoutineSlot) => void;
    onRemove: (slot: RoutineSlot) => void;
}

function BreakCell({ label }: { label: string }) {
    return (
        <div className="h-full w-full rounded-sm border border-dashed border-red-500/20 bg-red-500/2 flex items-center justify-center px-2 py-2">
            <div className="text-center">
                <p className="text-[11px] font-bold text-primary uppercase">{label}</p>
                <p className="text-[9.5px] text-primary/60 mt-0.5 whitespace-nowrap">Break period</p>
            </div>
        </div>
    );
}

export function DesktopTable({
    periods,
    schedule,
    loading,
    error,
    onEdit,
    onRemove,
}: DesktopTableProps) {
    if (loading) {
        return (
            <div className="rounded-2xl border border-[#ECEAF8] bg-white p-12 flex flex-col items-center justify-center">
                <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
                <p className="text-[13px] text-gray-400">Loading routine...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-[#ECEAF8] bg-white p-12 text-center">
                <p className="text-[13px] text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-[#ECEAF8] bg-white">
            <table
                className="w-full border-collapse"
                style={{ tableLayout: "fixed", minWidth: 720 }}
            >
                <thead>
                    <tr>
                        <th
                            className="sticky top-0 text-left pl-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 border-b-2 border-[#ECEAF8] bg-white"
                            style={{ width: 70 }}
                        >
                            Day
                        </th>

                        {periods.map((p) => (
                            <th
                                key={p.periodId}
                                className="py-3 px-4.5 text-center border-b-2 border-[#ECEAF8] bg-white border-l border-l-[#ECEAF8]"
                            >
                                <p className="text-[11px] font-bold text-gray-600">
                                    {p.startTime}
                                </p>
                                <p className="text-[9.5px] text-gray-400 mt-0.5">
                                    {p.endTime}
                                </p>
                                <p className="text-[9.5px] text-gray-300 mt-1 font-semibold tracking-wide">
                                    {p.label}
                                </p>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {schedule.map((dayData, i) => {
                        const isToday = i === TODAY_INDEX;
                        const daySlots = dayData.slots ?? [];

                        return (
                            <tr
                                key={dayData.day}
                                className={`border-b border-[#ECEAF8] last:border-0 ${
                                    isToday ? "bg-primary/5" : ""
                                }`}
                            >
                                <td className="pr-2 py-2 align-middle">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <span
                                            className={`text-[11px] font-bold uppercase tracking-widest ${
                                                isToday ? "text-primary" : "text-gray-400"
                                            }`}
                                        >
                                            {dayData.day.slice(0, 3)}
                                        </span>
                                        {isToday && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                        )}
                                    </div>
                                </td>

                                {periods.map((p) => {
                                    const slot = daySlots.find(
                                        (s) => s.periodNo === p.periodNo,
                                    );

                                    // COLUMN MERGE (Vertical Span) Logic:
                                    if (p.isBreak) {
                                        if (i !== 0) return null;

                                        return (
                                            <td
                                                key={p.periodId}
                                                rowSpan={schedule.length}
                                                className="px-1.5 py-2 align-stretch border-l border-[#ECEAF8] bg-white h-1"
                                            >
                                                <BreakCell label={p.label} />
                                            </td>
                                        );
                                    }

                                    return (
                                        <td
                                            key={p.periodId}
                                            className="px-1.5 py-2 align-top border-l border-[#ECEAF8]"
                                        >
                                            <SubjectCard
                                                day={dayData.day}
                                                slot={slot}
                                                onEdit={onEdit}
                                                onRemove={onRemove}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}