"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UpdateEditorHeader } from "./_components/UpdateEditorHeader";
import { UpdateForm } from "./_components/UpdateForm";
import { UpdatePreview } from "./_components/UpdatePreview";
import { ProTip } from "./_components/ProTip";

interface Attachment {
  _id: string;
  name: string;
  size: string;
  url: string;
  type: string;
}

interface UpdateFormData {
  _id: string;
  type: "announcement" | "assignment" | "exam" | "material";
  title: string;
  description: string;
  date: string;
  time: string;
  attachments: Attachment[];
}

export default function UpdateEditorPage({
  params,
}: {
  params: { classId: string; updateId: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isNew = params.updateId === "new";

  const [form, setForm] = useState<UpdateFormData>({
    _id: params.updateId,
    type: "announcement",
    title: "Midterm Exam Schedule Revision",
    description:
      "Please be advised that the midterm exam scheduled for next Tuesday has been moved to Wednesday to accommodate the guest lecture series. The syllabus remains the same.",
    date: "2026-03-15",
    time: "10:30",
    attachments: [
      {
        _id: "1",
        name: "exam-syllabus.pdf",
        size: "2.4 MB",
        url: "https://example.com/syllabus.pdf",
        type: "pdf",
      },
    ],
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Publishing update:", form);
      router.push(`/classes/${params.classId}/updates`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <UpdateEditorHeader
        classId={params.classId}
        isNew={isNew}
        isLoading={isLoading}
        error={error}
        onSubmit={handleSubmit}
      />

      <main className="flex-1 overflow-y-auto p-2 md:p-4 lg:p-6">
        <div className="mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column - Form */}
          <div className="xl:col-span-7">
            <UpdateForm form={form} setForm={setForm} />
          </div>

          {/* Right Column - Preview */}
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