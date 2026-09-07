"use client";

import { useEffect, useState } from "react";
import { GraduationCap, UserRound, Loader2 } from "lucide-react";

import type {
    AdminClass,
    AdminClassMember,
} from "@/store/services/admin-classes.api";
import {
    EnrollmentRole,
    useUpdateAdminClassMemberRoleMutation,
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

interface AdminClassMemberRoleDialogProps {
    classItem: AdminClass;
    member: AdminClassMember | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AdminClassMemberRoleDialog({
    classItem,
    member,
    open,
    onOpenChange,
}: AdminClassMemberRoleDialogProps) {
    const [selectedRole, setSelectedRole] = useState<EnrollmentRole | null>(null);

    const [updateAdminClassMemberRole, { isLoading }] =
        useUpdateAdminClassMemberRoleMutation();

    useEffect(() => {
        if (member) {
            setSelectedRole(member.role);
        }
    }, [member]);

    const handleUpdateRole = async () => {
        if (!member || !selectedRole) {
            return;
        }

        try {
            await updateAdminClassMemberRole({
                classId: classItem._id,
                memberId: member.enrollmentId,
                role: selectedRole,
            }).unwrap();

            onOpenChange(false);
        } catch (error) {
            console.error("Failed to update member role:", error);
        }
    };

    const handleOpenChange = (value: boolean) => {
        if (!isLoading) {
            onOpenChange(value);
        }
    };

    if (!member) {
        return null;
    }

    const hasRoleChanged = selectedRole !== member.role;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md rounded-sm border-border">
                <DialogHeader>
                    <DialogTitle>Update Member Role</DialogTitle>
                    <DialogDescription>
                        Change the role of{" "}
                        <span className="font-medium text-foreground">{member.name}</span> in{" "}
                        <span className="font-medium text-foreground">
                            {classItem.className}
                        </span>
                        .
                    </DialogDescription>
                </DialogHeader>

                {/* Member Information */}
                <div className="rounded-sm border border-border p-3">
                    <div className="flex flex-col gap-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-3">
                    <p className="text-sm font-medium">Select Role</p>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Teacher */}
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setSelectedRole(EnrollmentRole.INSTRUCTOR)}
                            className={`flex flex-col items-center gap-2 rounded-sm border p-4 transition-colors cursor-pointer border-border ${selectedRole === EnrollmentRole.INSTRUCTOR
                                    ? "border-primary bg-primary/5"
                                    : "hover:bg-muted"
                                }`}
                        >
                            <GraduationCap className="size-6" />
                            <span className="text-sm font-medium">Teacher</span>
                        </button>

                        {/* Learner */}
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setSelectedRole(EnrollmentRole.LEARNER)}
                            className={`flex flex-col items-center gap-2 rounded-sm border p-4 transition-colors cursor-pointer border-border ${selectedRole === EnrollmentRole.LEARNER
                                    ? "border-primary bg-primary/5"
                                    : "hover:bg-muted"
                                }`}
                        >
                            <UserRound className="size-6" />
                            <span className="text-sm font-medium">Learner</span>
                        </button>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={() => onOpenChange(false)}
                        className="rounded-sm cursor-pointer border-border"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        disabled={isLoading || !selectedRole || !hasRoleChanged}
                        onClick={handleUpdateRole}
                        className="gap-2 rounded-sm cursor-pointer border-border"
                    >
                        {isLoading && <Loader2 className="size-4 animate-spin" />}
                        {isLoading ? "Updating..." : "Update Role"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}