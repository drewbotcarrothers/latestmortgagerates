/**
 * Place rate labels on a horizontal posted-vs-reported chart.
 * Posted rates sit above the line; reported medians sit below.
 * Labels that would overlap on the same side stack away from the line.
 * If three labels on one side still collide, the font steps down so every
 * point can keep a label.
 */

export interface RatePointLabel {
  id: string;
  /** Marker x in SVG user units. */
  x: number;
  text: string;
  color: string;
  side: "above" | "below";
}

export interface PlacedRateLabel extends RatePointLabel {
  labelX: number;
  labelY: number;
  textAnchor: "start" | "middle" | "end";
  fontSize: number;
  /** 0 is the row closest to the line. */
  slot: number;
}

export interface RateLabelLayout {
  lineY: number;
  fontSize?: number;
  minX: number;
  maxX: number;
}

const DEFAULT_FONT_SIZE = 12;

export function estimateRateLabelWidth(text: string, fontSize: number): number {
  let em = 0;
  for (const ch of text) {
    if (ch === "%") em += 0.95;
    else if (ch === ".") em += 0.34;
    else if (ch >= "0" && ch <= "9") em += 0.6;
    else em += 0.58;
  }
  // Room for the light halo so neighbouring labels do not touch.
  return em * fontSize + fontSize * 0.5;
}

export function rateLabelBox(label: Pick<PlacedRateLabel, "labelX" | "textAnchor" | "text" | "fontSize">): {
  left: number;
  right: number;
} {
  const width = estimateRateLabelWidth(label.text, label.fontSize);
  if (label.textAnchor === "start") return { left: label.labelX, right: label.labelX + width };
  if (label.textAnchor === "end") return { left: label.labelX - width, right: label.labelX };
  return { left: label.labelX - width / 2, right: label.labelX + width / 2 };
}

function clampAnchor(
  x: number,
  width: number,
  minX: number,
  maxX: number,
): { labelX: number; textAnchor: PlacedRateLabel["textAnchor"] } {
  const half = width / 2;
  if (width >= maxX - minX) return { labelX: minX, textAnchor: "start" };
  if (x - half < minX) return { labelX: minX, textAnchor: "start" };
  if (x + half > maxX) return { labelX: maxX, textAnchor: "end" };
  return { labelX: x, textAnchor: "middle" };
}

function overlaps(label: PlacedRateLabel, other: PlacedRateLabel, gap: number): boolean {
  const boxA = rateLabelBox(label);
  const boxB = rateLabelBox(other);
  return boxA.left < boxB.right + gap && boxB.left < boxA.right + gap;
}

function place(points: RatePointLabel[], layout: RateLabelLayout, fontSize: number): PlacedRateLabel[] {
  const gap = 4;
  const stack = Math.round(fontSize * 1.35);
  const drafts: PlacedRateLabel[] = points.map((point) => {
    const width = estimateRateLabelWidth(point.text, fontSize);
    const anchored = clampAnchor(point.x, width, layout.minX, layout.maxX);
    return {
      ...point,
      ...anchored,
      labelY: layout.lineY,
      fontSize,
      slot: 0,
    };
  });

  for (const side of ["above", "below"] as const) {
    const group = drafts
      .filter((label) => label.side === side)
      .sort((a, b) => a.x - b.x || a.labelX - b.labelX);
    const placed: PlacedRateLabel[] = [];
    for (const label of group) {
      let slot = 0;
      while (slot < 6 && placed.some((other) => other.slot === slot && overlaps(label, other, gap))) {
        slot += 1;
      }
      label.slot = slot;
      placed.push(label);
    }
  }

  for (const label of drafts) {
    const above = Math.round(fontSize + 8);
    const below = Math.round(fontSize + 14);
    const offset = (label.side === "above" ? above : below) + label.slot * stack;
    label.labelY = label.side === "above" ? layout.lineY - offset : layout.lineY + offset;
  }

  return drafts;
}

export function layoutRateLabels(points: RatePointLabel[], layout: RateLabelLayout): PlacedRateLabel[] {
  const preferred = layout.fontSize ?? DEFAULT_FONT_SIZE;
  const sizes = [...new Set([preferred, Math.max(9, preferred - 2), 9])];
  let best = place(points, layout, sizes[0]);
  for (const size of sizes) {
    best = place(points, layout, size);
    const crowded = best.some((label) => label.slot > 1);
    if (!crowded) break;
  }
  return best;
}

/**
 * User-unit font that stays near `targetPx` after the viewBox is scaled to `chartWidthPx`.
 * Wide charts keep the preferred size. Narrow charts grow the user-unit font, up to `max`,
 * so the glyphs do not shrink below a readable size when every point is on screen.
 */
export function rateLabelFontSize(
  chartWidthPx: number,
  viewBoxWidth: number,
  options?: { targetPx?: number; min?: number; max?: number },
): number {
  const targetPx = options?.targetPx ?? 12;
  const min = options?.min ?? 13;
  const max = options?.max ?? 24;
  if (!Number.isFinite(chartWidthPx) || chartWidthPx <= 0) return min;
  const raw = Math.round((targetPx * viewBoxWidth) / chartWidthPx);
  return Math.min(max, Math.max(min, raw));
}

/** Shift the line and labels so the halo stays inside the viewBox. */
export function frameRateChart(
  labels: PlacedRateLabel[],
  lineY: number,
  pad = 8,
): { labels: PlacedRateLabel[]; lineY: number; height: number } {
  const minTop = Math.min(lineY - 16, ...labels.map((label) => label.labelY - label.fontSize - 5), pad);
  const shift = minTop < pad ? pad - minTop : 0;
  const shifted = labels.map((label) => ({ ...label, labelY: label.labelY + shift }));
  const nextLine = lineY + shift;
  const maxBottom = Math.max(nextLine + 16, ...shifted.map((label) => label.labelY + 6));
  return {
    labels: shifted,
    lineY: nextLine,
    height: Math.ceil(maxBottom + pad),
  };
}
