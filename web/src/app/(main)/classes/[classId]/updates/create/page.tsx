// updates/create/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { UpdateEditorHeader } from "./_components/UpdateEditorHeader";
import { UpdateForm } from "./_components/UpdateForm";
import { UpdatePreview } from "./_components/UpdatePreview";
import { ProTip } from "./_components/ProTip";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createClassUpdate } from "@/store/features/classes/thunks/create-class-update.thunk";
import type { CreateUpdateFormData } from "@/types/update.types";

import { toast } from "sonner";

export default function CreateUpdatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useParams();
  const classId = params.classId as string;

  const { loading, error } = useAppSelector(
    (state) => state.classes.createClassUpdate,
  );

  const [form, setForm] = useState<CreateUpdateFormData>({
    category: "announcement",
    title: "",
    description: "",
    eventAt: null,
    materials: [],
  });

  useEffect(() => {
    if (error?.message) {
      const el = document.getElementById("update-form");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const handleSubmit = async () => {
    await dispatch(createClassUpdate({ classId, updateData: form }))
      .unwrap()
      .then((res) => {
        toast.success("Update created successfully!", {
          description: res.message,
          position: "top-center",
        });
        router.push(`/classes/${classId}/updates`);
      })
      .catch((err) => {
        toast.error("Failed to create update", {
          description: err.message,
          position: "top-center",
        });
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <UpdateEditorHeader
        classId={classId}
        isNew={true}
        isLoading={loading}
        error={error?.message || null}
        onSubmit={handleSubmit}
      />

      <main className="flex-1 overflow-y-auto p-2 md:p-4 lg:p-6">
        <div className="mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-7">
            <UpdateForm form={form} setForm={setForm} error={error} />;
          </div>

          <div className="xl:col-span-5">
            <div className="sticky top-24 xl:top-0 space-y-4">
              <UpdatePreview form={form} />
              <ProTip />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
