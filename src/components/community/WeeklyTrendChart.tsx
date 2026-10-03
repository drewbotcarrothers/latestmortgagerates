import {
  CHART_MIN_N,
  communityRates,
  formatRate,
  formatWeekLabel,
  lenderName,
} from "@/lib/communityRates";

const NAVY = "#0f172a";
const TEAL = "#0f766e";

export default function WeeklyTrendChart() {
  const { weeks, benchmarks } = communityRates.weekly;
  const plotted = weeks.filter((week) => week.fixed.n >= CHART_MIN_N || week.variable.n >= CHART_MIN_N);
  if (plotted.length === 0) return null;

  const seriesValues = plotted.flatMap((week) =>
    [week.fixed, week.variable]
      .filter((series) => series.n >= CHART_MIN_N && series.median != null)
      .map((series) => series.median as number),
  );
  const benchmarkValues = [
    benchmarks.fixed.big5PostedMedian,
    benchmarks.fixed.lowestPosted,
    benchmarks.variable.big5PostedMedian,
    benchmarks.variable.lowestPosted,
  ].filter((value): value is number => value != null);
  const min = Math.min(...seriesValues, ...benchmarkValues);
  const max = Math.max(...seriesValues, ...benchmarkValues);
  const yMin = Math.floor((min - 0.15) * 4) / 4;
  const yMax = Math.ceil((max + 0.2) * 4) / 4;

  const width = 720;
  const height = 320;
  const pad = { l: 58, r: 16, t: 16, b: 42 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const x = (index: number) => pad.l + (plotted.length === 1 ? plotW / 2 : (index / (plotted.length - 1)) * plotW);
  const y = (value: number) => pad.t + ((yMax - value) / (yMax - yMin)) * plotH;

  const pathFor = (kind: "fixed" | "variable") => {
    let d = "";
    let open = false;
    plotted.forEach((week, index) => {
      const series = week[kind];
      if (series.n < CHART_MIN_N || series.median == null) {
        open = false;
        return;
      }
      d += `${open ? "L" : "M"} ${x(index).toFixed(1)} ${y(series.median).toFixed(1)} `;
      open = true;
    });
    return d.trim();
  };

  const yTicks: number[] = [];
  for (let tick = yMin; tick <= yMax + 0.001; tick += 0.25) {
    yTicks.push(Math.round(tick * 100) / 100);
  }

  const guides = [
    { value: benchmarks.fixed.big5PostedMedian, color: NAVY, label: `Big-5 5-yr fixed ${formatRate(benchmarks.fixed.big5PostedMedian)}` },
    { value: benchmarks.fixed.lowestPosted, color: "#c2410c", label: `Lowest 5-yr fixed ${formatRate(benchmarks.fixed.lowestPosted)}` },
    { value: benchmarks.variable.big5PostedMedian, color: TEAL, label: `Big-5 5-yr variable ${formatRate(benchmarks.variable.big5PostedMedian)}` },
    { value: benchmarks.variable.lowestPosted, color: "#0e7490", label: `Lowest 5-yr variable ${formatRate(benchmarks.variable.lowestPosted)}` },
  ].filter((guide) => guide.value != null);

  const caption = `Weekly median of 5-year rates ${communityRates.attribution}, weeks with N at least ${CHART_MIN_N}. ${communityRates.weekly.from} to ${communityRates.weekly.to}.`;

  return (
    <figure>
      <figcaption className="mb-3 text-sm text-slate-600">{caption}</figcaption>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto min-w-[640px] w-full" role="img" aria-label={caption}>
          <title>Weekly reported 5-year rates</title>
          <desc>{caption}</desc>
          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={pad.l} x2={width - pad.r} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" />
              <text x={pad.l - 8} y={y(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">
                {tick.toFixed(2)}%
              </text>
            </g>
          ))}
          {guides.map((guide) => (
            <line
              key={guide.label}
              x1={pad.l}
              x2={width - pad.r}
              y1={y(guide.value as number)}
              y2={y(guide.value as number)}
              stroke={guide.color}
              strokeDasharray="5 4"
              strokeWidth={1.25}
            />
          ))}
          <path d={pathFor("fixed")} fill="none" stroke={NAVY} strokeWidth={2.5} />
          <path d={pathFor("variable")} fill="none" stroke={TEAL} strokeWidth={2.5} />
          {plotted.map((week, index) => (
            <g key={week.weekStarting}>
              {week.fixed.n >= CHART_MIN_N && week.fixed.median != null && (
                <circle cx={x(index)} cy={y(week.fixed.median)} r={4} fill={NAVY}>
                  <title>{`${formatWeekLabel(week.weekStarting)} 5-year fixed median ${formatRate(week.fixed.median)}, N = ${week.fixed.n}`}</title>
                </circle>
              )}
              {week.variable.n >= CHART_MIN_N && week.variable.median != null && (
                <circle cx={x(index)} cy={y(week.variable.median)} r={4} fill={TEAL}>
                  <title>{`${formatWeekLabel(week.weekStarting)} 5-year variable median ${formatRate(week.variable.median)}, N = ${week.variable.n}`}</title>
                </circle>
              )}
              <text x={x(index)} y={height - 16} textAnchor="middle" fontSize={11} fill="#64748b">
                {formatWeekLabel(week.weekStarting)}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-1 text-xs text-slate-700 sm:grid-cols-2">
        <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-6 rounded" style={{ background: NAVY }} /> 5-year fixed reported median</li>
        <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-6 rounded" style={{ background: TEAL }} /> 5-year variable reported median</li>
        {guides.map((guide) => (
          <li key={guide.label} className="flex items-center gap-2">
            <span className="inline-block h-0.5 w-6" style={{ background: guide.color }} />
            {guide.label}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-slate-500">
        Dashed lines are today&apos;s posted benchmarks for 5-year products across insured statuses
        {benchmarks.fixed.lowestPostedLender ? ` (lowest fixed: ${lenderName(benchmarks.fixed.lowestPostedLender)}` : ""}
        {benchmarks.variable.lowestPostedLender ? `; lowest variable: ${lenderName(benchmarks.variable.lowestPostedLender)})` : ""}.
        Weeks under N = {CHART_MIN_N} are left off the line.
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 pr-3">Week starting</th>
              <th className="py-2 pr-3">5-year fixed median</th>
              <th className="py-2 pr-3">Fixed N</th>
              <th className="py-2 pr-3">5-year variable median</th>
              <th className="py-2">Variable N</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week.weekStarting} className="border-b border-slate-100">
                <td className="py-2 pr-3">{formatWeekLabel(week.weekStarting)}</td>
                <td className="py-2 pr-3">{week.fixed.n >= CHART_MIN_N ? formatRate(week.fixed.median) : "—"}</td>
                <td className="py-2 pr-3">{week.fixed.n}{week.fixed.n < CHART_MIN_N ? " (hidden)" : ""}</td>
                <td className="py-2 pr-3">{week.variable.n >= CHART_MIN_N ? formatRate(week.variable.median) : "—"}</td>
                <td className="py-2">{week.variable.n}{week.variable.n < CHART_MIN_N ? " (hidden)" : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
