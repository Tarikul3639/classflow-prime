import { RoutineSlot } from "@/types/routine.types";

export interface SubjectColor {
    border: string;
    avatarBg: string;
    avatarText: string;
}

export function buildSubjectColorMap(
    slots: (RoutineSlot | undefined)[][]
): Map<string, SubjectColor> {
    const unique = [
        ...new Set(
            slots.flat().filter(Boolean).map((s) => s!.subject)
        ),
    ];

    const map = new Map<string, SubjectColor>();

    unique.forEach((subject, i) => {
        // golden angle ensures maximum perceptual distance between colors
        const hue = Math.round((i * 137.508) % 360);
        map.set(subject, {
            border: `hsl(${hue}, 60%, 52%)`,
            avatarBg: `hsl(${hue}, 70%, 93%)`,
            avatarText: `hsl(${hue}, 55%, 28%)`,
        });
    });

    return map;
}