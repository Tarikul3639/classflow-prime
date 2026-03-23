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