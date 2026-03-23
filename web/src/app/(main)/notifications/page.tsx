"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  ClipboardCheck,
  FileText,
  UserPlus,
  Calendar,
  MessageSquare,
  Award,
  Search,
  Bell,
  BookOpen,
} from "lucide-react";

// Types
interface Notification {
  id: string;
  type: "exam" | "update" | "member" | "schedule" | "message" | "grade";
  title: string;
  description: string;
  timestamp: string;
  date: string;
  isRead: boolean;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  avatar?: string;
}

interface Filter {
  id: string;
  label: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "exam",
      title: "Exam Reminder: Advanced Calculus",
      description:
        "Room 402 • 10:00 AM. Don't forget to bring your scientific calculator and student ID.",
      timestamp: "2 hours ago",
      date: "today",
      isRead: false,
      icon: ClipboardCheck,
      iconBg: "bg-blue-100",
      iconColor: "text-primary",
    },
    {
      id: "2",
      type: "update",
      title: "Course Update: Physics 101",
      description:
        "Dr. Smith uploaded new lecture notes for Week 8: Quantum Mechanics Intro.",
      timestamp: "5 hours ago",
      date: "today",
      isRead: false,
      icon: FileText,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      id: "3",
      type: "member",
      title: "New Study Group Request",
      description: 'Sarah Jenkins wants to enroll your "Final Prep" study group.',
      timestamp: "8 hours ago",
      date: "today",
      isRead: true,
      icon: UserPlus,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      id: "4",
      type: "schedule",
      title: "Schedule Changed",
      description:
        'The workshop for "Digital Arts" has been moved to Friday at 2:00 PM.',
      timestamp: "Yesterday, 4:30 PM",
      date: "yesterday",
      isRead: true,
      icon: Calendar,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
    },
    {
      id: "5",
      type: "message",
      title: "Message from Prof. Alistair",
      description:
        '"Please review the feedback I\'ve left on your thesis proposal draft."',
      timestamp: "Yesterday, 11:15 AM",
      date: "yesterday",
      isRead: true,
      icon: MessageSquare,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB-mXxei8fNIE27SSJUhRoahYOWwn-VFfRaVlqfubJyUqJFXPuE1ikEJpXqbINkzXqZMYiCcokRqpNjL3SKqoQQAjlVkwZqRlE9ZlA6ulunMtHETI5vKUfn5ghcTi5gM9C6IL6GRZ9qFTsJrVj0iTVXKszNQhuhaFlMnVGjLA3PTFN-r4pJ4ZxtwW0N8d1lXsGNuyTgPItWCruz0vOF3FtppGID3JPmplXVa5Hm1uF7L0SICpS_1u9SsmFP_MrLMpCFpLsWWV2f61JA",
    },
    {
      id: "6",
      type: "grade",
      title: "Grades Published",
      description:
        'Grades for "Linear Algebra - Midterm" are now available in the portal.',
      timestamp: "Yesterday, 09:00 AM",
      date: "yesterday",
      isRead: true,
      icon: Award,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
    },
  ]);

  const [activeFilter, setActiveFilter] = useState("all");

  // Demo Data - Easy to replace with API
  const filters: Filter[] = [
    { id: "all", label: "All" },
    { id: "exams", label: "Exams" },
    { id: "tests", label: "Class Tests" },
    { id: "vivas", label: "Vivas" },
    { id: "assignments", label: "Assignments" },
  ];

  // Group notifications by date
  const groupedNotifications = notifications.reduce(
    (acc, notification) => {
      const dateKey = notification.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(notification);
      return acc;
    },
    {} as Record<string, Notification[]>,
  );

  const dateLabels: Record<string, string> = {
    today: "Today",
    yesterday: "Yesterday",
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, isRead: true })),
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
        <div className="px-4 lg:px-8 pt-4 pb-4">
          <div className="flex items-center gap-3 mx-auto">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              <Bell className="size-5.5" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate">
                Notifications
              </h1>
              <p className="text-slate-500 text-xs truncate">
                You have {notifications.filter((n) => !n.isRead).length} new
                notifications
              </p>
            </div>
            <button
              onClick={markAllAsRead}
              className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors whitespace-nowrap cursor-pointer"
            >
              Mark all read
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-4 lg:px-8 pb-4">
          <div className="mx-auto flex gap-2 overflow-x-auto no-scrollbar">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  activeFilter === filter.id
                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                    : "bg-slate-200 text-slate-600 border border-transparent hover:border-slate-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 lg:pb-8">
        <div className="mx-auto px-4 lg:px-8 py-6">
          <main className="space-y-8">
            {Object.entries(groupedNotifications).map(
              ([dateKey, dateNotifications]) => (
                <section key={dateKey}>
                  {/* Section Header */}
                  <div className="mb-3">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {dateLabels[dateKey] || dateKey}
                    </h2>
                  </div>

                  {/* Notifications List */}
                  <div className="space-y-1">
                    {dateNotifications.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <div
                          key={notification.id}
                          className={`flex items-start gap-4 px-4 py-4 rounded-lg transition-colors ${
                            !notification.isRead
                              ? "bg-blue-50 border-l-4 border-primary"
                              : "bg-white border-l-4 border-transparent"
                          }`}
                        >
                          {/* Icon or Avatar */}
                          {notification.avatar ? (
                            <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden border border-slate-100">
                              <img
                                alt={notification.title}
                                className="w-full h-full object-cover"
                                src={notification.avatar}
                              />
                            </div>
                          ) : (
                            <div
                              className={`shrink-0 w-12 h-12 rounded-lg ${notification.iconBg} flex items-center justify-center ${notification.iconColor}`}
                            >
                              <Icon size={24} />
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="text-sm font-bold leading-tight">
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                              {notification.description}
                            </p>
                            <span className="text-[11px] font-medium text-slate-400 mt-2 block uppercase">
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ),
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
