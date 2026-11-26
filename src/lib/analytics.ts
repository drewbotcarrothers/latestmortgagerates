/**
 * GA4 custom events via the gtag snippet in BaseLayout.
 * No-ops when the script has not loaded, when window is unavailable, or when gtag throws.
 */

export type AnalyticsValue = string | number | boolean | null | undefined;
export type AnalyticsParams = Record<string, AnalyticsValue>;

type Gtag = (command: "event", name: string, params?: Record<string, string | number | boolean>) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function trackEvent(name: string, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  const gtag = window.gtag;
  if (typeof gtag !== "function") return;

  const clean: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      clean[key] = value;
    }
  }

  try {
    gtag("event", name, clean);
  } catch {
    // Analytics must never break the page.
  }
}
