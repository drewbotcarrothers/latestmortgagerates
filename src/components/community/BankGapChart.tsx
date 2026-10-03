import {
  CHART_MIN_N,
  PUBLIC_MIN_N,
  communityRates,
  formatRate,
  formatSpread,
  lenderName,
  omittedForMissingPosted,
  termLabel,
  type LenderProduct,
} from "@/lib/communityRates";

const NAVY = "#0f172a";
const TEAL = "#0f766e";

export interface BankGapRow {
  lenderSlug: string;
  product: LenderProduct;
}

export function bankGapRows(): BankGapRow[] {
  const rows: BankGapRow[] = [];
  for (const lender of communityRates.lenders) {
    for (const product of lender.products) {
      if (product.n >= CHART_MIN_N && product.postedRate != null) {
        rows.push({ lenderSlug: lender.slug, product });
      }
    }
  }
  return rows.sort((a, b) => {
    const bank = communityRates.lenders.findIndex((lender) => lender.slug === a.lenderSlug)
      - communityRates.lenders.findIndex((lender) => lender.slug === b.lenderSlug);
    if (bank !== 0) return bank;
    if (a.product.termMonths !== b.product.termMonths) return b.product.termMonths - a.product.termMonths;
    return a.product.rateType === b.product.rateType ? 0 : a.product.rateType === "fixed" ? -1 : 1;
  });
}

export function omittedPostedNotes(): string[] {
  const notes: string[] = [];
  for (const lender of communityRates.lenders) {
    for (const product of omittedForMissingPosted(lender)) {
      notes.push(
        `${lenderName(lender.slug)} ${termLabel(product.termMonths)} ${product.rateType} (N = ${product.n}) has no posted rate in this snapshot.`,
      );
    }
  }
  return notes;
}

export default function BankGapChart({ rows = bankGapRows() }: { rows?: BankGapRow[] }) {
  if (rows.length === 0) return null;
  const values = rows.flatMap((row) => [row.product.reportedMedian, row.product.postedRate as number]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const domainMin = Math.floor((min - 0.2) * 4) / 4;
  const domainMax = Math.ceil((max + 0.2) * 4) / 4;
  const x = (value: number) => ((value - domainMin) / (domainMax - domainMin)) * 560 + 16;

  return (
    <figure>
      <figcaption className="mb-3 text-sm text-slate-600">
        The bank&apos;s own posted rate (uninsured product in the current snapshot) versus the median rate {communityRates.attribution} from that bank. All insured statuses are combined.
      </figcaption>
      <ul className="mb-4 flex flex-wrap gap-4 text-xs font-medium text-slate-700" aria-hidden="true">
        <li className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full" style={{ background: TEAL }} /> Reported median</li>
        <li className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full" style={{ background: NAVY }} /> Bank posted rate</li>
      </ul>
      <div className="space-y-4">
        {rows.map(({ lenderSlug, product }) => {
          const small = product.n < PUBLIC_MIN_N;
          const name = `${lenderName(lenderSlug)} · ${termLabel(product.termMonths)} ${product.rateType}`;
          const posted = product.postedRate as number;
          const description = `${name}, N = ${product.n}${small ? ", small sample" : ""}. Reported median ${formatRate(product.reportedMedian)}. Posted ${formatRate(posted)}. Reported median is ${formatSpread(product.spreadVsPosted)} the posted rate.`;
          return (
            <div key={`${lenderSlug}-${product.termMonths}-${product.rateType}`}>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(12rem,16rem)_1fr] sm:items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-500">N = {product.n}{small ? " · small sample" : ""}</p>
                </div>
                <div className="overflow-x-auto">
                  <svg viewBox="0 0 600 64" className="h-16 min-w-[480px] w-full" role="img" aria-label={description}>
                    <title>{name}</title>
                    <desc>{description}</desc>
                    <line x1={x(domainMin)} x2={x(domainMax)} y1={32} y2={32} stroke="#e2e8f0" strokeWidth={8} strokeLinecap="round" />
                    <line x1={x(Math.min(product.reportedMedian, posted))} x2={x(Math.max(product.reportedMedian, posted))} y1={32} y2={32} stroke="#cbd5e1" strokeWidth={3} />
                    <circle cx={x(posted)} cy={32} r={7} fill={NAVY} />
                    <circle cx={x(product.reportedMedian)} cy={32} r={7} fill={TEAL} />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-slate-600 sm:pl-[16rem]">
                Reported {formatRate(product.reportedMedian)} · posted {formatRate(posted)} · {formatSpread(product.spreadVsPosted)} posted
              </p>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Rows with N under {PUBLIC_MIN_N} are labeled small sample. Comparisons without a posted rate in the snapshot are left off the chart.
      </p>
    </figure>
  );
}
