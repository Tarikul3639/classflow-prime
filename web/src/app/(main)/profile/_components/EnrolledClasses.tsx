"use client";

import React from "react";
import ClassCard from "./ClassCard";
import Link from "next/link";

interface ClassProps {
  classId: string;
  className: string;
  themeColor?: string;
  coverImage?: string;
  role: string;
  status: string;
  enrolledAt: Date;
}

export default function EnrolledClasses({ classes }: { classes: ClassProps[] }) {
  // const cls: ClassProps[] = [
  //   {
  //     classId: "CLS101",
  //     className: "Mathematics 101",
  //     themeColor: "#4CAF50",
  //     coverImage: "https://example.com/images/math.jpg",
  //     role: "student",
  //     status: "active",
  //     enrolledAt: new Date("2025-01-10T09:30:00Z"),
  //   },
  //   {
  //     classId: "CLS102",
  //     className: "Physics Fundamentals",
  //     themeColor: "#2196F3",
  //     coverImage: "https://example.com/images/physics.jpg",
  //     role: "teacher",
  //     status: "active",
  //     enrolledAt: new Date("2025-02-05T11:00:00Z"),
  //   },
  //   {
  //     classId: "CLS103",
  //     className: "Chemistry Basics",
  //     themeColor: "#FF9800",
  //     coverImage: "https://example.com/images/chemistry.jpg",
  //     role: "student",
  //     status: "ended",
  //     enrolledAt: new Date("2025-03-01T14:15:00Z"),
  //   },
  //   {
  //     classId: "CLS104",
  //     className: "English Literature",
  //     themeColor: "#9C27B0",
  //     coverImage: "https://example.com/images/english.jpg",
  //     role: "admin",
  //     status: "active",
  //     enrolledAt: new Date("2025-01-20T08:00:00Z"),
  //   },
  //   {
  //     classId: "CLS105",
  //     className: "Computer Science",
  //     themeColor: "#607D8B",
  //     coverImage: "https://example.com/images/cs.jpg",
  //     role: "student",
  //     status: "ended",
  //     enrolledAt: new Date("2025-03-15T16:45:00Z"),
  //   },
  // ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">Enrolled Classes</h3>
        <Link
          href="/classes"
          className="text-primary text-xs font-bold hover:underline"
        >
          Manage All
        </Link>
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {classes.map((classItem) => (
          <ClassCard key={classItem.classId} {...classItem} />
        ))}
      </div>
    </div>
  );
}
