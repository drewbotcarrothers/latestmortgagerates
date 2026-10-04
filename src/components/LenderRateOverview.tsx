import {
  buildRateOverview,
  formatPostedRate,
  labelButlerRatesInsured,
  overviewRates,
  type LenderRate,
  type OverviewRow,
} from "@/lib/lenderOverview";

function RateCell({
  rate,
  best,
  showSpread,
}: {
  rate?: LenderRate;
  best: number;
  showSpread?: boolean;
}) {
  if (!rate) {
    return <span className="text-slate-300">—</span>;
  }
  const posted = showSpread ? null : formatPostedRate(rate.posted_rate);
  return (
    <div
      data-overview-rate={rate.rate.toFixed(2)}
      data-mortgage-type={rate.mortgage_type || "unstated"}
    >
      <span className={`font-bold text-lg ${rate.rate === best ? "text-emerald-600" : "text-slate-700"}`}>
        {rate.rate.toFixed(2)}%
      </span>
      {posted ? <span className="block text-xs text-slate-400 line-through">{posted}</span> : null}
      {showSpread && rate.spread_to_prime ? (
        <span className="block text-xs text-teal-600">{rate.spread_to_prime}</span>
      ) : null}
    </div>
  );
}

function cellsFor(row: OverviewRow, showFixedUnstated: boolean, showVariableUnstated: boolean) {
  const cells: { key: string; rate?: LenderRate; showSpread?: boolean }[] = [
    { key: "fixed-insured", rate: row.fixedInsured },
    { key: "fixed-uninsured", rate: row.fixedUninsured },
  ];
  if (showFixedUnstated) cells.push({ key: "fixed-unstated", rate: row.fixedUnstated });
  cells.push(
    { key: "variable-insured", rate: row.variableInsured, showSpread: true },
    { key: "variable-uninsured", rate: row.variableUninsured, showSpread: true },
  );
  if (showVariableUnstated) cells.push({ key: "variable-unstated", rate: row.variableUnstated, showSpread: true });
  return cells;
}

export default function LenderRateOverview({ rates }: { rates: readonly LenderRate[] }) {
  const prepared = labelButlerRatesInsured(rates);
  const rows = buildRateOverview(prepared);
  const showFixedUnstated = rows.some((row) => row.fixedUnstated);
  const showVariableUnstated = rows.some((row) => row.variableUnstated);

  return (
    <section id="rate-overview" className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Rate Overview</h2>
            <p className="text-slate-500 text-sm mt-1">Best rate for each term and product type</p>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Best
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300"></span> Not offered
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-6 py-3 font-semibold text-slate-700">Term</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-700">Fixed Insured</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-700">Fixed Uninsured</th>
              {showFixedUnstated ? (
                <th className="text-center px-4 py-3 font-semibold text-slate-700">Fixed (not stated)</th>
              ) : null}
              <th className="text-center px-4 py-3 font-semibold text-slate-700">Variable Insured</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-700">Variable Uninsured</th>
              {showVariableUnstated ? (
                <th className="text-center px-4 py-3 font-semibold text-slate-700">Variable (not stated)</th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => {
              const filled = overviewRates(row);
              const best = filled.length > 0 ? Math.min(...filled.map((rate) => rate.rate)) : Infinity;
              return (
                <tr key={row.term} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{row.label}</td>
                  {cellsFor(row, showFixedUnstated, showVariableUnstated).map((cell) => (
                    <td key={cell.key} className="px-4 py-4 text-center">
                      <RateCell rate={cell.rate} best={best} showSpread={cell.showSpread} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
