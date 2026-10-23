import forecastFile from "../../data/rate-forecasts-2027.json";
import { PRIME_SPREAD } from "./primeRate";
import { round2 } from "./dataFormat";

export interface PublishedForecast {
  institution: string;
  publication: string;
  published: string;
  url: string;
  policyRate: number | null;
  policyBasis: string | null;
  fiveYearYield: number | null;
  yieldBasis: string | null;
  note: string;
}

export const publishedForecasts = forecastFile.forecasts as PublishedForecast[];
export const forecastsCompiled = forecastFile.compiled;

export function numericForecasts(forecasts: readonly PublishedForecast[], field: "policyRate" | "fiveYearYield"): number[] {
  return forecasts
    .map((forecast) => forecast[field])
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
}

export function policyPrimeRange(forecasts: readonly PublishedForecast[], spread = PRIME_SPREAD) {
  const rates = numericForecasts(forecasts, "policyRate");
  if (!rates.length) return null;
  const lowPolicy = Math.min(...rates);
  const highPolicy = Math.max(...rates);
  return {
    lowPolicy,
    highPolicy,
    lowPrime: round2(lowPolicy + spread),
    highPrime: round2(highPolicy + spread),
    spread,
  };
}

/** If today's mortgage-over-yield spread stayed put, applied to the published yield range. */
export function yieldSpreadRange(forecasts: readonly PublishedForecast[], currentSpread: number | null) {
  const yields = numericForecasts(forecasts, "fiveYearYield");
  if (!yields.length || currentSpread == null) return null;
  const lowYield = Math.min(...yields);
  const highYield = Math.max(...yields);
  return {
    lowYield,
    highYield,
    currentSpread,
    lowMortgage: round2(lowYield + currentSpread),
    highMortgage: round2(highYield + currentSpread),
  };
}
