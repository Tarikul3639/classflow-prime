"use client";

import React from "react";
import { Lightbulb } from "lucide-react";

export function ProTip() {
  return (
    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 flex gap-4">
      <Lightbulb className="text-primary shrink-0" size={20} />
      <div>
        <p className="text-sm font-bold text-primary mb-1">Pro Tip</p>
        <p className="text-xs text-slate-600 leading-relaxed">
          High priority updates are pinned to the top of students' feeds and
          trigger immediate mobile notifications.
        </p>
      </div>
    </div>
  );
}