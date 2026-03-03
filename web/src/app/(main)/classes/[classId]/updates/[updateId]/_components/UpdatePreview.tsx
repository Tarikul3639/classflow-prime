"use client";

import React from "react";
import { FileText, Download, MessageCircle, Eye, Bookmark } from "lucide-react";

interface Attachment {
  _id: string;
  name: string;
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
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Live Preview
        </h3>
        <span className="flex items-center gap-1 text-xs text-primary font-medium">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse mt-0.5"></span>
          Saved to drafts
        </span>
      </div>

      {/* Preview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
        {/* Card Content */}
        <div className="p-6">
          {/* Author Info */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold">
                JD
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Prof. Jane Doe
                </p>
                <p className="text-xs text-slate-500">
                  Just now • Computer Science 101
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <h4 className="text-lg font-bold text-slate-900 mb-2">
            {form.title || "Update Title"}
          </h4>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {form.description || "Description will appear here..."}
          </p>

          {/* Attachment Preview */}
          {form.attachments.length > 0 && form.attachments[0].name && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <FileText className="text-primary" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate text-slate-900">
                  {form.attachments[0].name}
                </p>
                <p className="text-[10px] text-slate-500">
                  {form.attachments[0].type.toUpperCase()} Document
                </p>
              </div>
              <Download className="text-slate-400" size={18} />
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex gap-4">
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <MessageCircle size={16} /> 0
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Eye size={16} /> 0
            </span>
          </div>
          <Bookmark className="text-slate-400" size={18} />
        </div>
      </div>
    </>
  );
}
