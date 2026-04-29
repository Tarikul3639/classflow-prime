"use client";

import Link from "next/link";
import { UserPlus, LayersPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { ComingSoonDialog } from "@/components/ui/ComingSoonDialog";

const SECOND_COLORS = [
  "text-indigo-500",
  "text-violet-500",
  "text-purple-500",
  "text-pink-500",
  "text-rose-500",
  "text-orange-500",
  "text-amber-500",
  "text-yellow-500",
  "text-lime-500",
  "text-emerald-500",
  "text-teal-500",
  "text-cyan-500",
  "text-sky-500",
  "text-blue-500",
] as const;

function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  const pad = (n: number) => String(n).padStart(2, "0");
  let h = time.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const sec = time.getSeconds();
  const secColor = SECOND_COLORS[sec % SECOND_COLORS.length];
  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex items-baseline gap-1 select-none">
      {/* Hours */}
      <span className="text-[17px] font-bold tracking-tight text-slate-900 tabular-nums">
        {pad(h)}
      </span>

      {/* Blinking colon — animate-pulse is built-in Tailwind */}
      <span className="text-[17px] font-bold text-primary animate-pulse">
        :
      </span>

      {/* Minutes */}
      <span className="text-[17px] font-bold tracking-tight text-slate-900 tabular-nums">
        {pad(time.getMinutes())}
      </span>

      {/* Seconds — color shifts every second */}
      <span className={"text-[13px] font-semibold tabular-nums ml-0.5 transition-colors duration-700 " + secColor}>
        {pad(sec)}
      </span>

      {/* AM/PM */}
      <span className="text-[11px] font-semibold text-slate-400 ml-0.5">
        {ampm}
      </span>

      {/* Divider */}
      <span className="hidden sm:block w-px h-4 bg-slate-200 mx-2 self-center" />

      {/* Date */}
      <span className="hidden sm:block text-[11px] font-medium text-slate-400 tracking-wide">
        {dateStr}
      </span>
    </div>
  );
}

export default function DashboardHeader() {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3.5 flex items-center gap-4">

        {/* Live clock */}
        <LiveClock />
        <div className="flex-1" />

        {/* Enroll & Create button */}
        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/classes/enroll"
            className="flex items-center gap-2 bg-white border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <UserPlus size={16} />
            <span>Enroll</span>
          </Link>
          <Link
            href="/classes/create"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 border border-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
          >
            <LayersPlus size={16} />
            <span>Create</span>
          </Link>
        </div>

        {/* Mobile Buttons */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/classes/enroll"
            className="flex items-center justify-center w-10 h-10 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors shadow-sm"
          >
            <UserPlus size={16} />
          </Link>
          <Link
            href="/classes/create"
            className="flex items-center justify-center w-10 h-10 bg-primary border border-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            <LayersPlus size={16} />
          </Link>
        </div>
      </header>

      {/* Coming soon dialog for search */}
      <ComingSoonDialog feature="Dashboard search" onClose={() => setShowDialog(false)} open={showDialog} />
    </>
  );
}