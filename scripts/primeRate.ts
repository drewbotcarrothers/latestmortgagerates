import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

interface PrimeRateConfig {
  prime_rate: number;
  boc_policy_rate: number;
}

const configPath = join(dirname(fileURLToPath(import.meta.url)), "../config/prime_rate.json");
const primeRateConfig = JSON.parse(readFileSync(configPath, "utf8")) as PrimeRateConfig;

/** Big 5 prime from config/prime_rate.json. Do not hard-code this in scripts. */
export const PRIME_RATE = primeRateConfig.prime_rate;
