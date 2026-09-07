import { Types } from 'mongoose';

export enum ClassStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  UPCOMING = 'upcoming',
}

export interface IClass {
  _id?: Types.ObjectId | string;
  className: string;
  enrollCode: string; // unique code for enrolling
  department?: string; // e.g., "Computer Science"
  semester?: string; // e.g., "Fall 2024"
  allowEnroll?: boolean; // Whether students can enroll using the enroll code
  themeColor?: string; // UI theme color (e.g., "#3B82F6")
  coverImage?: string | null; // Cover image URL (e.g., "https://example.com/image.png")
  status: ClassStatus; // active, ended, upcoming
  isBlocked?: boolean; // Whether the class is blocked (e.g., due to violations)
  blockedReason?: string | null; // Reason for blocking the class (if blocked)
  blockedAt?: Date | null; // Timestamp when the class was blocked (if blocked)
  blockedBy?: Types.ObjectId | string | null; // User ID of the admin who blocked the class (if blocked)
  createdBy?: Types.ObjectId | string; // User ID of the admin who created the class
  createdAt?: Date;
  updatedAt?: Date;
}
