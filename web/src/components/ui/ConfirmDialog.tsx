"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────

type ConfirmVariant = "delete" | "warning";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    variant?: ConfirmVariant;
    title?: string;
    description?: string;
    confirmWord?: string;      // type ]to confirm word — default "DELETE"
    confirmLabel?: string;     // button label — default "Delete"
    loading?: boolean;
}

// ── Variant config ────────────────────────────────────────────────────────

const VARIANT_CONFIG = {
    delete: {
        Icon: Trash2,
        iconBg: "bg-destructive/10",
        iconColor: "text-destructive",
        inputFocus: "focus:border-destructive focus:ring-destructive/15",
        confirmBtn: "bg-destructive hover:bg-destructive/90 text-white disabled:opacity-40",
    },
    warning: {
        Icon: AlertTriangle,
        iconBg: "bg-amber-500/10",
        iconColor: "text-amber-500",
        inputFocus: "focus:border-amber-500 focus:ring-amber-500/15",
        confirmBtn: "bg-amber-500 hover:bg-amber-500/90 text-white disabled:opacity-40",
    },
} as const;

// ── Component ─────────────────────────────────────────────────────────────

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    variant = "delete",
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmWord = "DELETE",
    confirmLabel = "Delete",
    loading = false,
}: ConfirmDialogProps) {
    const [mounted, setMounted] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const config = VARIANT_CONFIG[variant];
    const isConfirmed = inputValue === confirmWord;

    useEffect(() => { setMounted(true); }, []);

    // scroll lock
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    // input reset + autofocus
    useEffect(() => {
        if (open) {
            setInputValue("");
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    // esc to close
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open, onClose]);

    if (!open || !mounted) return null;

    function handleConfirm() {
        if (!isConfirmed || loading) return;
        onConfirm();
    }

    return createPortal(
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm px-5"
            onClick={onClose}
            onPointerDown={(e) => e.stopPropagation()}
        >
            <div
                className="bg-background border border-border rounded-2xl p-5 w-full max-w-md shadow-2xl flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shrink-0", config.iconBg)}>
                    <config.Icon size={20} className={config.iconColor} strokeWidth={2.2} />
                </div>

                {/* Text */}
                <div className="-mt-1">
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
                </div>

                {/* Confirm input */}
                <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-muted-foreground pb-1">
                        Type{" "}
                        <code className="text-foreground font-semibold bg-muted px-1.5 py-0.5 rounded-md text-[11px]">
                            {confirmWord}
                        </code>{" "}
                        to confirm
                    </p>
                    <input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                        placeholder={`Type ${confirmWord} here...`}
                        autoComplete="off"
                        className={cn(
                            "w-full px-3 py-2.5 rounded-sm border border-border bg-muted/40 text-sm font-mono text-foreground placeholder:text-muted-foreground/80 outline-none transition-all duration-300 ring-0",
                            "focus:ring-3 placeholder:text-[13px]",
                            config.inputFocus,
                        )}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-sm border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!isConfirmed || loading}
                        className={cn(
                            "flex-1 py-2.5 rounded-sm text-xs font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed",
                            config.confirmBtn,
                        )}
                    >
                        {loading ? "Deleting..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}