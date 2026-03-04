"use client";

import React from "react";
import { Code, Code as Function, BookOpen } from "lucide-react";
import ClassCard from "./ClassCard";

interface JoinedClassesProps {
  onManageAll: () => void;
}

export default function JoinedClasses({ onManageAll }: JoinedClassesProps) {
  const classes = [
    {
      id: "1",
      name: "Intro to CS 101",
      instructor: "Prof. Miller",
      schedule: "MWF 9:00 AM",
      status: "Active" as const,
      icon: Code,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: "2",
      name: "Calculus II",
      instructor: "Dr. Chen",
      schedule: "TTh 11:00 AM",
      status: "Active" as const,
      icon: Function,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      id: "3",
      name: "World History",
      instructor: "Prof. Dave",
      schedule: "Semester End",
      status: "Ended" as const,
      icon: BookOpen,
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">Joined Classes</h3>
        <button
          onClick={onManageAll}
          className="text-primary text-xs font-bold hover:underline"
        >
          Manage All
        </button>
      </div>
      <div className="space-y-3">
        {classes.map((classItem) => (
          <ClassCard key={classItem.id} {...classItem} />
        ))}
      </div>
    </div>
  );
}