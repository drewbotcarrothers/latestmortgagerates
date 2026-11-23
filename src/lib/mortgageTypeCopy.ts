/**
 * User-facing names for insured vs uninsured mortgages.
 * Exactly 20% down is uninsured. Never write ">20%".
 */

export const INSURED_SHORT_LABEL = "Insured (<20% down)";
export const UNINSURED_SHORT_LABEL = "Uninsured (20%+ down)";

/** Use once, on the first prose mention. Do not repeat it on every row. */
export const INSURED_UNINSURED_EXPLANATION =
  "Uninsured mortgages are for buyers putting 20% or more down (or refinancing); insured mortgages have under 20% down and require mortgage default insurance.";

export function mortgageTypeShortLabel(type: string | null | undefined): string {
  if (type === "insured") return INSURED_SHORT_LABEL;
  if (type === "uninsured") return UNINSURED_SHORT_LABEL;
  if (type === "insurable") return "Insurable";
  if (!type || type === "unknown" || type === "unstated") return "Not stated";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/** Chart, banner, and stat labels that already name the rate product. */
export function productWithMortgageLabel(product: string, type: "insured" | "uninsured"): string {
  return `${product} · ${type === "insured" ? INSURED_SHORT_LABEL : UNINSURED_SHORT_LABEL}`;
}

/** Replace exact Insured/Uninsured table cells. Leaves prose and "insurable" alone. */
export function applyShortInsuranceLabels(html: string): string {
  return html.replace(
    /(<(?:td|th)\b[^>]*>)(\s*)(Insured|Uninsured)(\s*)(<\/(?:td|th)>)/g,
    (_match, open: string, lead: string, word: string, trail: string, close: string) =>
      `${open}${lead}${word === "Insured" ? INSURED_SHORT_LABEL : UNINSURED_SHORT_LABEL}${trail}${close}`,
  );
}

export function mentionsInsuredOrUninsured(text: string): boolean {
  return /\binsured\b/i.test(text) || /\buninsured\b/i.test(text);
}
