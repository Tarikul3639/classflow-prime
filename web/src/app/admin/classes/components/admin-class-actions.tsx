"use client";

import { useState } from "react";

import {
    MoreHorizontal,
    Users,
    ShieldBan,
    ShieldCheck,
    Settings2,
    UserPlus,
    UserMinus,
} from "lucide-react";

import type { AdminClass } from "@/store/services/admin-classes.api";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { AdminClassStatusDialog } from "./dialogs/admin-class-status-dialog";
import { AdminClassBlockDialog } from "./dialogs/admin-class-block-dialog";
import { AdminClassMembersDialog } from "./dialogs/admin-class-members-dialog";
import { AdminClassEnrollmentDialog } from "./dialogs/admin-class-enrollment-dialog";

interface AdminClassActionsProps {
    classItem: AdminClass;
}

export function AdminClassActions({ classItem }: AdminClassActionsProps) {
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
    const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
    const [isMembersDialogOpen, setIsMembersDialogOpen] = useState(false);
    const [isEnrollmentDialogOpen, setIsEnrollmentDialogOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 cursor-pointer"
                    >
                        <MoreHorizontal className="size-4" />

                        <span className="sr-only">Open class actions</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52 border-border">
                    <DropdownMenuLabel>Class Actions</DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* View Members */}

                    <DropdownMenuItem className="cursor-pointer" onClick={() => setIsMembersDialogOpen(true)}>
                        <Users className="mr-2 size-4" />
                        View Members
                    </DropdownMenuItem>

                    {/* Update Status */}

                    <DropdownMenuItem className="cursor-pointer" onClick={() => setIsStatusDialogOpen(true)}>
                        <Settings2 className="mr-2 size-4" />
                        Update Status
                    </DropdownMenuItem>

                    {/* Enrollment */}
                    <DropdownMenuItem className="cursor-pointer" onClick={() => setIsEnrollmentDialogOpen(true)}>
                        {classItem.allowEnroll ? (
                            <>
                                <UserMinus className="mr-2 size-4" />
                                Close Enrollment
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 size-4" />
                                Open Enrollment
                            </>
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Block / Unblock */}
                    {classItem.isBlocked ? (
                        <DropdownMenuItem className="cursor-pointer" onClick={() => setIsBlockDialogOpen(true)}>
                            <ShieldCheck className="mr-2 size-4" />
                            Unblock Class
                        </DropdownMenuItem>
                    ) : (
                        <DropdownMenuItem
                            onClick={() => setIsBlockDialogOpen(true)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                        >
                            <ShieldBan className="mr-2 size-4" />
                            Block Class
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* STATUS DIALOG */}
            <AdminClassStatusDialog
                classItem={classItem}
                open={isStatusDialogOpen}
                onOpenChange={setIsStatusDialogOpen}
            />

            {/* BLOCK DIALOG */}
            <AdminClassBlockDialog
                classItem={classItem}
                open={isBlockDialogOpen}
                onOpenChange={setIsBlockDialogOpen}
            />

            {/* MEMBERS DIALOG */}
            <AdminClassMembersDialog
                classItem={classItem}
                open={isMembersDialogOpen}
                onOpenChange={setIsMembersDialogOpen}
            />

            {/* ENROLLMENT DIALOG */}
            <AdminClassEnrollmentDialog
                classItem={classItem}
                open={isEnrollmentDialogOpen}
                onOpenChange={setIsEnrollmentDialogOpen}
            />
        </>
    );
}
