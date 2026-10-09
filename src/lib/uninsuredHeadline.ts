/**
 * Lowest-uninsured headlines.
 *
 * RFA Bank rows stored as mortgage_type "uninsured" are not true uninsured
 * offers. In data/rates.json every RFA row is tagged uninsured, but
 * raw_data.source is the undifferentiated fallback `rfa_fallback_2026-09-14`
 * and raw_data.product is only a term name ("5-Year Fixed", "5-Year Variable")
 * with no uninsured or uninsurable label (last verified 2026-07-06). RFA's
 * own board prices insured and insurable files apart from uninsurable ones.
 * The weekly video pipeline leaves these rows out when it picks the lowest
 * uninsured rate.
 *
 * Full rate tables still show the rows. A lender's own RFA sheet still shows
 * them. Only a cross-lender "lowest uninsured" pick skips them.
 */

export function countsTowardUninsuredHeadline(rate: {
  lender_slug?: string | null;
  mortgage_type?: string | null;
}): boolean {
  if (rate.mortgage_type !== "uninsured") return false;
  return (rate.lender_slug ?? "").toLowerCase() !== "rfa";
}
