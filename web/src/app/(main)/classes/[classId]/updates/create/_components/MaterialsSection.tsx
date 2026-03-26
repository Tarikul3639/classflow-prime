"use client";

import React, { useState } from "react";
import {
  Link as LinkIcon,
  PlusCircle,
  Trash2,
  Loader,
  CheckCircle2,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Material,
  CreateUpdateFormData,
  MATERIAL_TYPE_CONFIG,
} from "@/types/update.types";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFileUpload } from "@/hooks/useCloudinary";
import { toast } from "sonner";

interface MaterialsSectionProps {
  form: CreateUpdateFormData;
  setForm: React.Dispatch<React.SetStateAction<CreateUpdateFormData>>;
}

export function MaterialsSection({ form, setForm }: MaterialsSectionProps) {
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const { upload } = useFileUpload();

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
    value: string | number,
  ) => {
    setForm({
      ...form,
      materials: form.materials.map((a) =>
        a._id === id ? { ...a, [field]: value } : a,
      ),
    });
  };

  const handleFileUpload = async (id: string, file: File) => {
    try {
      setUploadingId(id);

      const currentMaterial = form.materials.find((m) => m._id === id);
      if (currentMaterial && !currentMaterial.name) {
        updateMaterial(id, "name", file.name.split(".")[0]);
      }

      // ✅ Cloudinary upload
      const result = await upload(file, "materials");

      updateMaterial(id, "url", result.secure_url);
      updateMaterial(id, "size", file.size);
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("File upload failed. Please try again.", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setUploadingId(null);
    }
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
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg bg-[#399aef] text-white text-[10px] md:text-[11px] font-bold uppercase tracking-wide hover:bg-[#2d82cc] transition-all shadow shadow-[#399aef]/10 cursor-pointer"
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
                description="Descriptive name for the material."
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
                description="Resource format."
              />
            </div>

            {/* URL with Upload Button */}
            <div className="relative md:w-full group/url">
              <Input
                label="URL"
                disabled={uploadingId === material._id}
                value={material.url}
                onChange={(e) =>
                  updateMaterial(material._id, "url", e.target.value)
                }
                type="url"
                placeholder="https://example.com/file.pdf"
                description="Direct link or upload a file."
                className="pr-12" // Space for the upload button
              />

              <div className="absolute right-2 bottom-2.5 md:bottom-3 xl:bottom-6">
                <input
                  type="file"
                  id={`file-upload-${material._id}`}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(material._id, file);
                  }}
                />

                <label
                  htmlFor={`file-upload-${material._id}`}
                  className={`flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all duration-300 
                    ${
                      uploadingId === material._id
                        ? "bg-slate-100 text-slate-400"
                        : material.url
                          ? "bg-green-50 text-green-600 border border-green-100"
                          : "bg-white border border-slate-200 text-[#399aef] hover:bg-[#399aef] hover:text-white"
                    }`}
                >
                  {uploadingId === material._id ? (
                    <Loader className="size-3.5 animate-spin" />
                  ) : material.url ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <Upload className="size-3.5" />
                  )}
                </label>
              </div>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeMaterial(material._id)}
              className="self-end md:self-center bottom-2 right-2 p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-lg border border-slate-200 cursor-pointer shadow-sm active:scale-95"
              title="Remove Material"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {/* Empty State */}
        {form.materials.length === 0 && (
          <EmptyState
            size="sm"
            icon={LinkIcon}
            title="No Materials Added"
            description="Add materials like lecture notes, slides, or links to support your update."
            actionLabel="Add Material"
          />
        )}
      </div>
    </div>
  );
}
