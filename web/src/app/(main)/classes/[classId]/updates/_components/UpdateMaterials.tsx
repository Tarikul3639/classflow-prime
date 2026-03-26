"use client";

import React from "react";
import {
  Download,
  SquareArrowOutUpRight,
} from "lucide-react";
import type { Material } from "@/types/update.types";
import { MATERIAL_TYPE_CONFIG } from "@/types/update.types";
import { formatFileSize } from "@/utils/formatFileSize";

interface UpdateMaterialProps {
  material: Material;
}

export default function UpdateMaterial({ material }: UpdateMaterialProps) {
  const config = MATERIAL_TYPE_CONFIG[material.type];
  const Icon = config.icon;
  const isLink = material.type === "link";

  const handleClick = () => {
    if (!material.url) return;
    if (isLink) {
      // External link
      window.open(material.url, "_blank", "noopener,noreferrer");
    } else {
      // PDF, DOCX, Image, Video preview in new tab
      window.open(material.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!material.url || isLink) return;

    const link = document.createElement("a");
    link.href = material.url; // make sure this is secure_url from Cloudinary
    link.download = material.name || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
    >
      {/* Icon */}
      <div
        className={`w-8 h-8 flex items-center justify-center ${config.bgColor} ${config.color} rounded`}
      >
        <Icon size={16} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-900 truncate">
          {material.name || "Untitled"}
        </p>
        <p className="text-[10px] text-slate-500">
          {material.size ? formatFileSize(material.size) : "—"}
        </p>
      </div>

      {/* Action */}
      {isLink ? (
        <button className="text-primary hover:text-primary/80">
          <SquareArrowOutUpRight size={20} />
        </button>
      ) : (
        <button
          onClick={handleDownload}
          className="text-primary hover:text-primary/80"
        >
          <Download size={20} />
        </button>
      )}
    </div>
  );
}