"use client";

import React, { useState } from "react";
import { Bell, MessageSquare, Calendar, FileText } from "lucide-react";
import { Toggle } from "@/components/ui/Toggle";

export default function NotificationSettings() {
  const [announcements, setAnnouncements] = useState(true);
  const [assignments, setAssignments] = useState(true);
  const [discussions, setDiscussions] = useState(false);
  const [scheduleUpdates, setScheduleUpdates] = useState(true);

  return (
    <div className="hidden bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-base font-bold text-slate-900 mb-4">
        Notification Preferences
      </h3>
      <p className="text-xs text-slate-500 mb-4">
        Choose which notifications you want to receive for this class
      </p>
      <div className="divide-y divide-slate-100">
        <Toggle
          icon={Bell}
          title="Announcements"
          description="Get notified about class announcements"
          enabled={announcements}
          onToggle={() => setAnnouncements(!announcements)}
        />
        <Toggle
          icon={FileText}
          title="Assignments"
          description="Reminders for upcoming assignments"
          enabled={assignments}
          onToggle={() => setAssignments(!assignments)}
        />
        <Toggle
          icon={MessageSquare}
          title="Discussions"
          description="Updates from class discussion boards"
          enabled={discussions}
          onToggle={() => setDiscussions(!discussions)}
        />
        <Toggle
          icon={Calendar}
          title="Schedule Changes"
          description="Alert me when class schedule changes"
          enabled={scheduleUpdates}
          onToggle={() => setScheduleUpdates(!scheduleUpdates)}
        />
      </div>
    </div>
  );
}
