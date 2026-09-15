/** Sitewide AdSense publisher ID. Script is loaded in BaseLayout. */
export const ADSENSE_CLIENT = "ca-pub-7909541570116920";

/**
 * Manual AdSense slot IDs.
 *
 * PLACEHOLDERS — leave empty until Andrew creates units in the AdSense
 * dashboard (Ads → By ad unit) and pastes the numeric slot IDs here.
 *
 * Do not invent fake numeric IDs. Empty values omit `data-ad-slot` so the
 * unit still renders with `data-ad-client` + responsive format.
 */
export const ADSENSE_SLOTS = {
  /** Responsive display — home, rate hubs, lenders, cities, blog, guide */
  display: "",
  /** In-article fluid — blog posts */
  inArticle: "",
  /** Sidebar / rail — tool pages with a right column */
  sidebar: "",
} as const;

export type AdSenseSlotName = keyof typeof ADSENSE_SLOTS;

export type AdFormat = "display" | "inArticle" | "sidebar";

export function slotForFormat(format: AdFormat): string {
  if (format === "sidebar") return ADSENSE_SLOTS.sidebar;
  if (format === "inArticle") return ADSENSE_SLOTS.inArticle;
  return ADSENSE_SLOTS.display;
}

/** True only for real AdSense slot IDs (digits). Placeholders are omitted. */
export function isConfiguredSlot(slot: string | undefined): slot is string {
  return typeof slot === "string" && /^\d+$/.test(slot);
}

export function pushAdSense(): void {
  if (typeof window === "undefined") return;
  const w = window as Window & { adsbygoogle?: object[] };
  w.adsbygoogle = w.adsbygoogle || [];
  w.adsbygoogle.push({});
}
