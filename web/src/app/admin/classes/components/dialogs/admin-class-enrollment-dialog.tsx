"use client";

import { Loader2, UserPlus, UserMinus } from "lucide-react";

import type { AdminClass } from "@/store/services/admin-classes.api";

import { useUpdateAdminClassEnrollmentMutation } from "@/store/services/admin-classes.api";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AdminClassEnrollmentDialogProps {
    classItem: AdminClass;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AdminClassEnrollmentDialog({
    classItem,
    open,
    onOpenChange,
}: AdminClassEnrollmentDialogProps) {
    const [updateAdminClassEnrollment, { isLoading }] =
        useUpdateAdminClassEnrollmentMutation();

    const isEnrollmentOpen = classItem.allowEnroll;

    const handleUpdateEnrollment = async () => {
        try {
            await updateAdminClassEnrollment({
                classId: classItem._id,

                // If currently open → close
                // If currently closed → open
                allowEnroll: !isEnrollmentOpen,
            }).unwrap();

            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update class enrollment:", error);
        }
    };

    const handleOpenChange = (value: boolean) => {
        if (!isLoading) {
            onOpenChange(value);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md rounded-sm border-border">
                <DialogHeader>
                    <DialogTitle>
                        {isEnrollmentOpen ? "Close Enrollment" : "Open Enrollment"}
                    </DialogTitle>

                    <DialogDescription>
                        {isEnrollmentOpen
                            ? `Are you sure you want to close enrollment for "${classItem.className}"?`
                            : `Are you sure you want to open enrollment for "${classItem.className}"?`}
                    </DialogDescription>
                </DialogHeader>

                {/* Information Box */}

                <div className="rounded-sm border border-border bg-muted/30 p-3">
                    <p className="text-sm text-muted-foreground">
                        {isEnrollmentOpen
                            ? "New users will no longer be able to join this class."
                            : "New users will be able to join this class using the enrollment code."}
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="rounded-sm cursor-pointer border-border"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleUpdateEnrollment}
                        disabled={isLoading}
                        className="gap-2 rounded-sm cursor-pointer border-border"
                        variant={isEnrollmentOpen ? "destructive" : "default"}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Updating...
                            </>
                        ) : isEnrollmentOpen ? (
                            <>
                                <UserMinus className="size-4" />
                                Close Enrollment
                            </>
                        ) : (
                            <>
                                <UserPlus className="size-4" />
                                Open Enrollment
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
