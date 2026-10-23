/**
 * Refresh the committed Bank of Canada caches.
 * The site build also fetches these series and falls back to the files
 * when the request fails. Exits 0 either way so a Valet outage does not
 * stop the rate scrape.
 */
import { writeFileSync } from "node:fs";
import {
  BOND_URL,
  POLICY_URL,
  parseBondYieldPayload,
  parsePolicyPayload,
} from "../src/lib/marketSeries.mjs";

async function fetchJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

async function refresh(url, parse, destination) {
  const payload = await fetchJson(url);
  const parsed = parse(payload);
  const count = parsed.observations?.length ?? parsed.changes?.length ?? 0;
  if (!count) throw new Error(`${url} parsed to an empty series`);
  parsed.fetchedAt = new Date().toISOString();
  writeFileSync(destination, `${JSON.stringify(parsed, null, 2)}\n`);
  console.log(`wrote ${destination} (${count} rows)`);
}

const jobs = [
  refresh(BOND_URL, parseBondYieldPayload, "data/bond-yield-5y.json"),
  refresh(POLICY_URL, parsePolicyPayload, "data/boc-policy-rate-history.json"),
];

const results = await Promise.allSettled(jobs);
let failed = 0;
for (const result of results) {
  if (result.status === "rejected") {
    failed += 1;
    console.warn(`kept existing cache: ${result.reason?.message || result.reason}`);
  }
}
if (failed === results.length) {
  console.warn("Bank of Canada refresh failed for every series. Existing cache files were left in place.");
}
