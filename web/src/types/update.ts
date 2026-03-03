import { LucideIcon } from "lucide-react";

export interface Update {
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
  date: string;
  eventDate?: string;
  eventTime?: string;
  image?: string;
  attachment?: {
    name: string;
    size: string;
    type: string;
    url?: string;
  }[];
  engagement?: {
    avatars?: string[];
    commentCount?: number;
  };
}

export interface Filter {
  id: string;
  label: string;
}