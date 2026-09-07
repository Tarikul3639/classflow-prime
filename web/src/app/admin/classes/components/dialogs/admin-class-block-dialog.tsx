"use client";

import { useState } from "react";

import { ShieldBan, ShieldCheck, Loader2 } from "lucide-react";

import type { AdminClass } from "@/store/services/admin-classes.api";

import {
    useBlockAdminClassMutation,
    useUnblockAdminClassMutation,
} from "@/store/services/admin-classes.api";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Textarea } from "@/components/ui/textarea";

interface AdminClassBlockDialogProps {
    classItem: AdminClass;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AdminClassBlockDialog({
    classItem,
    open,
    onOpenChange,
}: AdminClassBlockDialogProps) {
    const [blockedReason, setBlockedReason] = useState("");

    const [blockAdminClass, { isLoading: isBlocking }] =
        useBlockAdminClassMutation();

    const [unblockAdminClass, { isLoading: isUnblocking }] =
        useUnblockAdminClassMutation();

    const isBlocked = classItem.isBlocked;

    const isLoading = isBlocking || isUnblocking;

    const handleBlock = async () => {
        try {
            await blockAdminClass({
                classId: classItem._id,
                isBlocked: true,
                blockedReason:
                    blockedReason.trim() || "Violation of class rules",
            }).unwrap();

            onOpenChange(false);

            setBlockedReason("");
        } catch (error) {
            console.error("Failed to block class:", error);
        }
    };

    const handleUnblock = async () => {
        try {
            await unblockAdminClass({
                classId: classItem._id,
                isBlocked: false,
            }).unwrap();

            onOpenChange(false);
        } catch (error) {
            console.error("Failed to unblock class:", error);
        }
    };

    const handleSubmit = async () => {
        if (isBlocked) {
            await handleUnblock();
        } else {
            await handleBlock();
        }
    };

    const handleOpenChange = (value: boolean) => {
        if (!isLoading) {
            onOpenChange(value);

            if (!value) {
                setBlockedReason("");
            }
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="sm:max-w-md rounded-sm border-border">
                <DialogHeader>
                    <DialogTitle>
                        {isBlocked
                            ? "Unblock Class"
                            : "Block Class"}
                    </DialogTitle>

                    <DialogDescription>
                        {isBlocked
                            ? `Are you sure you want to unblock "${classItem.className}"?`
                            : `Are you sure you want to block "${classItem.className}"?`}
                    </DialogDescription>
                </DialogHeader>

                {!isBlocked && (
                    <div className="space-y-2">
                        <label
                            htmlFor="blockedReason"
                            className="text-sm font-medium"
                        >
                            Block Reason
                        </label>

                        <Textarea
                            id="blockedReason"
                            value={blockedReason}
                            onChange={(event) =>
                                setBlockedReason(event.target.value)
                            }
                            placeholder="Enter the reason for blocking this class..."
                            disabled={isLoading}
                            className="min-h-24 rounded-sm resize-none"
                        />

                        <p className="text-xs text-muted-foreground">
                            If no reason is provided, a default reason
                            will be used.
                        </p>
                    </div>
                )}

                {isBlocked && (
                    <div className="rounded-sm border border-border bg-muted/30 p-3">
                        <p className="text-sm text-muted-foreground">
                            Unblocking this class will restore its normal
                            access.
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="rounded-sm border-border cursor-pointer"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        variant={
                            isBlocked
                                ? "default"
                                : "destructive"
                        }
                        className="gap-2 rounded-sm border-border cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />

                                {isBlocked
                                    ? "Unblocking..."
                                    : "Blocking..."}
                            </>
                        ) : isBlocked ? (
                            <>
                                <ShieldCheck className="size-4" />
                                Unblock Class
                            </>
                        ) : (
                            <>
                                <ShieldBan className="size-4" />
                                Block Class
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}