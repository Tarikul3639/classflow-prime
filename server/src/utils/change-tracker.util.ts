// utils/change-tracker.util.ts

export function trackChange<T>(
  field: string,
  previous: T | null | undefined,
  current: T | null | undefined,
): string | null {
  const prev =
    previous instanceof Date
      ? previous.toISOString()
      : previous ?? null;

  const curr =
    current instanceof Date
      ? current.toISOString()
      : current ?? null;

  if (prev === curr) {
    return null;
  }

  // null -> value
  if (prev === null && curr !== null) {
    return `${field} added`;
  }

  // value -> null
  if (prev !== null && curr === null) {
    return `${field} removed`;
  }

  return `${field} changed from "${prev}" to "${curr}"`;
}