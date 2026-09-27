import primeConfig from "../../config/prime_rate.json";

/**
 * Big 5 prime and the Bank of Canada policy rate.
 * Single source: config/prime_rate.json (also read by the Python scrape).
 */
export const PRIME_RATE: number = Number(primeConfig.prime_rate);
export const BOC_POLICY_RATE: number = Number(primeConfig.boc_policy_rate);
export const PRIME_SPREAD: number = Number(primeConfig.spread_over_policy);
