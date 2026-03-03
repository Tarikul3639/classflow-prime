"use client";

import React from "react";
import { FileText, Download, MessageCircle, Eye, Bookmark } from "lucide-react";
import UpdateCard from "../../_components/UpdateCard";

interface Attachment {
  _id: string;
  name: string;
  size: string;
  url: string;
  type: string;
}

interface UpdateFormData {
  title: string;
  description: string;
  attachments: Attachment[];
  [key: string]: any;
}

interface UpdatePreviewProps {
  form: UpdateFormData;
}

export function UpdatePreview({ form }: UpdatePreviewProps) {
  return (
    <>
      {/* Preview Header */}
      <div className="flex items-center justify-between">
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
          icon={FileText}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          title={form.title}
          description={form.description}
          attachment={form.attachments}
          eventDate="12 Feb"
          eventTime="10:00 AM"
          // eventDate={form.eventDate}
          // eventTime={form.eventTime}
          timestamp="Just now"
        />
      </div>
    </>
  );
}
