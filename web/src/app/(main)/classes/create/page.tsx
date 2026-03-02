"use client";

import React, { useState } from "react";
import { ArrowLeft, Camera, X, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const INPUT =
  "w-full bg-slate-50 border border-slate-200 outline-none rounded-lg px-3 md:px-3.5 py-2 md:py-2.5 text-sm md:text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all";

export default function CreateClassPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [className, setClassName] = useState("");
  const [intake, setIntake] = useState("");
  const [section, setSection] = useState("");
  const [department, setDepartment] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBiqTWbkwjYy_mo_vKEgSaE_mcDquuBA4sRWKC6PF19Y12A3wiv4JvSQNg7s8MGJhzBBFYMZOtE4ETlFLyPPR6LyWXFKlBfmguClalI9wnpFaAjzg7h3XwJ1a_rD7f8H2PStW0kYFL9FizfF6E8FqPYxfbRdQJSld9DorCv1ue79zweVL6AxSpJz2gLxavBKmqlOo-l1dSn8dpdqbr9Vb7yiVdtlLZvl33bUAdQ0gFr53C-4sABTbyiFLBCPAxP_DHdCFJKFOGahopf",
  );
  const [allowJoin, setAllowJoin] = useState(true);

  const departments = [
    { id: "cs", name: "Computer Science" },
    { id: "math", name: "Mathematics" },
    { id: "eng", name: "English" },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log({
        className,
        intake,
        section,
        department,
        image: imagePreview,
        allowJoin,
      });
      setIsLoading(false);
      router.push("/classes");
    }, 2000);
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
                    src={imagePreview || ""}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <label className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl hover:bg-white transition-all active:scale-95 border border-white/50 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
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
                  <div>
                    <label
                      className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 ml-1"
                      htmlFor="class-name"
                    >
                      Class Name
                    </label>
                    <input
                      className={INPUT}
                      id="class-name"
                      placeholder="e.g. Fall 2026 7th Semester"
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Intake */}
                    <div>
                      <label
                        className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 ml-1"
                        htmlFor="intake"
                      >
                        Intake
                      </label>
                      <input
                        className={INPUT}
                        id="intake"
                        placeholder="Fall 2026"
                        type="text"
                        value={intake}
                        onChange={(e) => setIntake(e.target.value)}
                        required
                      />
                    </div>

                    {/* Section */}
                    <div>
                      <label
                        className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 ml-1"
                        htmlFor="section"
                      >
                        Section
                      </label>
                      <input
                        className={INPUT}
                        id="section"
                        placeholder="Section A"
                        type="text"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div>
                    <label
                      className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 ml-1"
                      htmlFor="department"
                    >
                      Department
                    </label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 outline-none rounded-lg px-3 md:px-3.5 py-2 md:py-2.5 text-sm md:text-[14px] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select department
                      </option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* About this class */}
                  <div>
                    <label
                      className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 ml-1"
                      htmlFor="about"
                    >
                      About this class
                    </label>
                    <textarea
                      className="w-full bg-slate-50 border border-slate-200 outline-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none h-24"
                      id="about"
                      placeholder="Add a brief description or notes about this class (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Settings & Actions */}
            <div className="space-y-6">
              {/* Join via Code Toggle */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                    <svg
                      className="text-primary"
                      fill="none"
                      height="24"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3" />
                      <line x1="8" x2="16" y1="12" y2="12" />
                    </svg>
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
                      checked={allowJoin}
                      onChange={(e) => setAllowJoin(e.target.checked)}
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
                  disabled={isLoading}
                  className="w-full py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{isLoading ? "Creating..." : "Create Class"}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
