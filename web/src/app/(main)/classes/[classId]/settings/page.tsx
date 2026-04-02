"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import ClassInfoCard from "./_components/ClassInfoCard";
import NotificationSettings from "./_components/NotificationSettings";
import DangerZone from "./_components/DangerZone";
import { toast } from "sonner";

import {
  leaveClass,
  deleteClass,
  markClassAsEnded,
} from "@/store/features/classes/thunks/settings/class-setting.thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function ClassSettingsPage() {
  const router = useRouter();
  const { classId } = useParams();
  const dispatch = useAppDispatch();

  const isInstructor = useAppSelector(
    (state) => state.classes.fetchSingleClass.classDetails.isInstructor,
  );

  const classData = {
    className: "Introduction to Computer Science",
    classCode: "CS-101",
    instructor: "Dr. Alan Grant",
    schedule: "MWF 9:00 AM - 10:30 AM",
    totalStudents: 45,
    semester: "Fall 2024",
  };

  const handleLeaveClass = async () => {
    const promise = dispatch(
      leaveClass({ classId: classId as string }),
    ).unwrap();

    toast.promise(promise, {
      loading: "Leaving class...",
      success: "You have left the class.",
      error: "Failed to leave the class. Please try again.",
    });

    try {
      await promise;
      router.push("/classes");
    } catch (error) {
      console.error("Error leaving class:", error);
      return;
    }
  };

  const handleDeleteClass = async () => {
    const promise = dispatch(
      deleteClass({ classId: classId as string }),
    ).unwrap();

    toast.promise(promise, {
      loading: "Deleting class...",
      success: "Class has been deleted.",
      error: "Failed to delete the class. Please try again.",
    });

    try {
      await promise;
      router.push("/classes");
    } catch (error) {
      console.error("Error deleting class:", error);
      return;
    }
  };

  const handleMarkAsEnded = async () => {
    const promise = dispatch(
      markClassAsEnded({ classId: classId as string }),
    ).unwrap();

    toast.promise(promise, {
      loading: "Marking class as ended...",
      success: "Class has been marked as ended.",
      error: "Failed to mark the class as ended. Please try again.",
    });

    try {
      await promise;
      router.back();
    } catch (error) {
      console.error("Error marking class as ended:", error);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-3 lg:px-6 py-6">
      <div className="mx-auto grid gap-6">
        <ClassInfoCard {...classData} />
        <NotificationSettings />

        <DangerZone
          className={classData.className}
          isInstructor={isInstructor}
          onLeaveClass={handleLeaveClass}
          onDeleteClass={handleDeleteClass}
          onMarkAsEnded={handleMarkAsEnded}
        />
      </div>
    </div>
  );
}
