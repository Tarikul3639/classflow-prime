import { Types } from "mongoose";

export enum ActivityAction {
    // ==================== Authentication ====================

    LOGIN = 'LOGIN',
    LOGIN_FAILED = 'LOGIN_FAILED',
    LOGOUT = 'LOGOUT',

    // ==================== CRUD ====================

    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',

    // ==================== Access Control ====================

    UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
    FORBIDDEN_ACCESS = 'FORBIDDEN_ACCESS',

    // ==================== Account Management ====================

    ACCOUNT_ACTIVATED = 'ACCOUNT_ACTIVATED',
    ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
    ACCOUNT_BANNED = 'ACCOUNT_BANNED',

    // ==================== Password ====================

    PASSWORD_CHANGED = 'PASSWORD_CHANGED',
    PASSWORD_RESET = 'PASSWORD_RESET',

    // ==================== API Key ====================

    API_KEY_CREATED = 'API_KEY_CREATED',
    API_KEY_REVOKED = 'API_KEY_REVOKED',

    // ==================== Security ====================

    SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
}

export enum ActivitySeverity {
    INFO = 'INFO',
    WARNING = 'WARNING',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export enum ActivityStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    BLOCKED = 'BLOCKED',
}

export interface IActivityLog {
    userId?: Types.ObjectId;

    action: ActivityAction;
    severity: ActivitySeverity;
    status: ActivityStatus;

    resource?: string;
    resourceId?: string;

    ipAddress: string;
    userAgent?: string;

    method?: string;
    endpoint?: string;

    metadata: Record<string, unknown>;

    description?: string;

    createdAt?: Date;
    updatedAt?: Date;
}