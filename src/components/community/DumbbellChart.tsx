import {
  CHART_MIN_N,
  PUBLIC_MIN_N,
  formatRate,
  formatSpread,
  lenderName,
  productLabel,
  type ProductCell,
} from "@/lib/communityRates";

const NAVY = "#0f172a";
const TEAL = "#0f766e";
const AMBER = "#c2410c";

function finite(values: Array<number | null | undefined>): number[] {
  return values.filter((value): value is number => typeof value === "number" && Number.isFinite(value));
}

export default function DumbbellChart({ products }: { products: ProductCell[] }) {
  const values = products.flatMap((product) =>
    finite([product.median, product.lowestPosted, product.big5PostedMedian]),
  );
  const min = Math.min(...values);
  const max = Math.max(...values);
  const domainMin = Math.floor((min - 0.2) * 4) / 4;
  const domainMax = Math.ceil((max + 0.2) * 4) / 4;
  const ticks: number[] = [];
  for (let tick = domainMin; tick <= domainMax + 0.001; tick += 0.5) {
    ticks.push(Math.round(tick * 100) / 100);
  }

  const x = (value: number) => ((value - domainMin) / (domainMax - domainMin)) * 600 + 20;

  return (
    <figure>
      <figcaption className="mb-3 text-sm text-slate-600">
        Each row runs from the rate borrowers report to the Big-5 posted median. A hollow diamond is the lowest posted rate from any lender in the snapshot.
      </figcaption>
      <ul className="mb-4 flex flex-wrap gap-4 text-xs font-medium text-slate-700" aria-hidden="true">
        <li className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: TEAL }} />
          Reported median
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rotate-45 border-2 bg-white" style={{ borderColor: AMBER }} />
          Lowest posted
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: NAVY }} />
          Big-5 posted median
        </li>
      </ul>
      <div className="space-y-4">
        {products.map((product) => {
          const points = finite([product.median, product.lowestPosted, product.big5PostedMedian]);
          const label = productLabel(product);
          const small = product.n < PUBLIC_MIN_N;
          const description = [
            `${label}, N = ${product.n}${small ? ", small sample" : ""}.`,
            `Reported median ${formatRate(product.median)}.`,
            product.lowestPosted != null
              ? `Lowest posted ${formatRate(product.lowestPosted)} at ${lenderName(product.lowestPostedLender)}.`
              : "",
            product.big5PostedMedian != null
              ? `Big-5 posted median ${formatRate(product.big5PostedMedian)}, reported median is ${formatSpread(product.spreadVsBig5Median)} it.`
              : "",
          ].join(" ");
          return (
            <div key={`${product.termMonths}-${product.rateType}-${product.insured}`} className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(11rem,15rem)_1fr] sm:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-500">
                  N = {product.n}
                  {small ? " · small sample" : ""}
                </p>
              </div>
              <div className="overflow-x-auto">
                <svg
                  viewBox="0 0 640 72"
                  className="h-[72px] min-w-[520px] w-full"
                  role="img"
                  aria-label={description}
                >
                  <title>{label}</title>
                  <desc>{description}</desc>
                  <line x1={x(domainMin)} x2={x(domainMax)} y1={36} y2={36} stroke="#e2e8f0" strokeWidth={8} strokeLinecap="round" />
                  {points.length > 1 && (
                    <line
                      x1={x(Math.min(...points))}
                      x2={x(Math.max(...points))}
                      y1={36}
                      y2={36}
                      stroke="#cbd5e1"
                      strokeWidth={3}
                    />
                  )}
                  {product.big5PostedMedian != null && (
                    <circle cx={x(product.big5PostedMedian)} cy={36} r={7} fill={NAVY} />
                  )}
                  {product.lowestPosted != null && (
                    <polygon
                      points={diamond(x(product.lowestPosted), 36, 7)}
                      fill="#fff"
                      stroke={AMBER}
                      strokeWidth={2}
                    />
                  )}
                  <circle cx={x(product.median)} cy={36} r={7} fill={TEAL} />
                </svg>
              </div>
              <p className="text-xs leading-relaxed text-slate-600 sm:col-start-2">
                Reported {formatRate(product.median)}
                {product.lowestPosted != null && (
                  <>
                    {" "}· lowest posted {formatRate(product.lowestPosted)} ({lenderName(product.lowestPostedLender)})
                  </>
                )}
                {product.big5PostedMedian != null && (
                  <>
                    {" "}· Big-5 {formatRate(product.big5PostedMedian)} · {formatSpread(product.spreadVsBig5Median)} Big-5
                  </>
                )}
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-slate-500" aria-hidden="true">
        {ticks.map((tick) => (
          <span key={tick}>{tick.toFixed(2)}%</span>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Chart includes cells with N at least {CHART_MIN_N}. Rows under N = {PUBLIC_MIN_N} are labeled small sample and are omitted from the table.
      </p>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-medium text-teal-800">Chart data</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-3">Product</th>
                <th className="py-2 pr-3">N</th>
                <th className="py-2 pr-3">Reported median</th>
                <th className="py-2 pr-3">Lowest posted</th>
                <th className="py-2 pr-3">Big-5 posted median</th>
                <th className="py-2">Vs Big-5</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={`row-${product.termMonths}-${product.rateType}-${product.insured}`} className="border-b border-slate-100">
                  <td className="py-2 pr-3">{productLabel(product)}{product.n < PUBLIC_MIN_N ? " (small sample)" : ""}</td>
                  <td className="py-2 pr-3">{product.n}</td>
                  <td className="py-2 pr-3">{formatRate(product.median)}</td>
                  <td className="py-2 pr-3">{formatRate(product.lowestPosted)}{product.lowestPostedLender ? ` (${lenderName(product.lowestPostedLender)})` : ""}</td>
                  <td className="py-2 pr-3">{formatRate(product.big5PostedMedian)}</td>
                  <td className="py-2">{formatSpread(product.spreadVsBig5Median)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

function diamond(cx: number, cy: number, r: number): string {
  return `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
}
