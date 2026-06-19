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

import type { ClassFaculty } from "@/store/features/classes/class.types";
import { fetchSingleClassFaculty } from "@/store/features/classes/thunks/fetch-single-class-faculty.thunk";
import { updateSingleClassFaculty } from "@/store/features/classes/thunks/update-single-class-faculty.thunk";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getDirtyFields } from "@/utils/form.utils";
import { useFileUpload } from "@/hooks/useCloudinary";

// Selectors
import {
  selectSingleFaculty
} from "@/store/features/classes/selectors/class-faculty.selectors";

export default function EditFacultyPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;
  const facultyId = params.facultyId as string;

  // Original snapshot — for dirty field tracking
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

  // ── Selectors ──────────────────────────────────────────────────────────────

  // Try to get faculty from normalized store first
  const cachedFaculty = useAppSelector((state) =>
    selectSingleFaculty(state, classId, facultyId)
  );

  const { loading: isFetching, isFetched, error: fetchError } = useAppSelector(
    (state) =>
      state.classes.classFaculty.facultiesByClass[classId].fetchSingle || {},
  );
  const { loading: isUpdating, error: updateError } = useAppSelector(
    (state) =>
      state.classes.classFaculty.facultiesByClass[classId].update || {},
  );

  const { upload, loading: uploadLoading } = useFileUpload();

  // ── Initialization ─────────────────────────────────────────────────────────
  useEffect(() => {
    // If already cached in store, use it directly without fetching
    if (cachedFaculty) {
      const { name, designation, avatarUrl, location, email, phone, classroomCode } =
        cachedFaculty;
      const initialData = {
        name,
        designation,
        avatarUrl: avatarUrl || "",
        location,
        email,
        phone: phone || "",
        classroomCode: classroomCode || "",
      };
      originalFormRef.current = initialData;
      setFormData(initialData);
      return;
    }

    // Not in store — fetch from API
    dispatch(fetchSingleClassFaculty({ classId, facultyId }))
      .unwrap()
      .then((res) => {
        const { name, designation, avatarUrl, location, email, phone, classroomCode } =
          res;
        const initialData = {
          name,
          designation,
          avatarUrl: avatarUrl || "",
          location,
          email,
          phone: phone || "",
          classroomCode: classroomCode || "",
        };
        originalFormRef.current = initialData;
        setFormData(initialData);
      })
      .catch((err) => {
        toast.error("Failed to load faculty details", { description: err });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Event Handlers ─────────────────────────────────────────────────────────
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
      setFormData((prev) => ({ ...prev, avatarUrl: res.secure_url }));
    } catch (err) {
      console.error(err);
    }
  };

  const removeAvatar = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: "" }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!originalFormRef.current) return;

    const dirtyFields = getDirtyFields(originalFormRef.current, formData);

    if (Object.keys(dirtyFields).length === 0) {
      toast.info("Nothing changed.", { position: "top-center" });
      return;
    }

    const promise = dispatch(
      updateSingleClassFaculty({ classId, facultyId, facultyData: dirtyFields })
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

  // ── Loading State ──────────────────────────────────────────────────────────
  if (isFetching|| !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-sm text-slate-500">Loading faculty details...</p>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <EditorHeader
        classId={classId}
        isNew={false}
        isLoading={isFetching || isUpdating}
        onSubmit={handleSubmit}
      />

      {/* Error Alert */}
      {/* {(fetchError || updateError) && ( */}
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mx-4 mt-4">
          <p className="text-sm">
            {fetchError || updateError || "An error occurred. Please try again."}
          </p>
        </div>
      {/* )} */}

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