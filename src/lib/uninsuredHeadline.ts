/**
 * Lowest-uninsured headlines.
 *
 * A live RFA uninsured row (the uninsurable file on rfa.ca/prime) counts.
 * RFA is left out only when the row is still the hard-coded fallback, or
 * when the source is not a live scrape and last_verified is missing or
 * older than 14 days. That is the September 2026 sheet tagged
 * `rfa_fallback_2026-09-14` (last verified 2026-07-06), which labeled every
 * term uninsured with no insured or insurable file.
 *
 * Full rate tables still show fallback rows. A lender's own RFA sheet still
 * shows them. Only a cross-lender "lowest uninsured" pick skips them.
 */

const RFA_STALE_MS = 14 * 24 * 60 * 60 * 1000;

export function rfaRowIsUnconfirmed(rate: {
  lender_slug?: string | null;
  raw_data?: { source?: string | null; last_verified?: string | null } | null;
}): boolean {
  if ((rate.lender_slug ?? "").toLowerCase() !== "rfa") return false;
  const source = (rate.raw_data?.source ?? "").toLowerCase();
  if (source.includes("fallback")) return true;
  if (source.includes("rfa_live")) return false;
  const verified = rate.raw_data?.last_verified;
  if (!verified) return true;
  const parsed = Date.parse(verified);
  if (Number.isNaN(parsed)) return true;
  return Date.now() - parsed > RFA_STALE_MS;
}

export function countsTowardUninsuredHeadline(rate: {
  lender_slug?: string | null;
  mortgage_type?: string | null;
  raw_data?: { source?: string | null; last_verified?: string | null } | null;
}): boolean {
  if (rate.mortgage_type !== "uninsured") return false;
  return !rfaRowIsUnconfirmed(rate);
}
