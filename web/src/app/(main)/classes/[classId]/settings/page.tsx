"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ClassInfoCard from "./_components/ClassInfoCard";
import NotificationSettings from "./_components/NotificationSettings";
import DangerZone from "./_components/DangerZone";

export default function ClassSettingsPage({
  params,
}: {
  params: { classId: string };
}) {
  const router = useRouter();

  const classData = {
    className: "Introduction to Computer Science",
    classCode: "CS-101",
    instructor: "Dr. Alan Grant",
    schedule: "MWF 9:00 AM - 10:30 AM",
    totalStudents: 45,
    semester: "Fall 2024",
  };

  const handleLeaveClass = () => {
    console.log("Leaving class...");
    router.push("/classes");
  };

  const handleDeleteClass = () => {
    console.log("Deleting class...");
    router.push("/classes");
  };

  const handleMarkAsEnded = () => {
    console.log("Marking class as ended...");
    router.back();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 lg:px-6 py-6">
      <div className="mx-auto grid gap-6">
        <ClassInfoCard {...classData} />
        <NotificationSettings />

        <DangerZone
          classId={params.classId}
          className={classData.className}
          onLeaveClass={handleLeaveClass}
          onDeleteClass={handleDeleteClass}
          onMarkAsEnded={handleMarkAsEnded}
        />
      </div>
    </div>
  );
}
