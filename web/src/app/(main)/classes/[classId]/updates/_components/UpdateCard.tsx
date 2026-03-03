"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import UpdateAttachment from "./UpdateAttachment";
import UpdateEngagement from "./UpdateEngagement";

interface Attachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}

interface Engagement {
  avatars?: string[];
  commentCount?: number;
}

interface UpdateCardProps {
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  courseCode?: string;
  timestamp: string;
  description: string;
  attachment?: Attachment;
  engagement?: Engagement;
}

export default function UpdateCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  courseCode,
  timestamp,
  description,
  attachment,
  engagement,
}: UpdateCardProps) {
  return (
    <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-3 hover:border-primary/30 transition-all mb-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}
            >
              <Icon size={20} />
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-slate-900">{title}</h4>
            <p className="text-xs text-slate-500">
              {courseCode} • {timestamp}
            </p>
          </div>
        </div>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>

      {attachment && <UpdateAttachment attachment={attachment} />}

      {/* {engagement && <UpdateEngagement engagement={engagement} />} */}
    </article>
  );
}