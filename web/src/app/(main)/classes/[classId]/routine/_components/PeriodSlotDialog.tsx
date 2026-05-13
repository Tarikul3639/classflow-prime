"use client";

import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { formatTo12Hour } from "@/utils/date.utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

import type {
    RoutineSlot,
    RoutinePeriod,
} from "@/types/routine.types";

// ── Constants ────────────────────────────────────────────────────────────────

const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const DAY_OPTIONS = DAYS.map((d) => ({
    value: d,
    label: d,
}));

const EMPTY: Omit<RoutineSlot, "periodNo" | "slotId"> = {
    subject: "",
    teacherName: "",
    room: "",
};

// ── Props ────────────────────────────────────────────────────────────────────

interface PeriodSlotDialogProps {
    loading?: boolean;
    error?: string | null;
    open: boolean;
    periods: RoutinePeriod[];
    defaultDay?: string;
    editData?: RoutineSlot;
    onClose: () => void;
    onSubmit: (
        day: string,
        dto: RoutineSlot,
    ) => Promise<void>;
}

// ── Component ────────────────────────────────────────────────────────────────

export function PeriodSlotDialog({
    loading = false,
    error = null,
    open,
    periods,
    defaultDay,
    editData,
    onClose,
    onSubmit,
}: PeriodSlotDialogProps) {
    const isEditMode = !!editData;

    // ── Period options ───────────────────────────────────────────────────────
    const periodOptions = periods
        .filter((p) => !p.isBreak)
        .map((p) => ({
            value: String(p.periodNo),

            label: `P${p.periodNo} • ${formatTo12Hour(p.startTime)} - ${formatTo12Hour(p.endTime)}`,
        }));

    // ── State ────────────────────────────────────────────────────────────────
    const [day, setDay] = useState(defaultDay ?? DAYS[0]);

    const [periodNo, setPeriodNo] = useState<number>(
        periods.find((p) => !p.isBreak)?.periodNo ?? 1,
    );

    const [form, setForm] = useState<
        Omit<RoutineSlot, "periodNo" | "slotId">
    >(EMPTY);

    const [errors, setErrors] = useState<
        Partial<
            Record<
                "day" | "periodNo" | "subject" | "teacherName",
                string
            >
        >
    >({});

    // ── Sync on open ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (!open) return;

        if (editData) {
            const {
                periodNo: selectedPeriodNo,
                slotId,
                ...rest
            } = editData;
            setPeriodNo(selectedPeriodNo);
            setForm({
                subject: rest.subject ?? "",
                teacherName: rest.teacherName ?? "",
                room: rest.room ?? "",
            });
        } else {
            setPeriodNo(
                periods.find((p) => !p.isBreak)?.periodNo ?? 1,
            );

            setForm(EMPTY);
        }
        setDay(defaultDay ?? DAYS[0]);
        setErrors({});
    }, [open, editData, defaultDay, periods]);

    // ── Handlers ─────────────────────────────────────────────────────────────
    function handleChange(
        field: keyof Omit<RoutineSlot, "periodNo" | "slotId">,
        value: string,
    ) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: undefined,
        }));
    }

    function validate(): boolean {
        const nextErrors: typeof errors = {};

        if (!day) {
            nextErrors.day = "Day is required";
        }

        if (!periodNo) {
            nextErrors.periodNo = "Period is required";
        }

        if (!form.subject.trim()) {
            nextErrors.subject = "Subject is required";
        }

        if (!form.teacherName.trim()) {
            nextErrors.teacherName = "Teacher name is required";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    }

    async function handleSubmit() {
        if (!validate()) return;

        const slot: RoutineSlot = {
            slotId: editData?.slotId ?? crypto.randomUUID(),
            periodNo,
            subject: form.subject.trim(),
            teacherName: form.teacherName.trim(),
            room: form.room?.trim() || "",
        };

        try {
            await onSubmit(day, slot);
        } catch (err) {
            console.error(err);
        }
    }

    function handleClose() {
        setForm(EMPTY);

        setErrors({});

        setDay(defaultDay ?? DAYS[0]);

        setPeriodNo(
            periods.find((p) => !p.isBreak)?.periodNo ?? 1,
        );

        onClose();
    }

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <Dialog
            open={open}
            onOpenChange={(open) => !open && handleClose()}
        >
            <DialogContent className="sm:max-w-115">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode
                            ? "Edit slot"
                            : "Add new slot"}
                    </DialogTitle>

                    <DialogDescription>
                        {isEditMode
                            ? "Update subject, teacher and room information"
                            : "Create a new routine slot"}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-2">
                    {/* Day & Period */}
                    <div className="grid grid-cols-2 gap-3">
                        <Select
                            label="Day"
                            value={day}
                            options={DAY_OPTIONS}
                            error={errors.day}
                            onChange={(e) => {
                                setDay(e.target.value);

                                setErrors((prev) => ({
                                    ...prev,
                                    day: undefined,
                                }));
                            }}
                        />

                        <Select
                            label="Period"
                            value={String(periodNo)}
                            options={periodOptions}
                            error={errors.periodNo}
                            onChange={(e) => {
                                setPeriodNo(
                                    Number(e.target.value),
                                );

                                setErrors((prev) => ({
                                    ...prev,
                                    periodNo: undefined,
                                }));
                            }}
                        />
                    </div>

                    {/* Subject */}
                    <Input
                        label="Subject"
                        value={form.subject}
                        error={errors.subject}
                        onChange={(e) =>
                            handleChange(
                                "subject",
                                e.target.value,
                            )
                        }
                        placeholder="e.g. Physics"
                    />

                    {/* Teacher */}
                    <Input
                        label="Teacher"
                        value={form.teacherName}
                        error={errors.teacherName}
                        onChange={(e) =>
                            handleChange(
                                "teacherName",
                                e.target.value,
                            )
                        }
                        placeholder="e.g. Dr. Ayesha Rahman"
                    />

                    {/* Room */}
                    <Input
                        label="Room (optional)"
                        value={form.room ?? ""}
                        onChange={(e) =>
                            handleChange(
                                "room",
                                e.target.value,
                            )
                        }
                        placeholder="e.g. Room 101"
                    />

                    {/* Error */}
                    {error && (
                        <div className="rounded-sm bg-red-50 px-3 py-2 text-[12px] text-red-600">
                            {error}
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-row justify-end gap-2">
                    <Button
                        variant="outline"
                        className="cursor-pointer rounded-sm"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="cursor-pointer rounded-sm"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading
                            ? isEditMode
                                ? "Saving..."
                                : "Adding..."
                            : isEditMode
                                ? "Save changes"
                                : "Add slot"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}