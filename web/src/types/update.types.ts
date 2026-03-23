import {
    FileCode,
    ImageIcon,
    Link as LinkIcon,
    Megaphone,
    BookOpen,
    FlaskConical,
    BookMarked,
    FileText,
    type LucideIcon,
} from "lucide-react";

// ==================== Attachment ====================

export type AttachmentType = "pdf" | "docx" | "image" | "link";

export interface AttachmentConfig {
    icon: LucideIcon;
    label: string;
    color: string;
    bgColor: string;
}

export const ATTACHMENT_TYPE_CONFIG: Record<AttachmentType, AttachmentConfig> = {
    pdf: {
        icon: FileText,
        label: "PDF Document",
        color: "text-red-600",
        bgColor: "bg-red-50",
    },
    docx: {
        icon: FileCode,
        label: "Word File",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    image: {
        icon: ImageIcon,
        label: "Image / Photo",
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
    link: {
        icon: LinkIcon,
        label: "External Link",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
    },
};

// ==================== Update Type ====================

export type UpdateType = "announcement" | "assignment" | "exam" | "material";

export interface UpdateTypeConfig {
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    label: string;
}

export const UPDATE_TYPE_CONFIG: Record<UpdateType, UpdateTypeConfig> = {
    announcement: {
        icon: Megaphone,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        label: "Announcement",
    },
    assignment: {
        icon: BookOpen,
        iconBg: "bg-blue-100",
        iconColor: "text-primary",
        label: "Assignment",
    },
    exam: {
        icon: FlaskConical,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        label: "Exam",
    },
    material: {
        icon: BookMarked,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        label: "Material",
    },
};

// ==================== Attachment Model ====================

export interface Attachment {
    _id: string;
    name: string;
    size: string;
    url: string;
    type: AttachmentType;
}

// ==================== Create (Form) ====================

export interface CreateUpdateFormData {
    type: UpdateType;
    title: string;
    description: string;
    date: string;
    time: string;
    attachments: Attachment[];
}

// ==================== Fetch (API Response) ====================

export interface PostedBy {
    _id: string;
    name: string;
    avatarUrl: string | null;
}

export interface UpdateEngagement {
    avatars: string[];
    commentCount: number;
}

export interface ClassUpdateItem {
    _id: string;
    classId: string;
    type: UpdateType;
    title: string;
    description: string;
    isPinned: boolean;
    postedBy: PostedBy;
    eventAt: string | null;
    createdAt: string;
    attachments?: Attachment[];
    engagement?: UpdateEngagement;
}