import bondFile from "../../data/bond-yield-5y.json";
import policyFile from "../../data/boc-policy-rate-history.json";
import { BOND_URL, POLICY_URL, parseBondYieldPayload, parsePolicyPayload } from "./marketSeries.mjs";

export interface BondObservation {
  date: string;
  yield: number;
}

export interface BondSeries {
  series: string;
  label: string;
  description?: string;
  source: string;
  observations: BondObservation[];
}

export interface PolicyChange {
  date: string;
  rate: number;
}

export interface PolicySeries {
  series: string;
  label: string;
  description?: string;
  source: string;
  observationsThrough: string | null;
  changes: PolicyChange[];
}

const cachedBond = bondFile as BondSeries;
const cachedPolicy = policyFile as PolicySeries;

async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/** Valet fetch at build time. The committed file is the fallback. */
export async function loadBondSeries(): Promise<BondSeries> {
  const live = await fetchJson(BOND_URL);
  if (live) {
    const parsed = parseBondYieldPayload(live) as BondSeries;
    if (parsed.observations.length) return parsed;
  }
  return cachedBond;
}

export async function loadPolicySeries(): Promise<PolicySeries> {
  const live = await fetchJson(POLICY_URL);
  if (live) {
    const parsed = parsePolicyPayload(live) as PolicySeries;
    if (parsed.changes.length) return parsed;
  }
  return cachedPolicy;
}

export function cachedBondSeries(): BondSeries {
  return cachedBond;
}

export function cachedPolicySeries(): PolicySeries {
  return cachedPolicy;
}
