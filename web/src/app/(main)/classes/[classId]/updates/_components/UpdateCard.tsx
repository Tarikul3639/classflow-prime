"use client";

import React from "react";
import { LucideIcon, Timer } from "lucide-react";
import UpdateAttachment from "./UpdateAttachment";
import UpdateEngagement from "./UpdateEngagement";

interface Attachment {
  name: string;
  size: string;
  type: string;
  url?: string;
}
[];

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
  courseName?: string;
  timestamp: string;
  description: string;
  eventDate?: string;
  eventTime?: string;
  attachment?: Attachment[];
  engagement?: Engagement;
}

export default function UpdateCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  courseCode,
  courseName,
  timestamp,
  description,
  eventDate,
  eventTime,
  attachment,
  engagement,
}: UpdateCardProps) {
  return (
    <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3 active:bg-slate-50 transition-colors">
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
              <div className="flex items-center gap-1.5">
                <span>
                  {eventDate} • {eventTime}
                </span>
              </div>
            </p>
          </div>
        </div>
        <span className="text-xs font-medium text-slate-400">
          Posted {timestamp}
        </span>
      </div>

      {/* Event Date/Time Badge */}
      {/* {eventDate && eventTime && (
        <div className="flex items-center gap-1.5 text-primary text-xs font-semibold bg-blue-50 w-fit px-2.5 py-1 rounded-md">
          <Timer size={14} />
          <span>
            {eventDate} • {eventTime}
          </span>
        </div>
      )} */}

      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>

      {attachment &&
        attachment.map((att) => (
          <UpdateAttachment key={att.name} attachment={att} />
        ))}

      {/* {engagement && <UpdateEngagement engagement={engagement} />} */}
    </article>
  );
}
