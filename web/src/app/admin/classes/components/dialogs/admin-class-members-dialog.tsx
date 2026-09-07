"use client";

import { useState } from "react";
import {
    Users,
    Mail,
    ShieldCheck,
    GraduationCap,
    UserRound,
    Loader2,
    Pencil,
} from "lucide-react";

import type {
    AdminClass,
    AdminClassMember,
} from "@/store/services/admin-classes.api";
import {
    EnrollmentRole,
    useGetAdminClassMembersQuery,
} from "@/store/services/admin-classes.api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { AdminClassMemberRoleDialog } from "./admin-class-member-role-dialog";

interface AdminClassMembersDialogProps {
    classItem: AdminClass;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((item) => item.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getRoleLabel(role: EnrollmentRole) {
    switch (role) {
        case EnrollmentRole.INSTRUCTOR:
            return "Instructor";
        case EnrollmentRole.LEARNER:
            return "Learner";
        default:
            return role;
    }
}

interface MemberRowProps {
    member: AdminClassMember;
    onUpdateRole: (member: AdminClassMember) => void;
}

function MemberRow({ member, onUpdateRole }: MemberRowProps) {
    const isTeacher = member.role === EnrollmentRole.INSTRUCTOR;

    return (
        <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
            {/* Member Information */}
            <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-10 rounded-sm">
                    <AvatarImage src={member.avatarUrl || undefined} alt={member.name} />
                    <AvatarFallback className="rounded-sm">
                        {getInitials(member.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{member.name}</p>

                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="size-3" />
                        <span className="truncate">{member.email}</span>
                    </div>
                </div>
            </div>

            {/* Role & Actions */}
            <div className="flex shrink-0 items-center gap-3">
                <div className="flex flex-col items-end gap-1">
                    <span
                        className={`inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-xs font-medium ${isTeacher
                                ? "border-blue-500/20 bg-blue-500/10 text-blue-600"
                                : "border-border bg-muted text-muted-foreground"
                            }`}
                    >
                        {isTeacher ? (
                            <GraduationCap className="size-3" />
                        ) : (
                            <UserRound className="size-3" />
                        )}
                        {getRoleLabel(member.role)}
                    </span>

                    {member.emailVerified && (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                            <ShieldCheck className="size-3" />
                            Verified
                        </span>
                    )}
                </div>

                {/* Update Role */}
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-8 rounded-sm border-border cursor-pointer"
                    onClick={() => onUpdateRole(member)}
                >
                    <Pencil className="size-3.5" />
                    <span className="sr-only">Update member role</span>
                </Button>
            </div>
        </div>
    );
}

export function AdminClassMembersDialog({
    classItem,
    open,
    onOpenChange,
}: AdminClassMembersDialogProps) {
    const [selectedMember, setSelectedMember] = useState<AdminClassMember | null>(null);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

    const { data, isLoading, isError } = useGetAdminClassMembersQuery(
        classItem._id,
        {
            skip: !open,
        },
    );

    const members = data?.members ?? [];

    const handleUpdateRole = (member: AdminClassMember) => {
        setSelectedMember(member);
        setIsRoleDialogOpen(true);
    };

    const handleRoleDialogChange = (value: boolean) => {
        setIsRoleDialogOpen(value);
        if (!value) {
            setSelectedMember(null);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden rounded-sm border-border">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Users className="size-5" />
                            Class Members
                        </DialogTitle>

                        <DialogDescription>
                            Members enrolled in{" "}
                            <span className="font-medium text-foreground">
                                {classItem.className}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    {/* Class Summary */}
                    <div className="grid grid-cols-3 gap-3 border-y border-border py-4">
                        <div>
                            <p className="text-xs text-muted-foreground">Total Members</p>
                            <p className="mt-1 text-lg font-semibold">
                                {classItem.totalMembers}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">Teachers</p>
                            <p className="mt-1 text-lg font-semibold">
                                {classItem.totalTeachers}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">Learners</p>
                            <p className="mt-1 text-lg font-semibold">
                                {classItem.totalLearners}
                            </p>
                        </div>
                    </div>

                    {/* Members */}
                    <div className="max-h-112.5 overflow-y-auto">
                        {isLoading && (
                            <div className="flex min-h-48 items-center justify-center">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="size-4 animate-spin" />
                                    Loading members...
                                </div>
                            </div>
                        )}

                        {isError && !isLoading && (
                            <div className="flex min-h-48 items-center justify-center">
                                <p className="text-sm text-destructive">
                                    Failed to load class members.
                                </p>
                            </div>
                        )}

                        {!isLoading && !isError && members.length === 0 && (
                            <EmptyState
                                icon={Users}
                                title="No members found"
                                description="There are no members enrolled in this class."
                            />
                        )}

                        {!isLoading && !isError && members.length > 0 && (
                            <div>
                                {members.map((member) => (
                                    <MemberRow
                                        key={member.enrollmentId}
                                        member={member}
                                        onUpdateRole={handleUpdateRole}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Update Member Role Dialog */}
            {selectedMember && (
                <AdminClassMemberRoleDialog
                    classItem={classItem}
                    member={selectedMember}
                    open={isRoleDialogOpen}
                    onOpenChange={handleRoleDialogChange}
                />
            )}
        </>
    );
}