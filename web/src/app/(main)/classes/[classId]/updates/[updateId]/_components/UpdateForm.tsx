"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ScheduleSection } from "./ScheduleSection";
import { DescriptionEditor } from "./DescriptionEditor";
import { MaterialsSection } from "./MaterialsSection";

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

interface UpdateFormProps {
  form: UpdateFormData;
  setForm: React.Dispatch<React.SetStateAction<UpdateFormData>>;
}

export function UpdateForm({ form, setForm }: UpdateFormProps) {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-8 border border-slate-200 shadow-xs">
      <div className="space-y-6">
        {/* Title */}
        <Input
          label="Update Title"
          placeholder="e.g., Midterm Exam Schedule Revision"
          description="Keep it concise and informative to grab students' attention."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        {/* Type Select */}
        <Select
          label="Update Type"
          value={form.type}
          description="Choose the type of update you're creating. This helps students understand the context at a glance."
          options={[
            { value: "announcement", label: "General Announcement" },
            { value: "assignment", label: "Assignment Update" },
            { value: "exam", label: "Exam Information" },
            { value: "material", label: "Course Material" },
          ]}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value as UpdateFormData["type"] })
          }
        />

        {/* Schedule Section */}
        <ScheduleSection form={form} setForm={setForm as any} />

        {/* Description Editor */}
        <DescriptionEditor form={form} setForm={setForm as any} />

        {/* Materials Section */}
        <MaterialsSection form={form} setForm={setForm as any} />
      </div>
    </div>
  );
}