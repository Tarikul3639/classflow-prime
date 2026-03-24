"use client";

import React from "react";
import { Download, FileText, FileSpreadsheet, Link as LinkIcon, SquareArrowOutUpRight } from "lucide-react";
import type { Material } from "@/types/update.types";

interface UpdateMaterialProps {
  material: Material;
}

export default function UpdateMaterial({
  material,
}: UpdateMaterialProps) {
  const handleClick = () => {
    if (material.url) {
      window.open(material.url, "_blank");
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (material.url) {
      const link = document.createElement("a");
      link.href = material.url;
      link.download = material.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getIconAndColor = () => {
    const fileExtension = material.type.toLowerCase();
    
    if (fileExtension === "pdf") {
      return {
        icon: <FileText size={16} />,
        bgColor: "bg-red-100",
        textColor: "text-red-600",
        isLink: false
      };
    } else if (fileExtension === "doc" || fileExtension === "docx") {
      return {
        icon: <FileText size={16} />,
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
        isLink: false
      };
    } else if (fileExtension === "xls" || fileExtension === "xlsx") {
      return {
        icon: <FileSpreadsheet size={16} />,
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        isLink: false
      };
    } else if (fileExtension === "link" || fileExtension === "url") {
      return {
        icon: <LinkIcon size={16} />,
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
        isLink: true
      };
    } else {
      return {
        icon: <Download size={16} />,
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        isLink: false
      };
    }
  };

  const { icon, bgColor, textColor, isLink } = getIconAndColor();

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
    >
      <div className={`w-8 h-8 flex items-center justify-center ${bgColor} ${textColor} rounded`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-900 truncate">
          {material.name}
        </p>
        <p className="text-[10px] text-slate-500">{material.size}</p>
      </div>
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