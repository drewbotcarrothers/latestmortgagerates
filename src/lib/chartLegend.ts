import {
  CHART_MIN_N,
  formatRate,
  type PostedBenchmark,
  type ProductCell,
  type WeekPoint,
  type WeekSeries,
} from "./communityRates";

/** Colours and strokes shared by the weekly chart and its legend. */
export const WEEKLY_FIXED_COLOR = "#0f172a";
export const WEEKLY_VARIABLE_COLOR = "#0f766e";
export const WEEKLY_LOWEST_FIXED_COLOR = "#c2410c";
export const WEEKLY_LOWEST_VARIABLE_COLOR = "#0e7490";
export const WEEKLY_SOLID_WIDTH = 2.5;
export const WEEKLY_DASHED_WIDTH = 1.25;
export const WEEKLY_DASHARRAY = "5 4";

/** Marker geometry shared by the posted-comparison chart and its legend. */
export const MARKER_REPORTED_COLOR = "#0f766e";
export const MARKER_BIG5_COLOR = "#0f172a";
export const MARKER_LOWEST_COLOR = "#c2410c";
export const MARKER_RADIUS = 7;
export const MARKER_STROKE = 2;

export type LineStyle = "solid" | "dashed";

export interface WeeklyLegendItem {
  id: string;
  /** Same wording as the chart title for that series. */
  label: string;
  color: string;
  style: LineStyle;
  /** Y value of a posted benchmark. Null for a weekly median line. */
  value: number | null;
}

export interface MarkerLegendItem {
  id: "median" | "lowest" | "big5";
  label: string;
  color: string;
  shape: "circle" | "diamond";
}

export function weekSeriesDrawn(series: WeekSeries): boolean {
  return series.n >= CHART_MIN_N && series.median != null && Number.isFinite(series.median);
}

export function diamondPoints(cx: number, cy: number, r: number): string {
  return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
}

export function weeklyLegendItems(
  weeks: WeekPoint[],
  benchmarks: { fixed: PostedBenchmark; variable: PostedBenchmark },
): WeeklyLegendItem[] {
  const items: WeeklyLegendItem[] = [];
  if (weeks.some((week) => weekSeriesDrawn(week.fixed))) {
    items.push({
      id: "fixed-median",
      label: "5-year fixed reported median",
      color: WEEKLY_FIXED_COLOR,
      style: "solid",
      value: null,
    });
  }
  if (weeks.some((week) => weekSeriesDrawn(week.variable))) {
    items.push({
      id: "variable-median",
      label: "5-year variable reported median",
      color: WEEKLY_VARIABLE_COLOR,
      style: "solid",
      value: null,
    });
  }

  const guides: Array<{ id: string; value: number | null; color: string; name: string }> = [
    {
      id: "big5-fixed",
      value: benchmarks.fixed.big5PostedMedian,
      color: WEEKLY_FIXED_COLOR,
      name: "Big-5 5-yr fixed",
    },
    {
      id: "lowest-fixed",
      value: benchmarks.fixed.lowestPosted,
      color: WEEKLY_LOWEST_FIXED_COLOR,
      name: "Lowest 5-yr fixed",
    },
    {
      id: "big5-variable",
      value: benchmarks.variable.big5PostedMedian,
      color: WEEKLY_VARIABLE_COLOR,
      name: "Big-5 5-yr variable",
    },
    {
      id: "lowest-variable",
      value: benchmarks.variable.lowestPosted,
      color: WEEKLY_LOWEST_VARIABLE_COLOR,
      name: "Lowest 5-yr variable",
    },
  ];

  for (const guide of guides) {
    if (guide.value == null || !Number.isFinite(guide.value)) continue;
    items.push({
      id: guide.id,
      label: `${guide.name} ${formatRate(guide.value)}`,
      color: guide.color,
      style: "dashed",
      value: guide.value,
    });
  }

  return items;
}

const MARKER_SPECS: MarkerLegendItem[] = [
  { id: "median", label: "Reported median", color: MARKER_REPORTED_COLOR, shape: "circle" },
  { id: "lowest", label: "Lowest posted", color: MARKER_LOWEST_COLOR, shape: "diamond" },
  { id: "big5", label: "Big-5 posted median", color: MARKER_BIG5_COLOR, shape: "circle" },
];

export function dumbbellLegendItems(
  products: Array<Pick<ProductCell, "median" | "lowestPosted" | "big5PostedMedian">>,
): MarkerLegendItem[] {
  const drawn = {
    median: products.some((product) => Number.isFinite(product.median)),
    lowest: products.some((product) => product.lowestPosted != null && Number.isFinite(product.lowestPosted)),
    big5: products.some((product) => product.big5PostedMedian != null && Number.isFinite(product.big5PostedMedian)),
  };
  return MARKER_SPECS.filter((item) => drawn[item.id]);
}
