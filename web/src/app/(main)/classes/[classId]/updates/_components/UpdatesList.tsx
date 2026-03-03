"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import UpdateCard from "./UpdateCard";
import DateHeader from "./DateHeader";

interface Update {
  _id: string;
  type: "featured" | "standard" | "attachment" | "announcement";
  priority?: "urgent" | "normal";
  icon?: LucideIcon;
  iconBg?: string;
  iconColor?: string;
  title: string;
  courseCode?: string;
  courseName?: string;
  description: string;
  author?: {
    _id: string;
    name: string;
    avatar?: string;
    initials?: string;
  };
  timestamp: string;
  eventDate?: string;
  eventTime?: string;
  date: string;
  image?: string;
  attachment?: {
    name: string;
    size: string;
    type: string;
    url?: string;
  };
  engagement?: {
    avatars?: string[];
    commentCount?: number;
  };
}

interface UpdatesListProps {
  groupedUpdates: Record<string, Update[]>;
  dateLabels: Record<string, string>;
}

export default function UpdatesList({
  groupedUpdates,
  dateLabels,
}: UpdatesListProps) {
  return (
    <>
      {Object.entries(groupedUpdates).map(([dateKey, dateUpdates]) => (
        <div key={dateKey}>
          {/* Date Header */}
          {dateKey !== "today" || dateUpdates[0].type !== "featured" ? (
            <DateHeader label={dateLabels[dateKey] || dateKey} />
          ) : null}

          {/* Updates */}
          <div className="space-y-3">
            {dateUpdates.map((update) => (
              <UpdateCard
                key={update._id}
                icon={update.icon}
                iconBg={update.iconBg}
                iconColor={update.iconColor}
                title={update.title}
                courseCode={update.courseCode}
                courseName={update.courseName}
                timestamp={update.timestamp}
                eventDate={update.eventDate}
                eventTime={update.eventTime}
                description={update.description}
                attachment={update.attachment}
                engagement={update.engagement}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
