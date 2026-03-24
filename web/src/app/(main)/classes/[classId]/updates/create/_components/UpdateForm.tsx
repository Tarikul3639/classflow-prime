"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ScheduleSection } from "./ScheduleSection";
import { DescriptionEditor } from "./DescriptionEditor";
import { MaterialsSection } from "./MaterialsSection";
import {
  UPDATE_TYPE_CONFIG,
  CreateUpdateFormData,
  UpdateType,
} from "@/types/update.types";

interface UpdateFormProps {
  form: CreateUpdateFormData;
  setForm: React.Dispatch<React.SetStateAction<CreateUpdateFormData>>;
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
          options={Object.entries(UPDATE_TYPE_CONFIG).map(
            ([value, config]) => ({
              value,
              label: config.label,
            }),
          )}
          onChange={(e) =>
            setForm({ ...form, type: e.target.value as UpdateType })
          }
        />

        {/* Schedule Section */}
        <ScheduleSection form={form} setForm={setForm as any} />

        {/* Description Editor */}
        <DescriptionEditor form={form} setForm={setForm as any} />

        {/* Materials Section */}
        <MaterialsSection form={form} setForm={setForm} />
      </div>
    </div>
  );
}
