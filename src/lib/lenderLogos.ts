import manifest from "@/data/lender-logos.json";

export type LogoSize = "xs" | "sm" | "md" | "lg";

export interface LenderLogoRecord {
  slug: string;
  name: string;
  kind: "logo" | "monogram";
  file: string | null;
  source_url: string | null;
  retrieved: string;
  width: number;
  height: number;
  initials?: string;
  color?: string;
  notes?: string;
}

/**
 * Every self-hosted mark is drawn on the same 4:1 canvas (320×80).
 * These frames are that canvas at the size each surface uses, so a shield
 * and a wordmark occupy the same box.
 */
export const LOGO_FRAME: Record<LogoSize, { width: number; height: number }> = {
  xs: { width: 80, height: 20 },
  sm: { width: 112, height: 28 },
  md: { width: 128, height: 32 },
  lg: { width: 160, height: 40 },
};

const lenders = manifest.lenders as LenderLogoRecord[];

const bySlug = new Map(lenders.map((lender) => [lender.slug, lender]));

export function lenderLogoRecord(slug: string): LenderLogoRecord | undefined {
  return bySlug.get(slug.toLowerCase());
}

export function allLenderLogos(): LenderLogoRecord[] {
  return lenders;
}

/** Fixed frame so the image slot does not shift layout as the file loads. */
export function logoBox(size: LogoSize): { width: number; height: number } {
  return LOGO_FRAME[size];
}

export function monogramFor(slug: string, name: string): { initials: string; color: string } {
  const words = name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const initials =
    words.length >= 2
      ? words
          .slice(0, 3)
          .map((word) => word[0])
          .join("")
      : (words[0] || slug).slice(0, 2);
  return { initials: initials.toUpperCase(), color: "#475569" };
}
