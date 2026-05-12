import React from "react";
import { motion } from "framer-motion";
import type { DayOfWeek } from "@/types/routine.types";

interface DayTabsProps {
    activeDay: DayOfWeek;
    days: DayOfWeek[];
    onDayChange: (day: DayOfWeek) => void;
}

const DAY_INDEX: Record<DayOfWeek, number> = {
    Sunday: 0, Monday: 1, Tuesday: 2,
    Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
};

function getDateForDay(day: DayOfWeek): number {
    const today = new Date();
    const diff = DAY_INDEX[day] - today.getDay();
    const target = new Date(today);
    target.setDate(today.getDate() + diff);
    return target.getDate();
}

function isToday(day: DayOfWeek): boolean {
    return new Date().getDay() === DAY_INDEX[day];
}

export const DayTabs: React.FC<DayTabsProps> = ({ activeDay, days, onDayChange }) => {
    if (!days.length) return null;

    return (
        <div
            className="grid gap-1.5 px-3 py-2 bg-background border-b border-border"
            style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
        >
            {days.map((day) => {
                const isActive = activeDay === day;
                const today = isToday(day);
                const dateNum = getDateForDay(day);

                return (
                    <motion.button
                        key={day}
                        onClick={() => onDayChange(day)}
                        whileTap={{ scale: 0.94 }}
                        className="relative flex flex-col items-center gap-0.5 py-2 px-1 cursor-pointer rounded-xl outline-none"
                    >
                        {/* Active background */}
                        {isActive && (
                            <motion.div
                                layoutId="active-day"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/30"
                            />
                        )}

                        {/* Day label */}
                        <span
                            className={`relative z-10 text-[10px] font-semibold uppercase tracking-widest transition-colors ${
                                isActive ? "text-primary" : "text-muted-foreground"
                            }`}
                        >
                            {day.slice(0, 3)}
                        </span>

                        {/* Date number */}
                        <span
                            className={`relative z-10 text-base font-bold leading-none transition-colors ${
                                isActive
                                    ? "text-primary"
                                    : today
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            }`}
                        >
                            {dateNum}
                        </span>

                        {/* Today dot */}
                        <span
                            className={`relative z-10 w-1 h-1 rounded-full transition-colors ${
                                today ? "bg-primary" : "bg-transparent"
                            }`}
                        />
                    </motion.button>
                );
            })}
        </div>
    );
};