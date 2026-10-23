import { roundToNickel, type LenderBlock, type LenderProduct } from "./communityRates";

export const DISCOUNT_MIN_N = 10;

export interface DiscountCell {
  n: number;
  reportedMedian: number;
  postedRate: number;
  /** Posted minus reported median, rounded to the nearest 0.05. Positive means below posted. */
  pointsBelow: number;
}

export interface DiscountLenderRow {
  slug: string;
  name: string;
  fixed: DiscountCell | null;
  variable: DiscountCell | null;
  /** N is large enough but the file has no posted rate, so the gap is not published. */
  omitted: { rateType: "fixed" | "variable"; n: number }[];
}

export function quarterLabel(iso: string): string {
  const year = iso.slice(0, 4);
  const month = Number(iso.slice(5, 7));
  const quarter = Math.ceil(month / 3);
  return `Q${quarter} ${year}`;
}

function cellFor(products: readonly LenderProduct[], rateType: "fixed" | "variable"): LenderProduct | undefined {
  return products.find((product) => product.termMonths === 60 && product.rateType === rateType);
}

function publishCell(product: LenderProduct | undefined): DiscountCell | null {
  if (!product || product.n < DISCOUNT_MIN_N || product.postedRate == null) return null;
  const pointsBelow = roundToNickel(product.postedRate - product.reportedMedian);
  return {
    n: product.n,
    reportedMedian: product.reportedMedian,
    postedRate: product.postedRate,
    pointsBelow,
  };
}

export function discountRows(
  lenders: readonly LenderBlock[],
  names: Record<string, string>,
): DiscountLenderRow[] {
  const rows: DiscountLenderRow[] = [];
  for (const lender of lenders) {
    const fixedProduct = cellFor(lender.products, "fixed");
    const variableProduct = cellFor(lender.products, "variable");
    const fixed = publishCell(fixedProduct);
    const variable = publishCell(variableProduct);
    const omitted: DiscountLenderRow["omitted"] = [];
    if (fixedProduct && fixedProduct.n >= DISCOUNT_MIN_N && fixed == null) {
      omitted.push({ rateType: "fixed", n: fixedProduct.n });
    }
    if (variableProduct && variableProduct.n >= DISCOUNT_MIN_N && variable == null) {
      omitted.push({ rateType: "variable", n: variableProduct.n });
    }
    if (!fixed && !variable && omitted.length === 0) continue;
    rows.push({
      slug: lender.slug,
      name: names[lender.slug] ?? lender.slug,
      fixed,
      variable,
      omitted,
    });
  }
  return rows.sort((a, b) => widest(b) - widest(a));
}

function widest(row: DiscountLenderRow): number {
  return Math.max(row.fixed?.pointsBelow ?? -Infinity, row.variable?.pointsBelow ?? -Infinity);
}

export function widestPublishedGap(rows: readonly DiscountLenderRow[]): {
  row: DiscountLenderRow;
  rateType: "fixed" | "variable";
  cell: DiscountCell;
} | null {
  let best: { row: DiscountLenderRow; rateType: "fixed" | "variable"; cell: DiscountCell } | null = null;
  for (const row of rows) {
    for (const rateType of ["fixed", "variable"] as const) {
      const cell = row[rateType];
      if (!cell) continue;
      if (!best || cell.pointsBelow > best.cell.pointsBelow) best = { row, rateType, cell };
    }
  }
  return best;
}
