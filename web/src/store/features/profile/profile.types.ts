
/**
 * Generic request status for async thunks.
 */
export interface IRequestStatus {
    loading: boolean;
    isFetched: boolean;
    error: string | null;
    message: string | null;
}

/**
 * Status enum for class enrollment.
 */
export enum ClassStatus {
    ACTIVE = 'active',
    ENDED = 'ended',
    UPCOMING = 'upcoming',
}

/**
 * User role enum.
 */
export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
}

/**
 * User model.
 */
export type IUser = {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    bio?: string;
    avatarUrl?: string;
    enrolledClasses: {
        classId: string;
        className: string;
        themeColor?: string;
        coverImage?: string;
        role: string;
        status: ClassStatus;
        enrolledAt: Date;
    }[];
};