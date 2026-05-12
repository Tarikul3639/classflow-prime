"use client";

import { useState } from "react";
import {
    Plus,
    Trash2,
    ArrowRight,
    X,
    GripVertical,
    LoaderCircle,
} from "lucide-react";
import type { RoutinePeriod } from "@/types/routine.types";

// ── Types ───────────────────────────────────────────────

interface CreateRoutineDialogProps {
    loading: boolean;
    error: string | null;
    open: boolean;
    onClose: () => void;
    onConfirm: (data: Omit<RoutinePeriod, "periodId">[]) => void;
}

// ── Utils ───────────────────────────────────────────────

function addMinutes({ time, mins }: { time: string; mins: number }) {
    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m + mins;

    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
        total % 60,
    ).padStart(2, "0")}`;
}

const newPeriod = (no: number, prevEnd = "08:00"): RoutinePeriod => ({
    periodId: crypto.randomUUID(),
    periodNo: no,
    label: `${no}th Period`,
    startTime: prevEnd,
    endTime: addMinutes({ time: prevEnd, mins: 45 }),
    isBreak: false,
});

// ── Dialog ───────────────────────────────────────────────

export function CreateRoutineDialog({
    loading,
    error,
    open,
    onClose,
    onConfirm,
}: CreateRoutineDialogProps) {
    const [periods, setPeriods] = useState<RoutinePeriod[]>([
        newPeriod(1, "08:00"),
    ]);

    if (!open) return null;

    // ── Period handlers ─────────────────────────────────────

    function addPeriod() {
        const last = periods[periods.length - 1];

        setPeriods((p) => [
            ...p,
            newPeriod(p.length + 1, last.endTime),
        ]);
    }

    function removePeriod(id: string) {
        setPeriods((p) =>
            p
                .filter((x) => x.periodId !== id)
                .map((x, i) => ({
                    ...x,
                    periodNo: i + 1,
                })),
        );
    }

    function updatePeriod(
        periodId: string,
        field: keyof RoutinePeriod,
        value: string | boolean,
    ) {
        setPeriods((prev) =>
            prev.map((p) =>
                p.periodId === periodId
                    ? { ...p, [field]: value }
                    : p,
            ),
        );
    }

    // ── Submit ──────────────────────────────────────────────

    function handleSubmit() {
        onConfirm(
            periods.map(({ periodId, ...rest }) => rest),
        );
    }

    return (
        <div className="fixed inset-0 z-500 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#ECEAF8]">
                    <div>
                        <h2 className="text-[15px] font-bold text-gray-800">
                            Create Routine
                        </h2>

                        <p className="text-[12px] text-gray-400 mt-0.5">
                            Define the period structure for this class
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-sm flex items-center justify-center hover:bg-red-100 text-gray-400 hover:text-red-600 cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="px-6 py-4 max-h-[75vh] overflow-y-auto space-y-5">
                    {/* ── Period List ───────────────────────────────────── */}
                    <div className="space-y-2">
                        <p className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">
                            Periods
                        </p>

                        {periods.map((p) => (
                            <div
                                key={p.periodId}
                                className="flex flex-col gap-3 bg-[#F5F4FE] rounded-xl px-3 py-3 group"
                            >
                                <div className="flex items-center gap-3">
                                    <GripVertical
                                        size={14}
                                        className="text-gray-300"
                                    />

                                    <span className="text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md w-7 text-center">
                                        P{p.periodNo}
                                    </span>

                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={p.label}
                                            onChange={(e) =>
                                                updatePeriod(
                                                    p.periodId,
                                                    "label",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Period label"
                                            className="w-full text-[12px] font-medium text-gray-700 bg-transparent border-none outline-none placeholder:text-gray-400"
                                        />
                                    </div>

                                    {periods.length > 1 && (
                                        <button
                                            onClick={() =>
                                                removePeriod(p.periodId)
                                            }
                                            className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 pl-10">
                                    <div className="flex items-center gap-1.5 flex-1">
                                        <input
                                            type="time"
                                            value={p.startTime}
                                            onChange={(e) =>
                                                updatePeriod(
                                                    p.periodId,
                                                    "startTime",
                                                    e.target.value,
                                                )
                                            }
                                            className="text-[12px] font-medium text-gray-700 bg-transparent border-none outline-none"
                                        />
                                    </div>

                                    <ArrowRight
                                        size={16}
                                        className="text-gray-300"
                                    />

                                    <div className="flex items-center gap-1.5 flex-1">
                                        <input
                                            type="time"
                                            value={p.endTime}
                                            onChange={(e) =>
                                                updatePeriod(
                                                    p.periodId,
                                                    "endTime",
                                                    e.target.value,
                                                )
                                            }
                                            className="text-[12px] font-medium text-gray-700 bg-transparent border-none outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="pl-10 flex items-center gap-2">
                                    <input
                                        id={`break-${p.periodId}`}
                                        type="checkbox"
                                        checked={!!p.isBreak}
                                        onChange={(e) =>
                                            updatePeriod(
                                                p.periodId,
                                                "isBreak",
                                                e.target.checked,
                                            )
                                        }
                                        className="h-4 w-4 rounded border-gray-300"
                                    />

                                    <label
                                        htmlFor={`break-${p.periodId}`}
                                        className="text-[12px] text-gray-600 cursor-pointer select-none"
                                    >
                                        Mark as break period
                                    </label>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addPeriod}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-sm border-2 border-dashed border-[#DDDAF6] text-primary text-[12px] font-semibold hover:border-primary hover:bg-primary/5 cursor-pointer"
                        >
                            <Plus size={13} />
                            Add Period
                        </button>

                        {error && !loading && (
                            <div className="px-3 py-2 rounded-sm bg-red-50 text-red-600 text-[12px]">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#ECEAF8] bg-[#FAFAFE]">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-sm text-[13px] font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 border border-gray-200"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="px-5 py-2 rounded-sm bg-primary text-white text-[13px] font-semibold hover:bg-primary/90 cursor-pointer"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <LoaderCircle
                                    className="animate-spin"
                                    size={16}
                                />
                                Creating...
                            </span>
                        ) : (
                            "Create Routine"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}