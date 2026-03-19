"use client";

import React, { useEffect } from "react";
import { ArrowLeft, Camera, Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

import {
  updateFormData,
  resetForm,
} from "@/redux/slices/classes/reducers/create-class.reducer";
import { createClass } from "@/redux/slices/classes/thunks/create-class.thunk";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

const errorFieldMap: Record<string, string> = {
  ClassName: "className",
  Department: "department",
  Semester: "semester",
  About: "about",
  CoverImage: "coverImage",
};

const DEPARTMENTS = [
  { id: "cs", name: "Computer Science" },
  { id: "math", name: "Mathematics" },
  { id: "eng", name: "English" },
  { id: "phy", name: "Physics" },
  { id: "chem", name: "Chemistry" },
  { id: "bio", name: "Biology" },
  { id: "hist", name: "History" },
  { id: "art", name: "Art" },
  { id: "bus", name: "Business" },
  { id: "other", name: "Other" },
];

export default function CreateClassPage() {
  const router = useRouter();
  const despatch = useAppDispatch();
  const { formData, loading, error } = useAppSelector(
    (state) => state.classes.createClass,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    despatch(createClass(formData))
      .unwrap()
      .then((res) => {
        console.log("🎯 Class created successfully:", res);
        router.push(`/classes/${res.data.classId}/overview`);
        despatch(resetForm());
      })
      .catch((err) => {
        if (err.field) {
          const fieldId = errorFieldMap[error.field || ""];

          const el = document.getElementById(fieldId);

          if (el) {
            el.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });

            // optional: focus
            if ("focus" in el) {
              (el as HTMLElement).focus();
            }
          }
        } else {
          toast("Failed to create class", {
            description: err.message,
            position: "top-center",
          });
        }
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200/80 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={router.back}
            className="group flex items-center justify-center p-2 rounded-lg hover:bg-white transition-colors border border-slate-200 bg-white cursor-pointer hover:border-primary/30"
          >
            <ArrowLeft
              className="text-slate-900 group-hover:text-primary group-hover:-translate-x-0.5 transition-all duration-200"
              size={18}
            />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Create New Class
            </h1>
            <p className="text-slate-500 text-xs block">
              Set up a new virtual classroom for your students.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <form onSubmit={handleSubmit} className="h-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
                {/* Banner Image */}
                <div className="relative h-64 w-full group">
                  <img
                    alt="Class Banner Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    src={formData.coverImage || ""}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <label className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl hover:bg-white transition-all active:scale-95 border border-white/50 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          // const file = e.target.files?.[0];
                          // if (file) {
                          //   const reader = new FileReader();
                          //   reader.onloadend = () => {
                          //     despatch(
                          //       updateFormData({
                          //         coverImage: reader.result as string,
                          //       }),
                          //     );
                          //   };
                          //   reader.readAsDataURL(file);
                          // }
                          alert(
                            "Image upload is currently disabled in this demo.",
                          );
                        }}
                        className="hidden"
                      />
                      <Camera className="text-primary size-4 md:size-5" />
                      <span className="text-xs md:text-sm font-semibold text-slate-900">
                        Upload Class Banner
                      </span>
                    </label>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">
                      Preview Mode
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="p-6 md:p-10 space-y-6">
                  {/* Class Name */}
                  <Input
                    id="className"
                    label="Class Name"
                    placeholder="e.g. Introduction to Computer Science"
                    value={formData.className}
                    error={
                      error?.field === "ClassName"
                        ? error.message || undefined
                        : undefined
                    }
                    onChange={(e) => {
                      if (e.target.value.length <= 30)
                        despatch(updateFormData({ className: e.target.value }));
                    }}
                    description="This is the name of your class that students will see. Max 30 characters."
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Department */}
                    <Select
                      id="department"
                      label="Department"
                      placeholder="Select department"
                      options={DEPARTMENTS.map((dept) => ({
                        value: dept.id,
                        label: dept.name,
                      }))}
                      value={formData.department}
                      error={
                        error?.field === "Department"
                          ? error.message || undefined
                          : undefined
                      }
                      onChange={(e) =>
                        despatch(updateFormData({ department: e.target.value }))
                      }
                      description="The academic department this class belongs to."
                    />

                    {/* Semester */}
                    <Input
                      id="semester"
                      label="Semester"
                      placeholder="e.g. Fall 2026"
                      value={formData.semester}
                      error={
                        error?.field === "Semester"
                          ? error.message || undefined
                          : undefined
                      }
                      onChange={(e) => {
                        if (e.target.value.length <= 10)
                          despatch(
                            updateFormData({ semester: e.target.value }),
                          );
                      }}
                      description="The semester or term for this class (e.g., Fall 2026). Max 10 characters."
                    />
                  </div>

                  {/* About this class */}
                  <Textarea
                    label="About this class"
                    placeholder="Provide a brief description of the class content and objectives."
                    value={formData.about}
                    onChange={(e) => {
                      if (e.target.value.length <= 300)
                        despatch(updateFormData({ about: e.target.value }));
                    }}
                    description="A short description to help students understand what this class is about. Max 300 characters."
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Settings & Actions */}
            <div className="space-y-6">
              {/* Join via Code Toggle */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Link className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-slate-900">
                      Join via Code
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enable enrollment link
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allowJoin}
                      onChange={(e) =>
                        despatch(
                          updateFormData({ allowJoin: e.target.checked }),
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/0 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Students can automatically join using a secure link or code
                  that you'll receive after creating the class.
                </p>
              </div>

              {/* Quick Tips */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <svg
                    className="text-primary"
                    fill="none"
                    height="20"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="20"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Use a clear, descriptive class name</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Banner images work best at 1200x400px</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Course codes help students identify classes</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{loading ? "Creating..." : "Create Class"}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
