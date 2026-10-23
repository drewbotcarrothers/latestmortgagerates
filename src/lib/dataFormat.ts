/** Shared display helpers for the rate-data pages. */

export function formatLongDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Intl.DateTimeFormat("en-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function formatPct(value: number | null | undefined, digits = 2): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatPts(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  const abs = Math.abs(value).toFixed(2);
  if (value === 0) return "0.00 percentage points";
  return `${abs} percentage points`;
}

/** Whole dollars, Canadian grouping. */
export function formatCad(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function scrapeDate(iso: string | undefined | null): string | null {
  if (!iso) return null;
  const match = iso.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

export function latestScrapeDate(rows: readonly { scraped_at?: string | null }[]): string | null {
  let latest: string | null = null;
  for (const row of rows) {
    const date = scrapeDate(row.scraped_at);
    if (date && (latest == null || date > latest)) latest = date;
  }
  return latest;
}

export function wordCount(text: string): number {
  const plain = text.replace(/<[^>]+>/g, " ").replace(/&[a-z]+;/g, " ");
  const words = plain.match(/[A-Za-z0-9][A-Za-z0-9'’.%$-]*/g);
  return words ? words.length : 0;
}
