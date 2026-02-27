import { IUser } from "@/redux/slices/auth/types";

export type ClassroomRole = "admin" | "co_admin" | "member";
export type EventType =
  | "quiz"
  | "assignment"
  | "presentation"
  | "ct"
  | "lab"
  | "seminar"
  | "lecture"
  | "class";

export interface IMaterial {
  _id: string;
  name: string;
  type: "pdf" | "docx" | "image" | "link";
  url?: string;
}

export interface IEvent {
  _id: string;
  type: EventType;
  title: string;
  date: string; // ISO: "2026-01-23"
  startAt: string;
  endAt?: string;
  location?: string;
  topics?: string;
  materials?: IMaterial[];
  isCompleted: boolean;
  createdBy: IUser; // User ID
  createdAt: string;
  updatedAt: string;
}

export interface IClassroomMember {
  user: IUser;
  role: ClassroomRole;
  isBlocked: boolean;
  joinedAt: string;
}

export interface IClassroom {
  _id: string;
  name: string;
  description?: string;
  institute: string;
  department: string;
  intake: string;
  section?: string;
  joinCode?: string; // Optional: Only Admin can access
  isJoinCodeActive: boolean;
  createdBy: string;
  members: IClassroomMember[];
  events: IEvent[];
  isActive: boolean;
  isArchived: boolean;
  isBlocked?: boolean;
  coverImage?: string;
  totalMembers: number;
  totalEvents: number;
  myRole?: ClassroomRole; // Extra helper for Frontend
}

// Redux State Interface
export interface ClassroomState {
  // AllClassrooms: IClassroom[] | null; // TODO: Future use
  classroom: IClassroom | null;
  loading: boolean;
  error: string | null;
  requestStatus: {
    // Classroom related statuses
    fetchClassroom: { loading: boolean; error: string | null };
    joinClassroom: { loading: boolean; error: string | null };
    leaveClassroom: { loading: boolean; error: string | null };
    createClassroom: { loading: boolean; error: string | null };
    deleteClassroom: { loading: boolean; error: string | null };
    // Event related statuses
    fetchEvents: { loading: boolean; error: string | null };
    updateEvent: { loading: boolean; error: string | null };
    deleteEvent: { loading: boolean; error: string | null };
    createEvent: { loading: boolean; error: string | null };
    // User management statuses
    blockUser: { loading: boolean; error: string | null };
    unblockUser: { loading: boolean; error: string | null };
    assignRole: { loading: boolean; error: string | null };
    removeMember: { loading: boolean; error: string | null };
  };
}
