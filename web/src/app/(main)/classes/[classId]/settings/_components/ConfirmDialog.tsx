"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  confirmValue: string;
  confirmButtonText?: string;
  confirmButtonColor?: "red" | "orange" | "amber";
  icon?: React.ReactNode;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  confirmValue,
  confirmButtonText = "Confirm",
  confirmButtonColor = "red",
  icon,
}: ConfirmDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(inputValue === confirmValue);
  }, [inputValue, confirmValue]);

  useEffect(() => {
    if (!isOpen) {
      setInputValue("");
      setIsValid(false);
    }
  }, [isOpen]);

  // Disable body scroll when dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleConfirm = () => {
    if (isValid) {
      onConfirm();
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid) {
      handleConfirm();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  const colorClasses = {
    red: {
      button: "bg-red-600 hover:bg-red-700",
      border: "border-red-600 hover:border-red-700",
    },
    orange: {
      button: "bg-orange-600 hover:bg-orange-700",
      border: "border-orange-600 hover:border-orange-700",
    },
    amber: {
      button: "bg-amber-600 hover:bg-amber-700",
      border: "border-amber-600 hover:border-amber-700",
    },
  };

  const colors = colorClasses[confirmButtonColor];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-lg w-full animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-4 border-b border-slate-200">
          {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-1.5 -mt-1 -mr-1 rounded-md hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            {description}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-4">
            <p className="text-xs text-slate-600 mb-2">{confirmText}</p>
            <code className="block text-sm font-mono font-semibold text-slate-900 bg-white px-3 py-2 rounded border border-slate-300">
              {confirmValue}
            </code>
          </div>

          {/* Input */}
          <Input
            label="Type the confirmation text"
            placeholder="Type here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              isValid ? colors.button : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
