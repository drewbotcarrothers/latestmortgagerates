import BankGapChart, { type BankGapRow } from "@/components/community/BankGapChart";
import DumbbellChart from "@/components/community/DumbbellChart";
import { communityRates, formatRate, lenderName, productLabel, roundToNickel } from "@/lib/communityRates";
import {
  PUBLIC_CELL_MIN_N,
  novemberBankGaps,
  novemberBanksWithoutPosted,
  novemberChartProducts,
} from "@/lib/november2026Report";

const BANK_CAPTION = `October 2026. The navy dot is that bank's posted rate, the median of its daily posted rate from October 3 through October 31. The teal dot is the median rate ${communityRates.attribution} from that bank. All insured statuses are combined. Variable rows span the October 29 prime change, from 4.45% to 4.70%. Rows are shown only when N is at least ${PUBLIC_CELL_MIN_N}.`;

export default function NovemberReportCharts() {
  const rows: BankGapRow[] = novemberBankGaps().map((row) => ({
    lenderSlug: row.slug,
    product: {
      termMonths: row.termMonths,
      rateType: row.rateType,
      n: row.n,
      reportedMedian: row.reportedMedian,
      postedRate: row.postedRate,
      spreadVsPosted: roundToNickel((row.postedRate as number) - row.reportedMedian),
      rates: [],
    },
  }));
  const missing = novemberBanksWithoutPosted();

  return (
    <>
      <h2 className="text-xl font-semibold text-slate-900">Reported rates versus posted rates</h2>
      <p className="text-sm text-slate-600">
        October 1–31, 2026. Posted benchmarks are medians of the daily snapshots from October 3–31.
        Each row prints N. Cells with N under {PUBLIC_CELL_MIN_N} are omitted. The insured 3-year fixed
        row has no Big-5 dot.
      </p>
      <DumbbellChart products={novemberChartProducts()} />
      <h2 className="text-xl font-semibold text-slate-900">By big bank</h2>
      <BankGapChart rows={rows} caption={BANK_CAPTION} />
      {missing.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
          {missing.map((row) => (
            <li key={`${row.slug}-${row.termMonths}-${row.rateType}`}>
              {lenderName(row.slug)} {productLabel({ termMonths: row.termMonths, rateType: row.rateType })}: reported
              median {formatRate(row.reportedMedian)} (N = {row.n}). No posted rate in the October snapshots, so the gap
              is left off the chart.
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
