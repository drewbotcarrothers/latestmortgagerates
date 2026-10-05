import {
  CHART_MIN_N,
  communityRates,
  formatRate,
  formatWeekLabel,
  lenderName,
} from "@/lib/communityRates";
import {
  WEEKLY_DASHARRAY,
  WEEKLY_DASHED_WIDTH,
  WEEKLY_SOLID_WIDTH,
  weekSeriesDrawn,
  weeklyLegendItems,
} from "@/lib/chartLegend";

function LineSwatch({ color, dashed }: { color: string; dashed: boolean }) {
  return (
    <svg width="28" height="14" viewBox="0 0 28 14" aria-hidden="true" focusable="false" className="shrink-0">
      <line
        x1="1"
        y1="7"
        x2="27"
        y2="7"
        stroke={color}
        strokeWidth={dashed ? WEEKLY_DASHED_WIDTH : WEEKLY_SOLID_WIDTH}
        strokeDasharray={dashed ? WEEKLY_DASHARRAY : undefined}
      />
      {!dashed && <circle cx="14" cy="7" r="3" fill={color} />}
    </svg>
  );
}

export default function WeeklyTrendChart() {
  const { weeks, benchmarks } = communityRates.weekly;
  const legend = weeklyLegendItems(weeks, benchmarks);
  const plotted = weeks.filter((week) => weekSeriesDrawn(week.fixed) || weekSeriesDrawn(week.variable));
  if (plotted.length === 0 || legend.length === 0) return null;

  const guides = legend.filter((item): item is typeof item & { value: number } => item.style === "dashed" && item.value != null);
  const fixedItem = legend.find((item) => item.id === "fixed-median");
  const variableItem = legend.find((item) => item.id === "variable-median");

  const seriesValues = plotted.flatMap((week) =>
    [week.fixed, week.variable]
      .filter((series) => weekSeriesDrawn(series))
      .map((series) => series.median as number),
  );
  const benchmarkValues = guides.map((guide) => guide.value);
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
      if (!weekSeriesDrawn(series)) {
        open = false;
        return;
      }
      d += `${open ? "L" : "M"} ${x(index).toFixed(1)} ${y(series.median as number).toFixed(1)} `;
      open = true;
    });
    return d.trim();
  };

  const yTicks: number[] = [];
  for (let tick = yMin; tick <= yMax + 0.001; tick += 0.25) {
    yTicks.push(Math.round(tick * 100) / 100);
  }

  const caption = `Weekly median of 5-year rates ${communityRates.attribution}, weeks with N at least ${CHART_MIN_N}. ${communityRates.weekly.from} to ${communityRates.weekly.to}.`;
  const described = `${caption} Series: ${legend.map((item) => item.label).join(", ")}.`;

  return (
    <figure>
      <figcaption className="mb-3 text-sm text-slate-600">{caption}</figcaption>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto min-w-[640px] w-full" role="img" aria-label={described}>
          <title>Weekly reported 5-year rates</title>
          <desc>{described}</desc>
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
              key={guide.id}
              x1={pad.l}
              x2={width - pad.r}
              y1={y(guide.value)}
              y2={y(guide.value)}
              stroke={guide.color}
              strokeDasharray={WEEKLY_DASHARRAY}
              strokeWidth={WEEKLY_DASHED_WIDTH}
            >
              <title>{guide.label}</title>
            </line>
          ))}
          {fixedItem && (
            <path d={pathFor("fixed")} fill="none" stroke={fixedItem.color} strokeWidth={WEEKLY_SOLID_WIDTH}>
              <title>{fixedItem.label}</title>
            </path>
          )}
          {variableItem && (
            <path d={pathFor("variable")} fill="none" stroke={variableItem.color} strokeWidth={WEEKLY_SOLID_WIDTH}>
              <title>{variableItem.label}</title>
            </path>
          )}
          {plotted.map((week, index) => (
            <g key={week.weekStarting}>
              {fixedItem && weekSeriesDrawn(week.fixed) && (
                <circle cx={x(index)} cy={y(week.fixed.median as number)} r={4} fill={fixedItem.color}>
                  <title>{`${formatWeekLabel(week.weekStarting)} ${fixedItem.label} ${formatRate(week.fixed.median)}, N = ${week.fixed.n}`}</title>
                </circle>
              )}
              {variableItem && weekSeriesDrawn(week.variable) && (
                <circle cx={x(index)} cy={y(week.variable.median as number)} r={4} fill={variableItem.color}>
                  <title>{`${formatWeekLabel(week.weekStarting)} ${variableItem.label} ${formatRate(week.variable.median)}, N = ${week.variable.n}`}</title>
                </circle>
              )}
              <text x={x(index)} y={height - 16} textAnchor="middle" fontSize={11} fill="#64748b">
                {formatWeekLabel(week.weekStarting)}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-1 text-xs text-slate-700 sm:grid-cols-2" aria-label="Chart legend">
        {legend.map((item) => (
          <li key={item.id} className="flex items-center gap-2">
            <LineSwatch color={item.color} dashed={item.style === "dashed"} />
            {item.label}
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
