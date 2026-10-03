import {
  binRates,
  distributionFor,
  formatRate,
  lenderName,
  type Distribution,
} from "@/lib/communityRates";

const TEAL = "#0f766e";
const NAVY = "#0f172a";
const AMBER = "#c2410c";

export default function DistributionChart() {
  const fixed = distributionFor(60, "fixed", "all");
  const variable = distributionFor(60, "variable", "all");
  if (!fixed || !variable) return null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Panel distribution={fixed} title="5-year fixed" />
      <Panel distribution={variable} title="5-year variable" />
    </div>
  );
}

function Panel({ distribution, title }: { distribution: Distribution; title: string }) {
  const bins = binRates(distribution.rates, 0.1);
  const width = 560;
  const height = 280;
  const pad = { l: 44, r: 12, t: 16, b: 32 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const xMin = Math.floor(distribution.min * 2) / 2;
  const xMax = Math.ceil(distribution.max * 2) / 2;
  const maxCount = Math.max(...bins.map((bin) => bin.count), 1);
  const x = (value: number) => pad.l + ((value - xMin) / (xMax - xMin)) * plotW;
  const y = (count: number) => pad.t + plotH - (count / maxCount) * plotH;
  const share = distribution.shareBelowBig5 == null ? null : Math.round(distribution.shareBelowBig5 * 100);
  const summary = `${title}, N = ${distribution.n}. Reported median ${formatRate(distribution.median)}. ${
    share != null && distribution.big5PostedMedian != null
      ? `${share}% of reports are below the Big-5 posted median of ${formatRate(distribution.big5PostedMedian)}.`
      : ""
  }`;

  const markers = [
    distribution.lowestPosted != null
      ? { value: distribution.lowestPosted, color: AMBER, label: "Lowest posted" }
      : null,
    { value: distribution.median, color: TEAL, label: "Reported median" },
    distribution.big5PostedMedian != null
      ? { value: distribution.big5PostedMedian, color: NAVY, label: "Big-5 posted median" }
      : null,
  ].filter((marker): marker is { value: number; color: string; label: string } => marker != null);

  return (
    <figure className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500">N = {distribution.n}</p>
      </div>
      <p className="mb-3 text-sm text-slate-600">{summary}</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={summary}>
        <title>{title} reported rates</title>
        <desc>{summary}</desc>
        {bins.map((bin) => {
          const barX = x(bin.start);
          const barW = Math.max(1, x(bin.end) - x(bin.start) - 2);
          const barY = y(bin.count);
          const barH = pad.t + plotH - barY;
          return (
            <rect key={`${bin.start}`} x={barX} y={barY} width={barW} height={barH} rx={2} fill={TEAL} opacity={0.85}>
              <title>{`${bin.start.toFixed(2)}% to ${bin.end.toFixed(2)}%: ${bin.count} reports`}</title>
            </rect>
          );
        })}
        {markers.map((marker) => (
          <line
            key={marker.label}
            x1={x(marker.value)}
            x2={x(marker.value)}
            y1={pad.t}
            y2={pad.t + plotH}
            stroke={marker.color}
            strokeWidth={marker.label === "Reported median" ? 2 : 1.5}
            strokeDasharray={marker.label === "Reported median" ? undefined : "4 3"}
          />
        ))}
        {[xMin, (xMin + xMax) / 2, xMax].map((tick) => (
          <text key={tick} x={x(tick)} y={height - 10} textAnchor="middle" fontSize={11} fill="#64748b">
            {tick.toFixed(1)}%
          </text>
        ))}
        <text
          x={12}
          y={pad.t + plotH / 2}
          fontSize={11}
          fill="#64748b"
          textAnchor="middle"
          transform={`rotate(-90 12 ${pad.t + plotH / 2})`}
        >
          Reports
        </text>
      </svg>
      <ul className="mt-2 space-y-1 text-xs text-slate-600">
        <li>Reported median {formatRate(distribution.median)}</li>
        <li>
          Lowest posted {formatRate(distribution.lowestPosted)}
          {distribution.lowestPostedLender ? ` (${lenderName(distribution.lowestPostedLender)})` : ""}
        </li>
        <li>Big-5 posted median {formatRate(distribution.big5PostedMedian)}</li>
      </ul>
    </figure>
  );
}
