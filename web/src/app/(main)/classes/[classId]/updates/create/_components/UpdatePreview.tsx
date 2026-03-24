"use client";

import UpdateCard from "../../_components/UpdateCard";
import {
  CreateUpdateFormData,
  UPDATE_TYPE_CONFIG,
  UpdateCategory,
} from "@/types/update.types";

interface UpdatePreviewProps {
  form: CreateUpdateFormData;
}

export function UpdatePreview({ form }: UpdatePreviewProps) {
  const currentConfig =
    UPDATE_TYPE_CONFIG[form.category as UpdateCategory] ||
    UPDATE_TYPE_CONFIG.announcement;

  return (
    <>
      {/* Preview Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] md:text-[11px] lg:text-[12px] font-bold uppercase tracking-wider text-slate-500">
          Live Preview
        </h3>
        <span className="flex items-center gap-1 text-xs text-primary font-medium">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse mt-0.5"></span>
          Saved to drafts
        </span>
      </div>

      <div className="space-y-4 mx-auto w-full">
        <UpdateCard
          icon={currentConfig.icon}
          iconBg={currentConfig.iconBg}
          iconColor={currentConfig.iconColor}
          title={form.title || "Untitled Update"}
          description={form.description}
          materials={form.materials}
          eventDate={form.date || "TBD"}
          eventTime={form.time || "TBD"}
          timestamp="Just now"
        />
      </div>
    </>
  );
}
