"use client";

import React from "react";
import { BookOpen, Users, Clock } from "lucide-react";

interface ClassInfoCardProps {
  className: string;
  classCode: string;
  instructor: string;
  schedule: string;
  totalStudents: number;
  semester: string;
}

export default function ClassInfoCard({
  className,
  classCode,
  instructor,
  schedule,
  totalStudents,
  semester,
}: ClassInfoCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
      <div className="flex items-start gap-4">
        <div className="w-10 md:w-12 h-10 md:h-12 rounded-xl bg-blue-100 flex items-center justify-center text-primary shrink-0">
          <BookOpen className="size-5 md:size-5.5" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-lg font-bold text-slate-900">{className}</h2>
          <p className="text-[13px] md:text-sm text-slate-500 mb-3">
            Code: <span className="font-semibold text-slate-700">{classCode}</span>
          </p>
          <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="size-3.5 md:size-4 text-slate-400" />
              <span>{totalStudents} students enrolled</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="size-3.5 md:size-4 text-slate-400" />
              <span>{schedule}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 text-[13px] md:text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Creator:</span>
          <span className="font-semibold text-slate-900">{instructor}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-slate-500">Semester:</span>
          <span className="font-semibold text-slate-900">{semester}</span>
        </div>
      </div>
    </div>
  );
}