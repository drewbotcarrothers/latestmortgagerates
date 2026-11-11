import {
  CHART_MIN_N,
  PUBLIC_MIN_N,
  formatRate,
  formatSpread,
  lenderName,
  productLabel,
  type ProductCell,
} from "@/lib/communityRates";
import { frameRateChart, layoutRateLabels, type RatePointLabel } from "@/lib/rateChartLabels";
import ChartRateLabel, { useRateLabelFont } from "@/components/community/ChartRateLabel";
import {
  MARKER_RADIUS,
  MARKER_STROKE,
  diamondPoints,
  dumbbellLegendItems,
  type MarkerLegendItem,
} from "@/lib/chartLegend";

const CHART_W = 640;
const PLOT_LEFT = 42;
const PLOT_WIDTH = 556;
const LINE_Y = 56;

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

  const x = (value: number) => PLOT_LEFT + ((value - domainMin) / (domainMax - domainMin)) * PLOT_WIDTH;
  const { ref: chartRef, fontSize } = useRateLabelFont(CHART_W);
  const legend = dumbbellLegendItems(products);
  const legendById = new Map(legend.map((item) => [item.id, item]));

  return (
    <figure>
      <figcaption className="mb-3 text-sm text-slate-600">
        Each row runs from the rate borrowers report to the Big-5 posted median. A hollow diamond is the lowest posted rate from any lender in the snapshot.
      </figcaption>
      <ul className="mb-4 flex flex-wrap gap-4 text-xs font-medium text-slate-700" aria-label="Chart legend">
        {legend.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <MarkerSwatch item={item} />
            {item.label}
          </li>
        ))}
      </ul>
      <div className="space-y-4">
        {products.map((product, index) => {
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
          const markers: Array<RatePointLabel & { tooltip: string; shape: "circle" | "diamond" }> = [];
          const big5 = legendById.get("big5");
          const lowest = legendById.get("lowest");
          const median = legendById.get("median");
          if (big5 && product.big5PostedMedian != null) {
            markers.push({
              id: "big5",
              x: x(product.big5PostedMedian),
              text: formatRate(product.big5PostedMedian),
              color: big5.color,
              side: "above",
              shape: big5.shape,
              tooltip: `${big5.label} ${formatRate(product.big5PostedMedian)}`,
            });
          }
          if (lowest && product.lowestPosted != null) {
            markers.push({
              id: "lowest",
              x: x(product.lowestPosted),
              text: formatRate(product.lowestPosted),
              color: lowest.color,
              side: "above",
              shape: lowest.shape,
              tooltip: `${lowest.label} ${formatRate(product.lowestPosted)}${product.lowestPostedLender ? ` at ${lenderName(product.lowestPostedLender)}` : ""}`,
            });
          }
          if (median) {
            markers.push({
              id: "median",
              x: x(product.median),
              text: formatRate(product.median),
              color: median.color,
              side: "below",
              shape: median.shape,
              tooltip: `${median.label} ${formatRate(product.median)}`,
            });
          }
          const frame = frameRateChart(
            layoutRateLabels(markers, { lineY: LINE_Y, fontSize, minX: 6, maxX: CHART_W - 6 }),
            LINE_Y,
          );
          const lineY = frame.lineY;
          return (
            <div key={`${product.termMonths}-${product.rateType}-${product.insured}`} className="grid grid-cols-1 gap-1 sm:grid-cols-[minmax(11rem,15rem)_1fr] sm:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-900">{label}</p>
                <p className="text-xs text-slate-500">
                  N = {product.n}
                  {small ? " · small sample" : ""}
                </p>
              </div>
              <div ref={index === 0 ? chartRef : undefined} className="overflow-x-auto">
                <svg
                  viewBox={`0 0 ${CHART_W} ${frame.height}`}
                  className="h-auto w-full"
                  role="img"
                  aria-label={description}
                >
                  <title>{label}</title>
                  <desc>{description}</desc>
                  <line x1={x(domainMin)} x2={x(domainMax)} y1={lineY} y2={lineY} stroke="#e2e8f0" strokeWidth={8} strokeLinecap="round" />
                  {points.length > 1 && (
                    <line
                      x1={x(Math.min(...points))}
                      x2={x(Math.max(...points))}
                      y1={lineY}
                      y2={lineY}
                      stroke="#cbd5e1"
                      strokeWidth={3}
                    />
                  )}
                  {markers.map((marker) => (
                    <g key={marker.id}>
                      <title>{marker.tooltip}</title>
                      {marker.shape === "diamond" ? (
                        <polygon points={diamondPoints(marker.x, lineY, MARKER_RADIUS)} fill="#fff" stroke={marker.color} strokeWidth={MARKER_STROKE} />
                      ) : (
                        <circle cx={marker.x} cy={lineY} r={MARKER_RADIUS} fill={marker.color} />
                      )}
                    </g>
                  ))}
                  {frame.labels.map((rateLabel) => (
                    <ChartRateLabel key={rateLabel.id} label={rateLabel} />
                  ))}
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

function MarkerSwatch({ item }: { item: MarkerLegendItem }) {
  const size = MARKER_RADIUS * 2 + MARKER_STROKE * 2;
  const center = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" focusable="false" className="shrink-0">
      {item.shape === "diamond" ? (
        <polygon points={diamondPoints(center, center, MARKER_RADIUS)} fill="#fff" stroke={item.color} strokeWidth={MARKER_STROKE} />
      ) : (
        <circle cx={center} cy={center} r={MARKER_RADIUS} fill={item.color} />
      )}
    </svg>
  );
}
