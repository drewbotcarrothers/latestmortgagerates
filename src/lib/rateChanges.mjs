/**
 * Detect published-rate changes between two rate-file snapshots.
 * A product that appears or disappears is not a change: scrape coverage
 * is not a price move. Open terms are ignored.
 */

const MORTGAGE_TYPES = new Set(["insured", "uninsured", "insurable"]);

export function addDays(isoDate, days) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function rowsFromPayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.rates)) return payload.rates;
  return [];
}

function isOpen(row) {
  if (row?.raw_data?.is_open === true) return true;
  const name = `${row?.raw_data?.product || ""} ${row?.raw_data?.term_text || ""}`;
  return /\bopen\b/i.test(name);
}

function isPostedShelf(row) {
  if (row?.raw_data?.section === "posted") return true;
  const name = `${row?.raw_data?.product || ""} ${row?.raw_data?.term_text || ""}`;
  return /posted/i.test(name);
}

function mortgageType(row) {
  return MORTGAGE_TYPES.has(row?.mortgage_type) ? row.mortgage_type : "unspecified";
}

function numeric(value) {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) && number > 0 && number < 25 ? number : null;
}

/**
 * One row per lender, term, rate type, and mortgage type.
 * `rate` is the advertised special when one exists, otherwise the only rate.
 * `posted_rate` is the shelf, when the file has one that differs from the special.
 */
export function canonicalRates(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!row?.lender_slug || isOpen(row)) continue;
    const rate = numeric(row.rate);
    if (rate == null) continue;
    const key = [row.lender_slug, row.term_months, row.rate_type, mortgageType(row)].join("|");
    const explicitPosted = numeric(row.posted_rate);
    const shelf = isPostedShelf(row);
    const existing = map.get(key);
    if (!existing) {
      map.set(key, {
        lender_slug: row.lender_slug,
        lender_name: row.lender_name || row.lender_slug,
        term_months: Number(row.term_months),
        rate_type: row.rate_type,
        mortgage_type: mortgageType(row),
        rate,
        posted_rate: explicitPosted ?? (shelf ? rate : null),
        hasSpecial: !shelf || explicitPosted != null,
      });
      continue;
    }
    if (explicitPosted != null) existing.posted_rate = explicitPosted;
    if (shelf && explicitPosted == null) {
      if (existing.posted_rate == null || rate > existing.posted_rate) existing.posted_rate = rate;
      if (!existing.hasSpecial) existing.rate = rate;
    } else {
      existing.hasSpecial = true;
      if (rate <= existing.rate) {
        existing.rate = rate;
        existing.lender_name = row.lender_name || existing.lender_name;
      }
    }
  }
  return map;
}

export function diffRates(previous, next, observedAt) {
  const date = observedAt.slice(0, 10);
  const changes = [];
  for (const [key, row] of next) {
    const before = previous.get(key);
    if (!before) continue;
    if (before.rate !== row.rate) {
      changes.push(changeRecord(row, "rate", before.rate, row.rate, date, observedAt));
    }
    const beforePosted = before.posted_rate;
    const nextPosted = row.posted_rate;
    if (
      beforePosted != null &&
      nextPosted != null &&
      beforePosted !== nextPosted &&
      !(beforePosted === before.rate && nextPosted === row.rate)
    ) {
      changes.push(changeRecord(row, "posted_rate", beforePosted, nextPosted, date, observedAt));
    }
  }
  return changes;
}

function changeRecord(row, field, previous, rate, date, observedAt) {
  return {
    date,
    observedAt,
    lender_slug: row.lender_slug,
    lender_name: row.lender_name,
    term_months: row.term_months,
    rate_type: row.rate_type,
    mortgage_type: row.mortgage_type,
    field,
    previous,
    rate,
    direction: rate < previous ? "cut" : "hike",
    key: [row.lender_slug, row.term_months, row.rate_type, row.mortgage_type, field].join("|"),
  };
}

export function changeId(change) {
  return [change.observedAt, change.key, change.previous, change.rate].join("|");
}

/**
 * Net 5-year fixed advertised-rate moves in the 30 days ending `asOf`.
 * A lender counts as a cut when at least one insured status finished lower
 * than it started in that window.
 */
export function summarizeFiveYearFixed(changes, asOf, days = 30) {
  const start = addDays(asOf, -days);
  const relevant = (changes ?? [])
    .filter(
      (change) =>
        change.field === "rate" &&
        change.term_months === 60 &&
        change.rate_type === "fixed" &&
        change.date > start &&
        change.date <= asOf,
    )
    .slice()
    .sort((a, b) => (a.observedAt < b.observedAt ? -1 : a.observedAt > b.observedAt ? 1 : 0));

  const series = new Map();
  for (const change of relevant) {
    const key = `${change.lender_slug}|${change.mortgage_type}`;
    const current = series.get(key);
    if (!current) {
      series.set(key, {
        lender_slug: change.lender_slug,
        lender_name: change.lender_name,
        start: change.previous,
        end: change.rate,
      });
    } else {
      current.end = change.rate;
    }
  }

  const cut = new Set();
  const hiked = new Set();
  const cutEvent = new Set();
  const hikeEvent = new Set();
  for (const change of relevant) {
    if (change.direction === "cut") cutEvent.add(change.lender_slug);
    if (change.direction === "hike") hikeEvent.add(change.lender_slug);
  }
  for (const row of series.values()) {
    if (row.end < row.start) cut.add(row.lender_slug);
    if (row.end > row.start) hiked.add(row.lender_slug);
  }

  return {
    asOf,
    from: addDays(start, 1),
    to: asOf,
    events: relevant.length,
    lendersCut: cut.size,
    lendersHiked: hiked.size,
    lendersWithCutEvent: cutEvent.size,
    lendersWithHikeEvent: hikeEvent.size,
    cutLenders: [...cut],
    hikedLenders: [...hiked],
  };
}
