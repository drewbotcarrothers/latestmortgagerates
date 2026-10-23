import announcementsFile from "../../data/boc-announcements.json";
import primeConfig from "../../config/prime_rate.json";
import { BOC_POLICY_RATE, PRIME_RATE, PRIME_SPREAD } from "./primeRate";
import { latestScrapeDate, round2 } from "./dataFormat";

export interface PrimeRateRow {
  lender_name?: string;
  lender_slug?: string;
  term_months?: number;
  rate_type?: string;
  rate?: number | null;
  posted_rate?: number | null;
  mortgage_type?: string | null;
  source_url?: string | null;
  scraped_at?: string | null;
  raw_data?: { prime_rate?: string | number | null; product?: string } | null;
}

export interface ScrapedPrime {
  slug: string;
  name: string;
  prime: number;
  sourceUrl: string | null;
}

export const BIG6 = [
  { slug: "rbc", name: "RBC" },
  { slug: "td", name: "TD" },
  { slug: "scotiabank", name: "Scotiabank" },
  { slug: "bmo", name: "BMO" },
  { slug: "cibc", name: "CIBC" },
  { slug: "nationalbank", name: "National Bank" },
] as const;

export const primeAnnouncements = announcementsFile;

export function scrapedPrimes(rows: readonly PrimeRateRow[]): ScrapedPrime[] {
  const found = new Map<string, ScrapedPrime>();
  for (const row of rows) {
    if (!row.lender_slug || found.has(row.lender_slug)) continue;
    const raw = row.raw_data?.prime_rate;
    if (raw == null || raw === "") continue;
    const prime = typeof raw === "number" ? raw : Number(raw);
    if (!Number.isFinite(prime)) continue;
    found.set(row.lender_slug, {
      slug: row.lender_slug,
      name: row.lender_name || row.lender_slug,
      prime,
      sourceUrl: row.source_url ?? null,
    });
  }
  return [...found.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** TD's 5-year variable posted rate, when the scrape stored one. Not labelled prime by the scraper. */
export function tdVariablePosted(rows: readonly PrimeRateRow[]): number | null {
  const matches = rows.filter(
    (row) =>
      row.lender_slug === "td" &&
      row.term_months === 60 &&
      row.rate_type === "variable" &&
      row.mortgage_type === "uninsured" &&
      typeof row.posted_rate === "number",
  );
  if (!matches.length) return null;
  return matches[0].posted_rate as number;
}

export function primeFileFacts(rows: readonly PrimeRateRow[]) {
  return {
    prime: PRIME_RATE,
    policyRate: BOC_POLICY_RATE,
    spread: PRIME_SPREAD,
    effective: primeConfig.effective,
    source: primeConfig.source,
    lenderCount: new Set(rows.map((row) => row.lender_slug).filter(Boolean)).size,
    asOf: latestScrapeDate(rows),
    scraped: scrapedPrimes(rows),
    tdVariablePosted: tdVariablePosted(rows),
    primeIfPolicy: (policy: number) => round2(policy + PRIME_SPREAD),
  };
}
