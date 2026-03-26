// utils/form.utils.ts

export function getDirtyFields<T extends object>(
    original: T,
    current: T
): Partial<T> {
    return (Object.keys(current) as (keyof T)[]).reduce((acc, key) => {
        // Deep compare using JSON.stringify
        if (JSON.stringify(original[key]) !== JSON.stringify(current[key])) {
            acc[key] = current[key];
        }
        return acc;
    }, {} as Partial<T>);
}