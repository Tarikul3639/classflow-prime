"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EditorHeader } from "./_components/EditorHeader";
import GroupBasicInfo from "./_components/GroupBasicInfo";
import GroupLinkInput from "./_components/GroupLinkInput";
import GroupPreview from "./_components/GroupPreview";

interface Group {
  _id: string;
  name: string;
  platform: string;
  link?: string;
  platformColor: string;
  platformBg: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  description: string;
}

export default function AddGroupPage({
  params,
}: {
  params: { classId: string };
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<Group>({
    _id: "",
    name: "",
    description: "",
    platform: "",
    link: "",
    platformColor: "text-emerald-600",
    platformBg: "bg-emerald-50",
    icon: () => null,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlatformChange = (platformId: string) => {
    setFormData((prev) => ({
      ...prev,
      platform: platformId,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    router.back();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <EditorHeader
        classId={params.classId}
        isNew={true}
        isLoading={false}
        onSubmit={() => handleSubmit({} as React.FormEvent)}
      />

      {/* Form Content */}
      <main className="p-4 pb-24">
        <form className="space-y-6 md:space-x-6 grid md:grid-cols-2">
          <GroupBasicInfo
            formData={formData}
            onInputChange={handleInputChange}
          />

          <GroupLinkInput
            formData={formData}
            onInputChange={handleInputChange}
            selectedPlatform={formData.platform}
            onPlatformChange={handlePlatformChange}
          />

          <GroupPreview formData={formData} />

          <div className="col-start-1 col-end-1 md:pr-4 pl-0">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">Note:</span> All
                group links will be reviewed before being added. Please ensure
                the link is valid and appropriate for class communication.
              </p>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
