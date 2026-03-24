"use client";

import React from "react";
import { Link as LinkIcon, PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Material,
  CreateUpdateFormData,
  MATERIAL_TYPE_CONFIG,
} from "@/types/update.types";

interface MaterialsSectionProps {
  form: CreateUpdateFormData;
  setForm: React.Dispatch<React.SetStateAction<CreateUpdateFormData>>;
}

export function MaterialsSection({ form, setForm }: MaterialsSectionProps) {
  const addMaterial = () => {
    setForm({
      ...form,
      materials: [
        ...form.materials,
        {
          _id: crypto.randomUUID(),
          type: "pdf",
          name: "",
          url: "",
          size: 0,
        },
      ],
    });
  };

  const removeMaterial = (id: string) => {
    setForm({
      ...form,
      materials: form.materials.filter((a) => a._id !== id),
    });
  };

  const updateMaterial = (
    id: string,
    field: keyof Material,
    value: string,
  ) => {
    setForm({
      ...form,
      materials: form.materials.map((a) =>
        a._id === id ? { ...a, [field]: value } : a,
      ),
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#399aef]/10 flex items-center justify-center text-[#399aef]">
            <LinkIcon className="size-3.5" />
          </div>
          <h3 className="text-[10px] md:text-[11px] font-bold text-[#617789] uppercase tracking-wider">
            Materials
          </h3>
        </div>
        <button
          type="button"
          onClick={addMaterial}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-[#399aef] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wide hover:bg-[#2d82cc] transition-all shadow-lg shadow-[#399aef]/10 cursor-pointer"
        >
          <PlusCircle className="size-3 md:size-4" /> Add Material
        </button>
      </div>

      {/* Materials List */}
      <div className="grid gap-3">
        {form.materials.map((material) => (
          <div
            key={material._id}
            className="flex flex-col md:flex-row gap-4 p-4 sm:p-5 lg:p-6 bg-[#f8fafc] border border-dashed border-[#dbe1e6] rounded-xl lg:rounded-2xl group transition-all hover:border-[#399aef] hover:bg-white"
          >
            {/* File Name */}
            <div className="md:w-1/2">
              <Input
                label="File Name"
                value={material.name}
                onChange={(e) =>
                  updateMaterial(material._id, "name", e.target.value)
                }
                placeholder="e.g. Lecture Notes"
                description="Enter a descriptive name for the material."
              />
            </div>

            {/* Type */}
            <div className="md:w-1/2">
              <Select
                label="Type"
                value={material.type}
                onChange={(e) =>
                  updateMaterial(material._id, "type", e.target.value)
                }
                options={Object.entries(MATERIAL_TYPE_CONFIG).map(
                  ([key, config]) => ({
                    value: key,
                    label: config.label,
                  }),
                )}
                placeholder="Select type"
                description="Select the type of material."
              />
            </div>

            {/* URL */}
            <div className="md:w-full">
              <Input
                label="URL"
                value={material.url}
                onChange={(e) =>
                  updateMaterial(material._id, "url", e.target.value)
                }
                type="url"
                placeholder="https://example.com/file.pdf"
                description="Enter the URL of the material."
              />
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeMaterial(material._id)}
              className="self-end md:self-center p-2 text-slate-400 hover:text-red-500 transition-colors bg-white md:bg-transparent rounded-lg border border-slate-200 md:border-none"
              title="Remove Material"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {/* Empty State */}
        {form.materials.length === 0 && (
          <div className="py-10 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 opacity-50 bg-slate-50/50">
            <p className="text-xs font-semibold text-slate-500">
              No materials added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
