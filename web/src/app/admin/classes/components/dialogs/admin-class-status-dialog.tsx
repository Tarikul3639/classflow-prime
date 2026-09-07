"use client";

import { useEffect, useState } from "react";

import {
    ClassStatus,
    type AdminClass,
    useUpdateAdminClassStatusMutation,
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

interface AdminClassStatusDialogProps {
    classItem: AdminClass | null;

    open: boolean;

    onOpenChange: (open: boolean) => void;
}

export function AdminClassStatusDialog({
    classItem,
    open,
    onOpenChange,
}: AdminClassStatusDialogProps) {
    const [status, setStatus] = useState<ClassStatus>(ClassStatus.ACTIVE);

    const [updateAdminClassStatus, { isLoading }] =
        useUpdateAdminClassStatusMutation();

    // Sync the status state with the classItem prop when it changes
    useEffect(() => {
        if (classItem) {
            setStatus(classItem.status);
        }
    }, [classItem]);

    const handleSubmit = async () => {
        if (!classItem) return;

        try {
            await updateAdminClassStatus({
                classId: classItem._id,
                status,
            }).unwrap();

            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update class status:", error);
        }
    };

    const handleOpenChange = (value: boolean) => {
        if (isLoading) return;

        onOpenChange(value);
    };

    if (!classItem) return null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md rounded-sm border-border">
                <DialogHeader>
                    <DialogTitle>Update Class Status</DialogTitle>

                    <DialogDescription>
                        Change the status for{" "}
                        <span className="font-medium text-foreground">
                            {classItem.className}
                        </span>
                        .
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <label
                        htmlFor="class-status"
                        className="mb-2 block text-sm font-medium"
                    >
                        Class Status
                    </label>

                    <select
                        id="class-status"
                        value={status}
                        onChange={(event) => setStatus(event.target.value as ClassStatus)}
                        disabled={isLoading}
                        className="h-10 w-full rounded-sm border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value={ClassStatus.ACTIVE}>Active</option>
                        <option value={ClassStatus.ENDED}>Ended</option>
                        <option value={ClassStatus.UPCOMING}>Upcoming</option>
                    </select>
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
                        onClick={handleSubmit}
                        disabled={isLoading || status === classItem.status}
                        className="rounded-sm cursor-pointer border-border"
                    >
                        {isLoading ? "Updating..." : "Update Status"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
