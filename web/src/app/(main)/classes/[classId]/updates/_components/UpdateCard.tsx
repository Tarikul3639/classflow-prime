"use client";

import React from "react";
import { type LucideIcon, CalendarDays, Clock } from "lucide-react";
import UpdateMaterial from "./UpdateMaterials";
import type { Material, PostedBy, UpdateEngagement } from "@/types/update.types";
// import UpdateEngagement from "./UpdateEngagement";

interface UpdateCardProps {
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  timestamp: string;
  description: string;
  eventDate?: string;
  eventTime?: string;
  materials?: Material[];
  engagement?: UpdateEngagement;
  postedBy?: PostedBy;
  isPinned?: boolean;
}

export default function UpdateCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  timestamp,
  description,
  eventDate,
  eventTime,
  materials,
  postedBy,
  isPinned,
}: UpdateCardProps) {
  return (
    <article className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-3 active:bg-slate-50 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div
              className={`w-10 h-10 shrink-0 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}
            >
              <Icon size={18} />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              {isPinned && (
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                  Pinned
                </span>
              )}
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {title}
              </h4>
            </div>
            {/* Posted time */}
            <div className="flex items-center gap-1 text-slate-500 text-xs">
              <span>Published</span>
              <span>{timestamp}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>

      {/* Event Time Badge */}
      {(eventDate || eventTime) && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">
            Event Time
          </span>
          <div className="flex items-center gap-4">
            {eventDate && (
              <div className="flex items-center gap-1.5">
                <CalendarDays size={16} className="text-primary" />
                <span className="text-xs font-semibold text-slate-700">
                  {eventDate}
                </span>
              </div>
            )}
            {eventTime && (
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-primary" />
                <span className="text-xs font-semibold text-slate-700">
                  {eventTime}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Materials */}
      {materials && materials.length > 0 && (
        <div className="space-y-2">
          {materials.map((att) => (
            <UpdateMaterial key={att._id} material={att} />
          ))}
        </div>
      )}

      {/* Posted By */}
      {postedBy && (
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden shrink-0">
            {postedBy.avatarUrl ? (
              <img
                src={postedBy.avatarUrl}
                alt={postedBy.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-slate-500">
                {postedBy.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
          </div>
          <span className="text-xs text-slate-400">{postedBy.name}</span>
        </div>
      )}

      {/* {engagement && <UpdateEngagement engagement={engagement} />} */}
    </article>
  );
}