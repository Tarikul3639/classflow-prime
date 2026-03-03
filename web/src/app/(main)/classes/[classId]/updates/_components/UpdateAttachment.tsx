"use client";

import React from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  Link as LinkIcon,
  SquareArrowOutUpRight,
} from "lucide-react";

interface Attachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

interface UpdateAttachmentProps {
  attachment: Attachment;
}

export default function UpdateAttachment({
  attachment,
}: UpdateAttachmentProps) {
  const handleClick = () => {
    if (attachment.url) {
      window.open(attachment.url, "_blank");
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click
    if (attachment.url) {
      // Create a temporary anchor element for download
      const link = document.createElement("a");
      link.href = attachment.url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Get icon and color based on file type
  const getIconAndColor = () => {
    const fileExtension = attachment.type.toLowerCase();

    if (fileExtension === "pdf") {
      return {
        icon: <FileText size={16} />,
        bgColor: "bg-red-100",
        textColor: "text-red-600",
        isLink: false,
      };
    } else if (fileExtension === "doc" || fileExtension === "docx") {
      return {
        icon: <FileText size={16} />,
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
        isLink: false,
      };
    } else if (fileExtension === "xls" || fileExtension === "xlsx") {
      return {
        icon: <FileSpreadsheet size={16} />,
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        isLink: false,
      };
    } else if (fileExtension === "link" || fileExtension === "url") {
      return {
        icon: <LinkIcon size={16} />,
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
        isLink: true,
      };
    } else {
      return {
        icon: <Download size={16} />,
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        isLink: false,
      };
    }
  };

  const { icon, bgColor, textColor, isLink } = getIconAndColor();

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
    >
      <div
        className={`w-8 h-8 flex items-center justify-center ${bgColor} ${textColor} rounded`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-900 truncate">
          {attachment.name}
        </p>
        <p className="text-[10px] text-slate-500">{attachment.size}</p>
      </div>
      {isLink ? (
        <button className="text-primary hover:text-blue-800">
          <SquareArrowOutUpRight size={20} />
        </button>
      ) : (
        <button
          onClick={handleDownload}
          className="text-primary hover:text-blue-800"
        >
          <Download size={20} />
        </button>
      )}
    </div>
  );
}
