"use client";

import React, { useState } from "react";
import { Loader, Download, SquareArrowOutUpRight } from "lucide-react";
import type { Material } from "@/types/update.types";
import { MATERIAL_TYPE_CONFIG } from "@/types/update.types";
import { formatFileSize } from "@/utils/formatFileSize";

interface UpdateMaterialProps {
  material: Material;
}

export default function UpdateMaterial({ material }: UpdateMaterialProps) {
  const config = MATERIAL_TYPE_CONFIG[material.type] ?? MATERIAL_TYPE_CONFIG["link"];
  const Icon = config.icon;
  const isLink = material.type === "link";

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!material.url || isLink) return;

    try {
      setDownloading(true);
      const response = await fetch(material.url);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = material.name || "file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <a
      href={material.url}
      target="_blank"
      rel="noopener noreferrer"
      // Added group class to trigger hover effects on children
      className={`group flex items-center gap-3 p-3 rounded-sm border border-transparent transition-colors cursor-default ${config.bgColor} hover:brightness-98`}
    >
      {/* Icon */}
      <div className={`w-8 h-8 flex items-center justify-center ${config.color} rounded`}>
        <Icon className="size-5 md:size-6" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        {/* Removed hover:underline and text-900 replacement logic for a cleaner hover effect */}
        <p className={`text-xs font-semibold truncate group-hover:underline ${config.color}`}>
          {material.name || "Untitled"}
        </p>

        {!isLink && (
          <p className="text-[10px] text-slate-500">
            {material.size ? formatFileSize(material.size) : "—"}
          </p>
        )}
      </div>

      {/* Action Button */}
      {isLink ? (
        <div className={`${config.color} group-hover:scale-110 transition-transform`}>
          <SquareArrowOutUpRight size={20} />
        </div>
      ) : (
        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className={`${config.color} hover:opacity-70 transition-opacity cursor-pointer disabled:cursor-not-allowed`}
        >
          {downloading ? (
            <Loader size={20} className="animate-spin" />
          ) : (
            <Download size={20} />
          )}
        </button>
      )}
    </a>
  );
}