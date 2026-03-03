"use client";

import React from "react";
import { MessageCircle } from "lucide-react";

interface Engagement {
  avatars?: string[];
  commentCount?: number;
}

interface UpdateEngagementProps {
  engagement: Engagement;
}

export default function UpdateEngagement({
  engagement,
}: UpdateEngagementProps) {
  return (
    <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
      <div className="flex -space-x-2">
        {engagement.avatars?.map((avatar, idx) => (
          <img
            key={idx}
            alt="User Avatar"
            className="w-6 h-6 rounded-full border-2 border-white"
            src={avatar}
          />
        ))}
        {engagement.commentCount && engagement.commentCount > 2 && (
          <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
            +{engagement.commentCount - 2}
          </div>
        )}
      </div>
      {engagement.commentCount && (
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
          <MessageCircle size={14} />
          {engagement.commentCount} comments
        </span>
      )}
    </div>
  );
}