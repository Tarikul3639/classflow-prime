// updates/[updateId]/edit/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { UpdateEditorHeader } from "../../updates/create/_components/UpdateEditorHeader";
import { UpdateForm } from "../../updates/create/_components/UpdateForm";
import { UpdatePreview } from "../../updates/create/_components/UpdatePreview";
import { ProTip } from "../../updates/create/_components/ProTip";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSingleClassUpdate } from "@/store/features/classes/thunks/fetch-single-class-update.thunk";
import { updateClassUpdate } from "@/store/features/classes/thunks/update-class-update.thunk";
import type { CreateUpdateFormData } from "@/types/update.types";
import { toast } from "sonner";

export default function EditUpdatePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const params = useParams();
    const classId = params.classId as string;
    const updateId = params.updateId as string;

    const { loading: fetchLoading } = useAppSelector(
        (state) => state.classes.fetchSingleClassUpdate,
    );

    const { loading, error } = useAppSelector(
        (state) => state.classes.updateClassUpdate,
    );

    const [form, setForm] = useState<CreateUpdateFormData>({
        category: "announcement",
        title: "",
        description: "",
        eventAt: null,
        materials: [],
    });

    // Fetch the existing update details on component mount
    useEffect(() => {
        dispatch(fetchSingleClassUpdate({ classId, updateId }))
            .unwrap()
            .then((res) => {
                setForm({
                    category: res.category,
                    title: res.title,
                    description: res.description,
                    eventAt: res.eventAt || "",
                    materials: res.materials ?? [],
                });
            })
            .catch((err) => {
                toast.error("Failed to load update", {
                    description: err.message,
                    position: "top-center",
                });
                router.push(`/classes/${classId}/updates`);
            });
    }, [classId, updateId]);

    useEffect(() => {
        if (error?.message) {
            const el = document.getElementById("update-form");
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [error]);

    const handleSubmit = async () => {
        await dispatch(updateClassUpdate({ classId, updateId, updateData: form }))
            .unwrap()
            .then((res) => {
                toast.success("Update saved successfully!", {
                    position: "top-center",
                });
                router.push(`/classes/${classId}/updates`);
            })
            .catch((err) => {
                toast.error("Failed to save update", {
                    description: err.message,
                    position: "top-center",
                });
            });
    };

    if (fetchLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <p className="text-sm text-slate-500">Loading update...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <UpdateEditorHeader
                classId={classId}
                isNew={false}
                isLoading={loading}
                error={error?.message || null}
                onSubmit={handleSubmit}
            />

            <main className="flex-1 overflow-y-auto p-2 md:p-4 lg:p-6">
                <div className="mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
                    <div className="xl:col-span-7">
                        <UpdateForm form={form} setForm={setForm} error={error} />
                    </div>

                    <div className="xl:col-span-5">
                        <div className="sticky top-24 xl:top-0 space-y-4">
                            <UpdatePreview form={form} />
                            <ProTip />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
