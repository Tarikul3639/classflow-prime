"use client";

import React from "react";
import { LucideIcon, BellOff } from "lucide-react";

type EmptyStateSize = "sm" | "md" | "lg";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  size?: EmptyStateSize;
  className?: string;

  // Optional button
  actionLabel?: string;
  onAction?: () => void;
}

const sizeConfig = {
  sm: {
    container: "min-h-[120px]",
    iconWrap: "w-10 h-10 mb-3",
    icon: 18,
    title: "text-sm",
    desc: "text-xs max-w-[200px]",
    button: "mt-3 text-xs px-3 py-1.5",
  },
  md: {
    container: "min-h-[200px]",
    iconWrap: "w-14 h-14 mb-4",
    icon: 22,
    title: "text-[15px]",
    desc: "text-[13px] max-w-[240px]",
    button: "mt-4 text-xs px-4 py-2",
  },
  lg: {
    container: "min-h-[60vh]",
    iconWrap: "w-16 h-16 mb-5",
    icon: 26,
    title: "text-base",
    desc: "text-sm max-w-[280px]",
    button: "mt-5 text-sm px-5 py-2.5",
  },
};

export const EmptyState = ({
  icon: Icon = BellOff,
  title = "No Data Available",
  description = "There is currently no data to display.",
  size = "md",
  className = "",
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  const styles = sizeConfig[size];

  const showButton = actionLabel && onAction;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${styles.container} ${className}`}
    >
      {/* Icon */}
      <div
        className={`rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center ${styles.iconWrap}`}
      >
        <Icon className="text-slate-400" size={styles.icon} />
      </div>

      {/* Title */}
      <p className={`font-semibold text-slate-900 mb-1 ${styles.title}`}>
        {title}
      </p>

      {/* Description */}
      <p className={`text-slate-400 leading-relaxed ${styles.desc}`}>
        {description}
      </p>

      {/* 🔥 Optional Button */}
      {showButton && (
        <button
          onClick={onAction}
          className={`rounded-md bg-[#399aef] text-white font-medium hover:bg-[#2d82cc] transition-all cursor-pointer ${styles.button}`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};