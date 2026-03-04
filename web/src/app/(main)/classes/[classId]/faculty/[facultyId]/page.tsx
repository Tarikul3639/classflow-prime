"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EditorHeader } from "./_components/EditorHeader";
import PhotoUpload from "./_components/PhotoUpload";
import BasicInfoSection from "./_components/BasicInfoSection";
import ContactInfoSection from "./_components/ContactInfoSection";
import FormNote from "./_components/FormNote";
import FacultyPreview from "./_components/FacultyPreview";

export default function AddFacultyPage({
  params,
}: {
  params: { classId: string; facultyId: string };
}) {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    location: "",
    email: "",
    phone: "",
    classroomCode: "",
  });

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

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        <form className="space-y-6 space-x-6 grid md:grid-cols-2">
          <div className="md:col-span-2 p-6 flex items-center justify-center">
            <PhotoUpload
              imagePreview={imagePreview}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
            />
          </div>

          <BasicInfoSection
            formData={formData}
            onInputChange={handleInputChange}
          />

          <ContactInfoSection
            formData={formData}
            onInputChange={handleInputChange}
          />

          <FacultyPreview formData={formData} imagePreview={imagePreview} />

          <FormNote />
        </form>
      </main>
    </div>
  );
}
