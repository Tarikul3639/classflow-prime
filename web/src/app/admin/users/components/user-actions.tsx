"use client";

import { useState } from "react";

import {
    Eye,
    MoreHorizontal,
    ShieldCheck,
    ShieldAlert,
    Ban,
    Loader2,
    UserCheck,
    UserCog,
    MailCheck,
    Mail,
    KeyRound,
} from "lucide-react";

import { toast } from "sonner";

import type { AdminUser } from "@/store/services/admin-users.api";

import {
    UserRole,
    UserStatus,
    useUpdateAdminUserStatusMutation,
    useUpdateAdminUserRoleMutation,
    useVerifyAdminUserEmailMutation,
    useSendVerificationEmailMutation,
    useSendPasswordResetEmailMutation,
} from "@/store/services/admin-users.api";

import { useAppSelector } from "@/store/hooks";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserActionsProps {
    user: AdminUser;
    onView: (user: AdminUser) => void;
}

export function UserActions({ user, onView }: UserActionsProps) {
    const [open, setOpen] = useState(false);

    const currentUser = useAppSelector(
        (state) => state.profile.fetchUser.user,
    );

    // =========================
    // Role Permissions
    // =========================

    const isSuperAdmin = currentUser?.role === UserRole.SUPER_ADMIN;
    const isAdmin = currentUser?.role === UserRole.ADMIN;
    const canManageUsers = isSuperAdmin || isAdmin;

    // =========================
    // Mutations
    // =========================

    const [updateUserStatus, { isLoading: isUpdatingStatus }] =
        useUpdateAdminUserStatusMutation();

    const [updateUserRole, { isLoading: isUpdatingRole }] =
        useUpdateAdminUserRoleMutation();

    const [verifyEmail, { isLoading: isVerifyingEmail }] =
        useVerifyAdminUserEmailMutation();

    const [sendVerificationEmail, { isLoading: isSendingEmail }] =
        useSendVerificationEmailMutation();

    const [sendPasswordResetEmail, { isLoading: isSendingPasswordReset }] =
        useSendPasswordResetEmailMutation();

    const isPending =
        isUpdatingStatus ||
        isUpdatingRole ||
        isVerifyingEmail ||
        isSendingEmail ||
        isSendingPasswordReset;

    // =========================
    // Status Update
    // =========================

    const handleStatusUpdate = async (status: UserStatus) => {
        try {
            await updateUserStatus({
                userId: user.id,
                status,
            }).unwrap();

            toast.success(`User status updated to ${status.toLowerCase()}`);
            setOpen(false);
        } catch (error) {
            console.error("Failed to update user status:", error);
            toast.error("Failed to update user status");
        }
    };

    // =========================
    // Role Update
    // =========================

    const handleRoleUpdate = async (role: UserRole) => {
        try {
            await updateUserRole({
                userId: user.id,
                role,
            }).unwrap();

            toast.success(`User role updated to ${role.toLowerCase()}`);
            setOpen(false);
        } catch (error) {
            console.error("Failed to update user role:", error);
            toast.error("Failed to update user role");
        }
    };

    // =========================
    // Email Verification
    // =========================

    const handleVerifyEmail = async () => {
        try {
            await verifyEmail(user.id).unwrap();

            toast.success("User email verified successfully");
            setOpen(false);
        } catch (error) {
            console.error("Failed to verify email:", error);
            toast.error("Failed to verify user email");
        }
    };

    // =========================
    // Send Verification Email
    // =========================

    const handleSendVerificationEmail = async () => {
        try {
            await sendVerificationEmail(user.id).unwrap();

            toast.success("Verification email sent");
            setOpen(false);
        } catch (error) {
            console.error("Failed to send verification email:", error);
            toast.error("Failed to send verification email");
        }
    };

    // =========================
    // Password Reset
    // =========================

    const handleSendPasswordReset = async () => {
        try {
            await sendPasswordResetEmail(user.id).unwrap();

            toast.success("Password reset email sent successfully");
            setOpen(false);
        } catch (error) {
            console.error("Failed to send password reset email:", error);
            toast.error("Failed to send password reset email");
        }
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    disabled={isPending}
                    className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="User actions"
                >
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <MoreHorizontal className="size-4" />
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-52 border border-border bg-card p-1"
            >
                {/* View Details */}
                <DropdownMenuLabel>User Actions</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                        onView(user);
                        setOpen(false);
                    }}
                >
                    <Eye className="mr-2 size-4" />
                    View Details
                </DropdownMenuItem>

                {/* ADMIN + SUPER ADMIN */}
                {canManageUsers && (
                    <>
                        {/* Account Status */}
                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>Account Status</DropdownMenuLabel>

                        {user.status !== UserStatus.ACTIVE && (
                            <DropdownMenuItem
                                disabled={isPending}
                                className="cursor-pointer"
                                onClick={() =>
                                    handleStatusUpdate(UserStatus.ACTIVE)
                                }
                            >
                                <ShieldCheck className="mr-2 size-4" />
                                Set Active
                            </DropdownMenuItem>
                        )}

                        {user.status !== UserStatus.SUSPENDED && (
                            <DropdownMenuItem
                                disabled={isPending}
                                className="cursor-pointer"
                                onClick={() =>
                                    handleStatusUpdate(UserStatus.SUSPENDED)
                                }
                            >
                                <ShieldAlert className="mr-2 size-4" />
                                Suspend User
                            </DropdownMenuItem>
                        )}

                        {user.status !== UserStatus.BANNED && (
                            <DropdownMenuItem
                                disabled={isPending}
                                onClick={() =>
                                    handleStatusUpdate(UserStatus.BANNED)
                                }
                                className="cursor-pointer text-destructive focus:text-destructive"
                            >
                                <Ban className="mr-2 size-4" />
                                Ban User
                            </DropdownMenuItem>
                        )}

                        {/* Security & Password */}
                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>Security</DropdownMenuLabel>

                        <DropdownMenuItem
                            disabled={isPending}
                            className="cursor-pointer"
                            onClick={handleSendPasswordReset}
                        >
                            <KeyRound className="mr-2 size-4" />
                            Forgot Password
                        </DropdownMenuItem>

                        {/* Email Verification */}
                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>
                            Email Verification
                        </DropdownMenuLabel>

                        {user.emailVerified ? (
                            <DropdownMenuItem disabled>
                                <MailCheck className="mr-2 size-4 text-emerald-500" />
                                Email Verified
                            </DropdownMenuItem>
                        ) : (
                            <>
                                <DropdownMenuItem
                                    disabled={isPending}
                                    className="cursor-pointer"
                                    onClick={handleVerifyEmail}
                                >
                                    <UserCheck className="mr-2 size-4" />
                                    Verify Email
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    disabled={isPending}
                                    className="cursor-pointer"
                                    onClick={handleSendVerificationEmail}
                                >
                                    <Mail className="mr-2 size-4" />
                                    Send Verification
                                </DropdownMenuItem>
                            </>
                        )}
                    </>
                )}

                {/* SUPER ADMIN ONLY */}
                {isSuperAdmin && (
                    <>
                        <DropdownMenuSeparator />

                        <DropdownMenuLabel>
                            Role Management
                        </DropdownMenuLabel>

                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger disabled={isPending}>
                                <UserCog className="mr-2 size-4" />
                                Change Role
                            </DropdownMenuSubTrigger>

                            <DropdownMenuSubContent className="w-44 border border-border bg-card p-1">
                                {user.role !== UserRole.USER && (
                                    <DropdownMenuItem
                                        disabled={isPending}
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleRoleUpdate(UserRole.USER)
                                        }
                                    >
                                        <UserCheck className="mr-2 size-4" />
                                        User
                                    </DropdownMenuItem>
                                )}

                                {user.role !== UserRole.ADMIN && (
                                    <DropdownMenuItem
                                        disabled={isPending}
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleRoleUpdate(UserRole.ADMIN)
                                        }
                                    >
                                        <ShieldCheck className="mr-2 size-4" />
                                        Admin
                                    </DropdownMenuItem>
                                )}

                                {user.role !== UserRole.SUPER_ADMIN && (
                                    <DropdownMenuItem
                                        disabled={isPending}
                                        className="cursor-pointer text-destructive focus:text-destructive"
                                        onClick={() =>
                                            handleRoleUpdate(
                                                UserRole.SUPER_ADMIN,
                                            )
                                        }
                                    >
                                        <ShieldAlert className="mr-2 size-4" />
                                        Super Admin
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}