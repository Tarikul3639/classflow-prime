// data.utils.ts

/**
 * Date Utilities
 *
 * Functions for formatting and manipulating dates.
 * Assumes all input dates are in ISO format (UTC) and converts them to LOCAL time for display.
 *
 * Output Examples:
 * - "Today • 10:30 AM"         → if the date is today
 * - "Tomorrow • 10:30 AM"      → if the date is tomorrow
 * - "Yesterday • 10:30 AM"     → if the date is yesterday
 * - "after 3 days"             → if within the next relativeDaysLimit
 * - "3 days before"            → if within the past relativeDaysLimit
 * - "Wed, Oct 27, 2024"        → if beyond relativeDaysLimit
 *
 * Options:
 * - showTime: boolean            → include time display
 * - showYear: boolean            → include year for dates beyond limit
 * - relativeDaysLimit: number    → max days for "after X days"/"X days before"
 * - showTimeAfterLimit: boolean  → show time even for dates beyond limit
 * - timeOnly: boolean            → show only time (ignores date)
 */
interface FormatOptions {
  showTime?: boolean;
  showYear?: boolean;
  relativeDaysLimit?: number;
  showTimeAfterLimit?: boolean;
  timeOnly?: boolean;
}

export function formatRelativeDate(
  dateStr: string,
  options: FormatOptions = {}
): string {
  const {
    showTime = false,
    showYear = true,
    relativeDaysLimit = 7,
    showTimeAfterLimit = false,
    timeOnly = false,
  } = options;

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";

  // Just time
  if (timeOnly) {
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  // Normalize to LOCAL midnight
  const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = normalize(new Date());
  const target = normalize(date);

  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let relative: string | null = null;

  if (diffDays === 0) relative = "Today";
  else if (diffDays === 1) relative = "Tomorrow";
  else if (diffDays === -1) relative = "Yesterday";
  else if (diffDays > 1 && diffDays <= relativeDaysLimit) relative = `after ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  else if (diffDays < -1 && diffDays >= -relativeDaysLimit) relative = `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} before`;

  // Base date formatting if beyond limit
  let datePart: string;
  if (relative) {
    datePart = relative;
  } else {
    const opts: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: showYear ? "numeric" : undefined,
    };
    datePart = date.toLocaleDateString("en-US", opts);
  }

  // Add time
  const shouldShowTime = showTime || (!relative && showTimeAfterLimit);
  if (shouldShowTime) {
    const timePart = date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${datePart} • ${timePart}`;
  }

  return datePart;
}

/**
 * Extract local date (YYYY-MM-DD)
 */
export function getISODate(isoStr?: string): string | null {
  if (!isoStr) return null;

  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return null;

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Extract local time (HH:mm)
 */
export function getISOTime(isoStr?: string): string | null {
  if (!isoStr) return null;

  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return null;

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${mm}`;
}

/**
 * Combine date + time → SAVE AS UTC (IMPORTANT)
 */
export function combineDateTime(
  dateStr?: string,
  timeStr?: string,
): string | null {
  if (!dateStr) return null;

  // Create LOCAL datetime
  const isoLocal = timeStr ? `${dateStr}T${timeStr}` : `${dateStr}T00:00`;

  const date = new Date(isoLocal);
  if (isNaN(date.getTime())) return null;

  // Convert to UTC for backend
  return date.toISOString();
}