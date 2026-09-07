"use client";

import { X } from "lucide-react";

import { AdminUser } from "@/store/services/admin-users.api";
import { ImagePreview } from "@/components/ui/image-preview";

interface UserDetailsDialogProps {
  user: AdminUser | null;
  open: boolean;
  onClose: () => void;
}

export function UserDetailsDialog({
  user,
  open,
  onClose,
}: UserDetailsDialogProps) {
  if (!open || !user) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-lg rounded-lg border border-border bg-background shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold">User Details</h2>

            <p className="mt-1 text-xs text-muted-foreground">
              View account information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-md hover:bg-muted cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 p-5">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <ImagePreview
                src={user.avatarUrl}
                alt={user.name}
                className="size-14 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h3 className="font-semibold">{user.name}</h3>

              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Role</p>

              <p className="mt-1 text-sm font-medium">{user.role}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Status</p>

              <p className="mt-1 text-sm font-medium">{user.status}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Email Verification
              </p>

              <p className="mt-1 text-sm font-medium">
                {user.emailVerified ? "Verified" : "Unverified"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Joined</p>

              <p className="mt-1 text-sm font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {user.bio && (
            <div>
              <p className="text-xs text-muted-foreground">Bio</p>

              <p className="mt-1 text-sm">{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
