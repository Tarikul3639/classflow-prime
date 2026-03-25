export type DateKey = "today" | "tomorrow" | "yesterday" | string;

/**
 * Get relative date label from any date
 */
export function getDateKey(dateStr: string): DateKey {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  const today = new Date();
  const tomorrow = new Date();
  const yesterday = new Date();

  tomorrow.setDate(today.getDate() + 1);
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "today";
  if (isSameDay(date, tomorrow)) return "tomorrow";
  if (isSameDay(date, yesterday)) return "yesterday";

  return formatDate(date);
}

/**
 * Format time (e.g., 10:30 AM)
 */
export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format full date (e.g., Wed, Oct 27)
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/**
 * Check same day
 */
function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

export function getISODate(isoStr?: string): string | null {
  if (!isoStr) return null;

  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return null;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

export function getISOTime(isoStr?: string): string | null {
  if (!isoStr) return null;

  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return null;

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${mm}`;
}

export function combineDateTimeLocal(dateStr?: string, timeStr?: string): string | null {
  if (!dateStr) return null;
  return timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T00:00`; // ✅ local string save
}