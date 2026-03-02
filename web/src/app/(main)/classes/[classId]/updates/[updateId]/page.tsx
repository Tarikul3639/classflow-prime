"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  X,
  FileText,
  Download,
  AlertCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  ChevronDown,
  Lightbulb,
  Eye,
  MessageCircle,
  Bookmark,
  PlusCircle,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { UpdateEditorHeader } from "./UpdateEditorHeader";

interface Attachment {
  _id: string;
  name: string;
  url: string;
  type: string;
}

interface UpdateForm {
  _id: string;
  type: "announcement" | "assignment" | "exam" | "material";
  title: string;
  description: string;
  date: string;
  time: string;
  attachments: Attachment[];
}

export default function UpdateEditorPage({
  params,
}: {
  params: { classId: string; updateId: string };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isNew = params.updateId === "new";

  const [form, setForm] = useState<UpdateForm>({
    _id: params.updateId,
    type: "announcement",
    title: "Midterm Exam Schedule Revision",
    description:
      "Please be advised that the midterm exam scheduled for next Tuesday has been moved to Wednesday to accommodate the guest lecture series. The syllabus remains the same.",
    date: "2026-03-15",
    time: "10:30",
    attachments: [
      {
        _id: "1",
        name: "exam-syllabus.pdf",
        url: "https://example.com/syllabus.pdf",
        type: "pdf",
      },
    ],
  });

  const addAttachment = () => {
    setForm({
      ...form,
      attachments: [
        ...form.attachments,
        { _id: Date.now().toString(), type: "pdf", name: "", url: "" },
      ],
    });
  };

  const removeAttachment = (id: string) => {
    setForm({
      ...form,
      attachments: form.attachments.filter((a) => a._id !== id),
    });
  };

  const updateAttachment = (
    id: string,
    field: keyof Attachment,
    value: string,
  ) => {
    setForm({
      ...form,
      attachments: form.attachments.map((a) =>
        a._id === id ? { ...a, [field]: value } : a,
      ),
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Uncomment to test error state:
      // throw new Error("Failed to publish update. Please try again.");

      console.log("Publishing update:", form);
      router.push(`/classes/${params.classId}/updates`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Component */}
      <UpdateEditorHeader
        classId={params.classId}
        isNew={isNew}
        isLoading={isLoading}
        error={error}
        onSubmit={handleSubmit}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Column - Form */}
          <div className="xl:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xs">
              <div className="space-y-4">
                {/* Title */}
                <Input
                  label="Update Title"
                  placeholder="e.g., Midterm Exam Schedule Revision"
                  description="Keep it concise and informative to grab students' attention."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                {/* Select */}
                <Select
                  label="Update Type"
                  value={form.type}
                  description="Choose the type of update you're creating. This helps students understand the context at a glance."
                  options={[
                    { value: "announcement", label: "General Announcement" },
                    { value: "assignment", label: "Assignment Update" },
                    { value: "exam", label: "Exam Information" },
                    { value: "material", label: "Course Material" },
                  ]}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as any })
                  }
                />

                {/* Schedule Section with Calendar */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-primary">
                      <CalendarIcon size={16} />
                    </div>
                    <h3 className="text-[10px] md:text-[11px] font-bold text-[#617789] uppercase tracking-wider">
                      Schedule
                    </h3>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Calendar */}
                    <Calendar
                      mode="single"
                      selected={
                        form.date
                          ? new Date(form.date + "T00:00:00")
                          : undefined
                      }
                      onSelect={(date) => {
                        if (!date) return;
                        const yyyy = date.getFullYear();
                        const mm = String(date.getMonth() + 1).padStart(2, "0");
                        const dd = String(date.getDate()).padStart(2, "0");
                        setForm({ ...form, date: `${yyyy}-${mm}-${dd}` });
                      }}
                      className="w-full md:w-80 bg-slate-50 border border-slate-200 rounded-xl p-4"
                      classNames={{
                        day: "w-full aspect-square flex items-center justify-center rounded-lg transition-colors",
                        today: "bg-gray-500 text-white font-semibold rounded",
                      }}
                    />

                    {/* Time Inputs */}
                    <div className="flex-1 space-y-4">
                      <Input
                        label="Start Time"
                        type="time"
                        value={form.time}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            time: form.time ? e.target.value : "10:00",
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] md:text-[11px] font-bold text-[#617789] uppercase tracking-wider flex items-center gap-1">
                    Description
                  </label>
                  <div className="bg-slate-50 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-primary transition-all overflow-hidden">
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
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full p-4 bg-transparent border-none focus:ring-0 text-slate-900 resize-none outline-none"
                      placeholder="Share more details with your students..."
                      rows={6}
                    />
                  </div>
                </div>

                {/* Attachments Section - Updated */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 lg:gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#399aef]/10 flex items-center justify-center text-[#399aef]">
                        <LinkIcon className="size-3.5" />
                      </div>
                      <h3 className="text-[10px] md:text-[11px] font-bold text-[#617789] uppercase tracking-wider">
                        Materials
                      </h3>
                    </div>
                    <button
                      onClick={addAttachment}
                      className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg lg:rounded-xl bg-[#399aef] text-white text-[8px] sm:text-[9px] lg:text-[10px] font-black uppercase tracking-widest hover:bg-[#2d82cc] transition-all shadow-lg shadow-[#399aef]/10"
                    >
                      <PlusCircle size={12} className="lg:w-3.5 lg:h-3.5" /> Add
                      Material
                    </button>
                  </div>

                  <div className="grid gap-3">
                    {form.attachments.map((attachment) => (
                      <div
                        key={attachment._id}
                        className="flex flex-col md:flex-row gap-4 p-4 sm:p-5 lg:p-6 bg-[#f8fafc] border border-dashed border-[#dbe1e6] rounded-xl lg:rounded-2xl group transition-all hover:border-[#399aef] hover:bg-white"
                      >
                        {/* Attachment Name */}
                        <div className="flex-1 space-y-1.5">
                          <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                            File Name
                          </p>
                          <input
                            value={attachment.name}
                            onChange={(e) =>
                              updateAttachment(
                                attachment._id,
                                "name",
                                e.target.value,
                              )
                            }
                            type="text"
                            className="w-full bg-transparent font-semibold text-[11px] sm:text-[12px] lg:text-[13px] outline-none text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                            placeholder="e.g. Lecture Notes"
                          />
                        </div>

                        {/* File Type */}
                        <div className="flex-1 space-y-1.5">
                          <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                            Type
                          </p>
                          <select
                            value={attachment.type}
                            onChange={(e) =>
                              updateAttachment(
                                attachment._id,
                                "type",
                                e.target.value,
                              )
                            }
                            className="w-full bg-transparent font-medium text-[11px] sm:text-[12px] lg:text-[13px] text-slate-900 outline-none"
                          >
                            <option value="pdf">PDF</option>
                            <option value="docx">DOCX</option>
                            <option value="image">Image</option>
                            <option value="link">Link</option>
                          </select>
                        </div>

                        {/* URL */}
                        <div className="flex-[1.5] space-y-1.5">
                          <p className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                            URL
                          </p>
                          <input
                            value={attachment.url}
                            onChange={(e) =>
                              updateAttachment(
                                attachment._id,
                                "url",
                                e.target.value,
                              )
                            }
                            type="url"
                            className="w-full bg-transparent font-medium text-[11px] sm:text-[12px] lg:text-[13px] text-primary outline-none placeholder:text-slate-400"
                            placeholder="https://example.com/file.pdf"
                          />
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeAttachment(attachment._id)}
                          className="self-end md:self-center p-2 text-slate-400 hover:text-red-500 transition-colors bg-white md:bg-transparent rounded-lg border border-slate-200 md:border-none"
                          title="Remove Attachment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}

                    {form.attachments.length === 0 && (
                      <div className="py-10 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 opacity-50 bg-slate-50/50">
                        <p className="text-xs font-semibold text-slate-500">
                          No attachments added yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="xl:col-span-5">
            <div className="sticky top-24 xl:top-0 space-y-4">
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
                <div className="p-6">
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
                  <h4 className="text-lg font-bold text-slate-900 mb-2">
                    {form.title || "Update Title"}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {form.description || "Description will appear here..."}
                  </p>
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

              {/* Pro Tip */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 flex gap-4">
                <Lightbulb className="text-primary shrink-0" size={20} />
                <div>
                  <p className="text-sm font-bold text-primary mb-1">Pro Tip</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    High priority updates are pinned to the top of students'
                    feeds and trigger immediate mobile notifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
