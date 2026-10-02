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

export const LOGO_BOX: Record<LogoSize, { height: number; maxWidth: number }> = {
  xs: { height: 20, maxWidth: 72 },
  sm: { height: 28, maxWidth: 112 },
  md: { height: 32, maxWidth: 140 },
  lg: { height: 40, maxWidth: 176 },
};

const lenders = manifest.lenders as LenderLogoRecord[];

const bySlug = new Map(lenders.map((lender) => [lender.slug, lender]));

export function lenderLogoRecord(slug: string): LenderLogoRecord | undefined {
  return bySlug.get(slug.toLowerCase());
}

export function allLenderLogos(): LenderLogoRecord[] {
  return lenders;
}

/** Fixed box so the image slot does not shift layout as the file loads. */
export function logoBox(width: number, height: number, size: LogoSize): { width: number; height: number } {
  const box = LOGO_BOX[size];
  const aspect = height > 0 ? width / height : 1;
  const displayWidth = Math.min(box.maxWidth, Math.max(box.height, Math.round(box.height * aspect)));
  return { width: displayWidth, height: box.height };
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
