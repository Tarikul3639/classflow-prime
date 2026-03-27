import {
    Megaphone,
    Users,
    UserCheck,
    BookMarked,
    UserPlus,
    LucideIcon,
} from "lucide-react";

export type NotificationType =
    | "UPDATE"
    | "CLASS_FACULTY"
    | "CLASS_GROUP"
    | "MATERIAL"
    | "ENROLLMENT";

interface NotificationTypeConfig {
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    label: string;
}

export const NOTIFICATION_TYPE_CONFIG: Record<
    NotificationType,
    NotificationTypeConfig
> = {
    UPDATE: {
        icon: Megaphone,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        label: "Update",
    },

    CLASS_FACULTY: {
        icon: UserCheck,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        label: "Faculty",
    },

    CLASS_GROUP: {
        icon: Users,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        label: "Group",
    },

    MATERIAL: {
        icon: BookMarked,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        label: "Material",
    },

    ENROLLMENT: {
        icon: UserPlus,
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        label: "Enrollment",
    },
};

export const NOTIFICATION_FILTER_LABELS: Record<NotificationType, string> = {
    UPDATE: "Updates",
    CLASS_FACULTY: "Faculty",
    CLASS_GROUP: "Groups",
    MATERIAL: "Materials",
    ENROLLMENT: "Enrollments",
};

export interface INotificationMetadata {
    classId?: string | null;
    updateId?: string | null;
    refModel?: "ClassUpdate" | "Class" | "Enrollment" | "Material" | null;
    route?: string | null;
    params?: Record<string, string>;
    query?: Record<string, string>;
}

export interface INotification {
    _id: string;
    recipientId: string;
    senderId?: string | null;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    readAt?: string | null;
    metadata?: INotificationMetadata;
    createdAt: string;
    updatedAt: string;
}

export interface INotificationMeta {
    total: number;
    unreadCount: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface FetchNotificationsData {
    data: INotification[];
    meta: INotificationMeta;
}

export interface FetchNotificationsArgs {
    page?: number;
    limit?: number;
    onlyUnread?: boolean;
    type?: NotificationType;
}

export type RejectValue = { rejectValue: { message: string } };

export type ApiResponseType<T> = ApiResponse<T>;


