"use client";

import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { GroupCard } from "./_components/GroupCard";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  fetchClassGroups,
  deleteClassGroup,
} from "@/store/features/classes/thunks/groups/class-group.thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function GroupsPage() {
  const { classId } = useParams();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { classDetails } = useAppSelector(
    (state) => state.classes.fetchSingleClass,
  );

  const isAdmin = classDetails?.isInstructor || classDetails?.isAssistant;

  const isLoading = useAppSelector(
    (state) => state.classes.classGroups.loading.fetchGroups,
  );
  const error = useAppSelector(
    (state) => state.classes.classGroups.error.fetchGroups,
  );
  const groups = useAppSelector((state) => state.classes.classGroups.groups);

  useEffect(() => {
    if (classId) {
      dispatch(fetchClassGroups({ classId: classId as string }));
    }
  }, [classId, dispatch]);

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-center text-sm text-slate-600">Loading groups...</p>
      </div>
    );
  }

  const handleDelete = async (groupId: string) => {
    const promise = dispatch(
      deleteClassGroup({ classId: classId as string, groupId }),
    ).unwrap();

    toast.promise(promise, {
      loading: "Deleting group...",
      success: "Group deleted successfully",
      error: "Failed to delete group",
    });

    try {
      await promise;
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (groupId: string) => {
    router.push(`/classes/${classId}/groups/${groupId}`);
  };

  const handleTogglePin = (groupId: string) => {
    // Implement pin/unpin functionality here
    console.log("Toggle pin for group with ID:", groupId);
  };

  return (
    <main className="p-4 space-y-4 pb-8 mx-auto">
      {/* Add New Group - Dashed Border */}
      {isAdmin && (
        <div className="border-2 border-dashed border-slate-300 rounded-2xl bg-transparent p-6 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <Plus className="text-primary" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-base">
              Add New Group
            </h4>
            <p className="text-sm text-slate-600 mt-1">
              Help your classmates by sharing relevant group links
            </p>
          </div>
          <Link
            href={`/classes/${classId}/groups/create`}
            className="mt-2 px-4 py-2.5 rounded-lg border border-primary/30 bg-white/50 text-primary font-bold text-[11px] md:text-[12px] lg:text-[13px] hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Crete Group</span>
          </Link>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mx-4 mt-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Section Title */}
      <div className="mt-6 mb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 px-1">
          Active Communication Channels
        </h3>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => {
          return (
            <GroupCard
              key={group.groupId}
              group={group}
              onDelete={() => handleDelete(group.groupId)}
              onEdit={() => handleEdit(group.groupId)}
              onTogglePin={() => handleTogglePin(group.groupId)}
              showActions={isAdmin}
            />
          );
        })}
      </div>
    </main>
  );
}
