"use client";

import React from "react";
import {
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import type { CreateUpdateFormData } from "@/types/update.types";

interface DescriptionEditorProps {
  form: CreateUpdateFormData;
  setForm: React.Dispatch<React.SetStateAction<CreateUpdateFormData>>;
}

export function DescriptionEditor({ form, setForm }: DescriptionEditorProps) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] md:text-[11px] font-bold text-[#617789] uppercase tracking-wider flex items-center gap-1">
        Description
      </label>

      <div className="bg-slate-50 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-primary transition-all overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-100/50">
          <button className="p-1.5 hover:bg-slate-200 rounded transition-colors">
            <Bold size={16} />
          </button>
          <button className="p-1.5 hover:bg-slate-200 rounded transition-colors">
            <Italic size={16} />
          </button>
          <button className="p-1.5 hover:bg-slate-200 rounded transition-colors">
            <List size={16} />
          </button>
          <div className="w-px h-6 bg-slate-300 mx-1"></div>
          <button className="p-1.5 hover:bg-slate-200 rounded transition-colors">
            <LinkIcon size={16} />
          </button>
          <button className="p-1.5 hover:bg-slate-200 rounded transition-colors">
            <ImageIcon size={16} />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full text-[13px] md:text-[14px] lg:text-[15px] p-4 bg-transparent border-none focus:ring-0 text-slate-900 resize-none outline-none"
          placeholder="Share more details with your students..."
          rows={6}
        />
      </div>
    </div>
  );
}
