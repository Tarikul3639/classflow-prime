"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { EditorHeader } from "../create/_components/EditorHeader";
import GroupBasicInfo from "../create/_components/GroupBasicInfo";
import GroupLinkInput from "../create/_components/GroupLinkInput";
import GroupPreview from "../create/_components/GroupPreview";
import { toast } from "sonner";
import {
  ClassGroup,
  GroupPlatform,
  GROUP_PLATFORM_CONFIG,
} from "@/types/group.types";
import { getDirtyFields } from "@/utils/form.utils";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateClassGroup,
  fetchSingleClassGroup,
} from "@/store/features/classes/thunks/groups/class-group.thunk";

import { selectSingleGroup } from "@/store/features/classes/selectors/class-group.selectors";

export default function UpdateGroupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useParams();

  const classId = params.classId as string;
  const groupId = params.groupId as string;

  const [isDirty, setIsDirty] = useState(false);

  const singleGroup = useAppSelector((state) =>
    selectSingleGroup(state, classId, groupId),
  );

  const { loading: isFetching, error: fetchError } = useAppSelector(
    (state) =>
      state.classes.classGroups.groupsByClass[classId]?.fetchSingle || {},
  );

  const { loading: isUpdating, error: updateError } = useAppSelector(
    (state) => state.classes.classGroups.groupsByClass[classId]?.update || {},
  );

  // Original snapshot —> for dirty tracking
  const originalFormRef = useRef<Omit<
    ClassGroup,
    "groupId" | "createdAt" | "updatedAt" | "createdBy"
  > | null>(null);

  const [formData, setFormData] = useState<
    Omit<ClassGroup, "groupId" | "createdAt" | "updatedAt" | "createdBy">
  >({
    name: "",
    description: "",
    link: "",
    platform: GroupPlatform.WHATSAPP, // default

    uiConfig: {
      platformColor: "text-emerald-600",
      platformBg: "bg-emerald-50",
      iconName: "MessageCircle",
    },
  });

  useEffect(() => {
    if (classId && groupId) {
      dispatch(
        fetchSingleClassGroup({
          classId: classId as string,
          groupId: groupId as string,
        }),
      );
    }
  }, [classId, groupId]);

  // populate form once singleGroup loads
  useEffect(() => {
    if (singleGroup) {
      const snapshot = {
        name: singleGroup.name,
        description: singleGroup.description,
        link: singleGroup.link,
        platform: singleGroup.platform,
        uiConfig: singleGroup.uiConfig,
      };
      setFormData(snapshot);
      originalFormRef.current = snapshot; // for dirty tracking
    }
  }, [singleGroup]);

  // run after every formData change
  useEffect(() => {
    if (!originalFormRef.current) return;
    const dirty = getDirtyFields(originalFormRef.current, formData);
    setIsDirty(Object.keys(dirty).length > 0);
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlatformChange = (platform: GroupPlatform) => {
    const config = GROUP_PLATFORM_CONFIG[platform];

    setFormData((prev) => ({
      ...prev,
      platform,
      uiConfig: config.uiConfig,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formEl = e.currentTarget as HTMLFormElement;

    if (!formEl.checkValidity()) {
      formEl.reportValidity(); // browser validation UI
      return;
    }

    if (!classId && !groupId) return;

    if (!isDirty) {
      toast("No changes to save.", {
        description: "You haven't made any changes to the group.",
      });
      return;
    }

    const promise = dispatch(
      updateClassGroup({
        classId: classId as string,
        groupId: groupId as string,
        groupData: formData,
      }),
    ).unwrap();

    toast.promise(promise, {
      loading: "Creating group...",
      success: "Group created successfully!",
      error: "Failed to create group. Please try again.",
    });

    try {
      await promise;
    } catch (error) {
      return;
    }

    router.back();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <EditorHeader
        classId={classId as string}
        isNew={false}
        isDirty={isDirty}
        isLoading={isFetching || isUpdating}
      />

      {/* Error Alert */}
      {fetchError|| updateError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mx-4 mt-4">
          <p className="text-sm">
            {fetchError || updateError.message || "An error occurred. Please try again."}
          </p>
        </div>
      )}

      {/* Form Content */}
      <main className="p-4 pb-24">
        <form
          id="groupForm"
          onSubmit={handleSubmit}
          className="space-y-6 md:space-x-6 grid md:grid-cols-2"
        >
          <GroupBasicInfo
            formData={formData}
            onInputChange={handleInputChange}
            error={updateError}
          />

          <GroupLinkInput
            formData={formData}
            onInputChange={handleInputChange}
            onPlatformChange={handlePlatformChange}
            error={updateError}
          />

          <GroupPreview formData={formData} />

          <div className="col-start-1 col-end-1 md:pr-4 pl-0">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">Note:</span> All
                group links will be reviewed before being added. Please ensure
                the link is valid and appropriate for class communication.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
