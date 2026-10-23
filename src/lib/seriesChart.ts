export interface ChartPoint {
  date: string;
  value: number;
}

export interface ChartLine {
  value: number;
  label: string;
  color: string;
}

export interface SeriesChartInput {
  points: ChartPoint[];
  ariaLabel: string;
  /** Step chart holds each value until the next point. A line chart connects them. */
  mode?: "line" | "step";
  lines?: ChartLine[];
  width?: number;
  height?: number;
}

function extent(values: number[]): { min: number; max: number } {
  let min = values[0];
  let max = values[0];
  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  if (min === max) {
    min -= 0.25;
    max += 0.25;
  }
  const pad = (max - min) * 0.12;
  return { min: min - pad, max: max + pad };
}

/** Inline SVG so the chart is in the HTML at build time. */
export function seriesChartSvg(input: SeriesChartInput): string {
  const points = input.points.filter((point) => Number.isFinite(point.value));
  if (points.length === 0) return "";
  const width = input.width ?? 720;
  const height = input.height ?? 280;
  const pad = { left: 46, right: 12, top: 16, bottom: 36 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const lines = input.lines ?? [];
  const { min, max } = extent(points.map((point) => point.value).concat(lines.map((line) => line.value)));
  const xAt = (index: number) =>
    pad.left + (points.length === 1 ? innerW / 2 : (index / (points.length - 1)) * innerW);
  const yAt = (value: number) => pad.top + (1 - (value - min) / (max - min)) * innerH;

  let path = "";
  points.forEach((point, index) => {
    const x = xAt(index).toFixed(1);
    const y = yAt(point.value).toFixed(1);
    if (index === 0) {
      path += `M${x},${y}`;
      return;
    }
    if (input.mode === "step") path += `H${x}V${y}`;
    else path += `L${x},${y}`;
  });

  const ticks = [max, (max + min) / 2, min];
  const tickLines = ticks
    .map((tick) => {
      const y = yAt(tick).toFixed(1);
      const label = tick.toFixed(2);
      return `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="#e2e8f0" stroke-width="1"></line><text x="${pad.left - 6}" y="${Number(y) + 4}" text-anchor="end" font-size="11" fill="#64748b">${label}</text>`;
    })
    .join("");

  const reference = lines
    .map((line) => {
      const y = yAt(line.value).toFixed(1);
      return `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="${line.color}" stroke-width="1.5" stroke-dasharray="4 3"></line><text x="${width - pad.right}" y="${Number(y) - 4}" text-anchor="end" font-size="11" fill="${line.color}">${escapeXml(line.label)}</text>`;
    })
    .join("");

  const first = points[0].date;
  const last = points[points.length - 1].date;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-label="${escapeXml(input.ariaLabel)}"><rect width="${width}" height="${height}" fill="#ffffff"></rect>${tickLines}${reference}<path d="${path}" fill="none" stroke="#0f766e" stroke-width="2"></path><text x="${pad.left}" y="${height - 8}" font-size="11" fill="#64748b">${escapeXml(first)}</text><text x="${width - pad.right}" y="${height - 8}" text-anchor="end" font-size="11" fill="#64748b">${escapeXml(last)}</text></svg>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
