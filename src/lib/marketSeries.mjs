/**
 * Pure parsers for Bank of Canada Valet payloads.
 * Used by the refresh script (plain Node) and by the Astro build.
 */

export const BOND_SERIES = "BD.CDN.5YR.DQ.YLD";
export const POLICY_SERIES = "V39079";

export const BOND_URL = `https://www.bankofcanada.ca/valet/observations/${BOND_SERIES}/json?recent=280`;
export const POLICY_URL = `https://www.bankofcanada.ca/valet/observations/${POLICY_SERIES}/json?start_date=2022-01-01`;

function seriesObservations(payload, series) {
  const rows = Array.isArray(payload?.observations) ? payload.observations : [];
  const parsed = [];
  for (const row of rows) {
    const date = typeof row?.d === "string" ? row.d : "";
    const raw = row?.[series]?.v;
    const value = typeof raw === "number" ? raw : Number(raw);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(value)) continue;
    parsed.push({ date, value });
  }
  parsed.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return parsed;
}

export function parseBondYieldPayload(payload) {
  const detail = payload?.seriesDetail?.[BOND_SERIES] ?? {};
  const observations = seriesObservations(payload, BOND_SERIES).map((row) => ({
    date: row.date,
    yield: row.value,
  }));
  return {
    series: BOND_SERIES,
    label: detail.label || "Benchmark bond yield, 5-year",
    description: detail.description || "The yield on the Government of Canada 5-year benchmark bond.",
    source: `https://www.bankofcanada.ca/valet/observations/${BOND_SERIES}/json`,
    observations,
  };
}

/** Keep the first print in the window, then each business day the target changes. */
export function parsePolicyPayload(payload) {
  const detail = payload?.seriesDetail?.[POLICY_SERIES] ?? {};
  const observations = seriesObservations(payload, POLICY_SERIES);
  const changes = [];
  let previous = null;
  for (const row of observations) {
    if (previous == null || row.value !== previous) {
      changes.push({ date: row.date, rate: row.value });
      previous = row.value;
    }
  }
  const last = observations.length ? observations[observations.length - 1] : null;
  return {
    series: POLICY_SERIES,
    label: detail.label || "Target for the overnight rate",
    description:
      detail.description ||
      "The Bank of Canada target for the overnight rate, also called the policy interest rate.",
    source: `https://www.bankofcanada.ca/valet/observations/${POLICY_SERIES}/json?start_date=2022-01-01`,
    observationsThrough: last ? last.date : null,
    changes,
  };
}

export function latestBondYield(series) {
  const rows = series?.observations ?? [];
  return rows.length ? rows[rows.length - 1] : null;
}

/** Last observation in each calendar month, oldest first. */
export function monthEndYields(observations) {
  const byMonth = new Map();
  for (const row of observations ?? []) {
    byMonth.set(row.date.slice(0, 7), row);
  }
  return [...byMonth.values()];
}
