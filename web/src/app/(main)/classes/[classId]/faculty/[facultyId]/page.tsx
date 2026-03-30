"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { EditorHeader } from "../create/_components/EditorHeader";
import PhotoUpload from "../create/_components/PhotoUpload";
import BasicInfoSection from "../create/_components/BasicInfoSection";
import ContactInfoSection from "../create/_components/ContactInfoSection";
import FormNote from "../create/_components/FormNote";
import FacultyPreview from "../create/_components/FacultyPreview";
import { toast } from "sonner";

import type { ClassFaculty } from "@/store/features/classes/thunks/class-faculty.thunk";
import { fetchSingleClassFaculty } from "@/store/features/classes/thunks/fetch-single-class-faculty.thunk";
import { updateSingleClassFaculty } from "@/store/features/classes/thunks/update-single-class-faculty.thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getDirtyFields } from "@/utils/form.utils";
import { useFileUpload } from "@/hooks/useCloudinary";

export default function AddFacultyPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  const facultyId = params.facultyId as string;

  // Original snapshot —> for dirty tracking
  const originalFormRef = useRef<Omit<ClassFaculty, "facultyId"> | null>(null);

  const [formData, setFormData] = useState<Omit<ClassFaculty, "facultyId">>({
    name: "",
    designation: "",
    avatarUrl: "",
    location: "",
    email: "",
    phone: "",
    classroomCode: "",
  });

  useEffect(() => {
    dispatch(fetchSingleClassFaculty({ classId, facultyId }))
      .unwrap()
      .then((res) => {
        const {
          name,
          designation,
          avatarUrl,
          location,
          email,
          phone,
          classroomCode,
        } = res;
        const initialData = {
          name,
          designation,
          avatarUrl: avatarUrl || "",
          location,
          email,
          phone: phone || "",
          classroomCode: classroomCode || "",
        };
        originalFormRef.current = initialData; // snapshot save
        setFormData(initialData);
      })
      .catch((err) => {
        toast.error("Failed to load faculty details", {
          description: err,
        });
      });
  }, [dispatch, classId, facultyId]);

  const { isLoading } = useAppSelector(
    (state) => state.classes.fetchSingleClassFaculty,
  );

  const isUpdating = useAppSelector(
    (state) => state.classes.classFaculty.loading.update,
  );

  const { upload, loading: uploadLoading } = useFileUpload();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const promise = upload(file, "avatars");

    toast.promise(promise, {
      loading: "Uploading image...",
      success: "Image uploaded",
      error: "Failed to upload image",
    });

    try {
      const res = await promise;

      setFormData((prev) => ({
        ...prev,
        avatarUrl: res.secure_url, // 🔥 real URL from Cloudinary
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const removeAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      avatarUrl: "",
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!originalFormRef.current) return;

    const dirtyFields = getDirtyFields(originalFormRef.current, formData);

    if (Object.keys(dirtyFields).length === 0) {
      toast.info("Nothing changed.", { position: "top-center" });
      return;
    }

    const promise = dispatch(
      updateSingleClassFaculty({
        classId,
        facultyId,
        facultyData: dirtyFields,
      }),
    ).unwrap();

    toast.promise(promise, {
      loading: "Updating faculty...",
      success: "Faculty updated successfully",
      error: (err) => err || "Failed to update faculty",
    });

    try {
      await promise;
      router.push(`/classes/${classId}/faculty`);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-sm text-slate-500">Loading update...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <EditorHeader
        classId={classId}
        isNew={false}
        isLoading={isUpdating}
        onSubmit={handleSubmit}
      />

      {/* Form Content */}
      <main className="p-4 pb-24">
        <form className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2 p-6 flex items-center justify-center">
            <PhotoUpload
              imagePreview={formData.avatarUrl || null}
              onImageUpload={handleAvatarUpload}
              onRemoveImage={removeAvatar}
              isUploading={uploadLoading}
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

          <FacultyPreview
            formData={formData}
            imagePreview={formData.avatarUrl || null}
          />

          <FormNote />
        </form>
      </main>
    </div>
  );
}
