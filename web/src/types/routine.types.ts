export interface RoutinePeriod {
    periodId: string;
    periodNo: number;
    label: string;
    startTime: string;
    endTime: string;
    isBreak?: boolean;
}

export interface RoutineSlot {
    slotId: string;
    periodNo: number;
    subject: string;
    teacherName: string;
    room?: string;
}

export interface DaySchedule {
    day: string;
    slots: RoutineSlot[];
}

export interface Routine {
    routineId: string;
    classId: string;

    // Period structure with start and end time
    periods: RoutinePeriod[];

    // Schedule grouped by day with slots
    schedule: DaySchedule[];

    createdAt: string;
    updatedAt: string;
}

export type DayOfWeek =
    | "Sunday"
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday";