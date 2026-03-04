"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { GroupCard } from "../../_components/GroupCard";

interface GroupPreviewProps {
  formData: {
    _id: string;
    name: string;
    platform: string;
    platformColor: string;
    platformBg: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    description: string;
  };
}

export default function GroupPreview({ formData }: GroupPreviewProps) {
  const previewGroup = {
    _id: "preview",
    name: formData.name || "Group Name",
    description: formData.description || "Group description goes here.",
    platform: formData.platform || "whatsapp",
    platformColor: "text-emerald-600",
    platformBg: "bg-emerald-50",
    icon: MessageCircle,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-sm font-bold text-slate-900 mb-4">Preview</h3>
      <p className="text-xs text-slate-500 mb-4">
        This is how the group card will appear to students
      </p>
      <GroupCard group={previewGroup} />
    </div>
  );
}
