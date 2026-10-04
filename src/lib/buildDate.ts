const TORONTO = "America/Toronto";

/** Short month and year for titles, e.g. "Oct 2026". Derived from the date passed in (the build date on the static site). */
export function formatBuildMonthYear(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TORONTO,
    month: "short",
    year: "numeric",
  }).formatToParts(date);
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  return `${month} ${year}`;
}

/** Full calendar date in Toronto, e.g. "October 3, 2026". */
export function formatBuildDateLong(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TORONTO,
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function buildYear(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: TORONTO,
    year: "numeric",
  }).format(date);
}
