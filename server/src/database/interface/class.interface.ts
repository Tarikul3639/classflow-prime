import { Types } from "mongoose";

export enum ClassStatus {
    ACTIVE = 'active',
    ENDED = 'ended',
    UPCOMING = 'upcoming'
}

export interface IClass {
    _id?: string;
    name: string;
    description?: string;
    joinCode: string;      // unique code for joining
    instructorId: Types.ObjectId;  // ID of the instructor
    assistantIds?: Types.ObjectId[]; // IDs of assistants
    semester?: string;    // e.g., "Fall 2024"
    tags: string[];      // e.g., ["Computer Science", "AI"]
    status: ClassStatus; // active, ended, upcoming
    isArchived?: boolean; // Whether the class is archived (soft delete)
    createdAt?: Date;
    updatedAt?: Date;
}