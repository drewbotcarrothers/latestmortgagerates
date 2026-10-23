import { isLegacyRedirectPath } from "./legacyRedirects.mjs";
import { isIndexablePath as isBaseIndexablePath } from "./indexedCities.mjs";
import { isNoindexedContent } from "./noindexPolicy.mjs";

/** Sitemap and robots policy, including content noindex flags and weekly rollups. */
export function isIndexablePath(pathname) {
  if (isLegacyRedirectPath(pathname)) return false;
  if (!isBaseIndexablePath(pathname)) return false;
  if (isNoindexedContent(pathname)) return false;
  return true;
}
