import React, { useRef, useEffect } from "react";
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

    const scrollRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<HTMLButtonElement>(null);

    // active day scroll into view
    useEffect(() => {
        if (activeRef.current && scrollRef.current) {
            const container = scrollRef.current;
            const el = activeRef.current;
            const offset = el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2;
            container.scrollTo({ left: offset, behavior: "smooth" });
        }
    }, [activeDay]);

    return (
        <div className="bg-background border-b border-border">
            <div
                ref={scrollRef}
                className="flex gap-1.5 px-3 py-2.5 overflow-x-auto scrollbar-none"
                style={{ scrollbarWidth: "none" }}
            >
                {days.map((day) => {
                    const isActive = activeDay === day;
                    const today = isToday(day);
                    const dateNum = getDateForDay(day);

                    return (
                        <motion.button
                            key={day}
                            ref={isActive ? activeRef : undefined}
                            onClick={() => onDayChange(day)}
                            whileTap={{ scale: 0.92 }}
                            className="relative flex flex-col items-center shrink-0 w-11 py-2 gap-0.5 rounded-2xl outline-none cursor-pointer transition-colors"
                        >
                            {/* Active pill bg */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-day-bg"
                                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                                    className="absolute inset-0 bg-primary rounded-xl"
                                />
                            )}

                            {/* Day label */}
                            <span
                                className={`relative z-10 text-[9.5px] font-bold uppercase tracking-widest transition-colors ${
                                    isActive
                                        ? "text-primary-foreground"
                                        : today
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                }`}
                            >
                                {day.slice(0, 3)}
                            </span>

                            {/* Date number */}
                            <span
                                className={`relative z-10 text-[17px] font-bold leading-none tabular-nums transition-colors ${
                                    isActive
                                        ? "text-primary-foreground"
                                        : today
                                        ? "text-foreground"
                                        : "text-muted-foreground/70"
                                }`}
                            >
                                {dateNum}
                            </span>

                            {/* Today dot */}
                            <span
                                className={`relative z-10 w-1 h-1 rounded-full transition-colors ${
                                    today && !isActive
                                        ? "bg-primary"
                                        : today && isActive
                                        ? "bg-primary-foreground/60"
                                        : "bg-transparent"
                                }`}
                            />
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};