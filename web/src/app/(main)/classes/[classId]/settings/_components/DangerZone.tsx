"use client";

import React, { useState } from "react";
import { LogOut, Trash2, Archive, AlertTriangle } from "lucide-react";
import ConfirmDialog from "./ConfirmDialog";

interface DangerZoneProps {
  classId: string;
  className: string;
  onLeaveClass: () => void;
  onDeleteClass: () => void;
  onMarkAsEnded: () => void;
}

export default function DangerZone({
  classId,
  className,
  onLeaveClass,
  onDeleteClass,
  onMarkAsEnded,
}: DangerZoneProps) {
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEndedDialog, setShowEndedDialog] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={20} className="text-red-600" />
          <h3 className="text-base font-bold text-slate-900">Danger Zone</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Irreversible actions that will affect your class data
        </p>

        <div className="space-y-3">
          {/* Mark as Ended */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Archive size={18} className="text-amber-600 shrink-0" />
                  <h4 className="font-semibold text-slate-900 text-sm truncate">
                    Mark Semester Ended
                  </h4>
                </div>
                <p className="text-xs text-slate-600">
                  Archive this class. You can still view it but won't receive
                  updates.
                </p>
              </div>
              <button
                onClick={() => setShowEndedDialog(true)}
                className="flex items-center gap-1 px-4 py-2 rounded-sm border border-amber-500/30 bg-amber-50 text-amber-700 font-semibold text-sm hover:bg-amber-100 transition-colors duration-300 cursor-pointer shrink-0"
              >
                <span>Mark</span>
                <span className="hidden md:block">as Ended</span>
              </button>
            </div>
          </div>

          {/* Leave Class */}
          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <LogOut size={18} className="text-orange-600 shrink-0" />
                  <h4 className="font-semibold text-slate-900 text-sm truncate">
                    Leave Class
                  </h4>
                </div>
                <p className="text-xs text-slate-600">
                  Remove yourself from this class. You'll lose access
                  immediately.
                </p>
              </div>
              <button
                onClick={() => setShowLeaveDialog(true)}
                className="flex items-center gap-1 px-4 py-2 rounded-sm border border-orange-500/30 bg-orange-50 text-orange-700 font-semibold text-sm hover:bg-orange-100 transition-colors duration-300 cursor-pointer shrink-0"
              >
                <span>Leave</span>
                <span className="hidden md:block">Class</span>
              </button>
            </div>
          </div>

          {/* Delete Class */}
          <div className="border border-red-200 rounded-lg p-4 bg-red-50/30">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Trash2 size={18} className="text-red-600 shrink-0" />
                  <h4 className="font-semibold text-slate-900 text-sm truncate">
                    Delete Class
                  </h4>
                </div>
                <p className="text-xs text-slate-600">
                  Permanently delete all class data. This action cannot be
                  undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-1 px-4 py-2 rounded-sm border-2 border-red-500/30 font-semibold text-sm bg-red-500 text-white hover:bg-red-600 transition-colors duration-300 cursor-pointer shrink-0"
              >
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ConfirmDialog
        isOpen={showEndedDialog}
        onClose={() => setShowEndedDialog(false)}
        onConfirm={onMarkAsEnded}
        title="Mark Class as Ended?"
        description="This will archive the class and stop all notifications."
        confirmText="To confirm, type the class name below:"
        confirmValue={className}
        confirmButtonText="Mark as Ended"
        confirmButtonColor="amber"
        icon={
          <div className="p-2 rounded-full bg-amber-100">
            <Archive size={24} className="text-amber-600" />
          </div>
        }
      />

      <ConfirmDialog
        isOpen={showLeaveDialog}
        onClose={() => setShowLeaveDialog(false)}
        onConfirm={onLeaveClass}
        title="Leave This Class?"
        description="You will immediately lose access to all class materials and updates."
        confirmText="To confirm, type the class name below:"
        confirmValue={className}
        confirmButtonText="Leave Class"
        confirmButtonColor="orange"
        icon={
          <div className="p-2 rounded-full bg-orange-100">
            <LogOut size={24} className="text-orange-600" />
          </div>
        }
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={onDeleteClass}
        title="Delete Class Permanently?"
        description="This will permanently delete all class data. This action cannot be undone."
        confirmText="To confirm, type the class name below:"
        confirmValue={className}
        confirmButtonText="Delete Forever"
        confirmButtonColor="red"
        icon={
          <div className="p-2 rounded-full bg-red-100">
            <Trash2 size={24} className="text-red-600" />
          </div>
        }
      />
    </>
  );
}
