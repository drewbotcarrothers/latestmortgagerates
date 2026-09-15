#!/usr/bin/env node
/**
 * Fail the build if Astro emits API paths that collide with Hostinger leftovers.
 *
 * Remote today: `api/version` is a FILE, `api/rates` is a DIRECTORY.
 * Emitting `api/version/index.html` or a file named `api/rates` causes FTP 550.
 */
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const api = join(dist, "api");

function fail(message) {
  console.error(`verify-static-api: ${message}`);
  process.exit(1);
}

function assertFile(relPath) {
  const path = join(dist, relPath);
  if (!existsSync(path)) fail(`missing ${relPath}`);
  if (!lstatSync(path).isFile()) fail(`${relPath} must be a file, not a directory`);
  return path;
}

function assertDir(relPath) {
  const path = join(dist, relPath);
  if (!existsSync(path)) fail(`missing ${relPath}`);
  if (!lstatSync(path).isDirectory()) fail(`${relPath} must be a directory`);
}

function assertNotPresent(relPath) {
  if (existsSync(join(dist, relPath))) {
    fail(`${relPath} must not exist (collides with Hostinger FTP leftovers)`);
  }
}

assertFile("api/rates.json");
assertFile("api/version.json");
assertFile("api/version");
assertDir("api/rates");
assertFile("api/rates/index.html");
assertFile("api/rates/index.json");

assertNotPresent("api/version/index.html");
assertNotPresent("api/version/index.json");

if (lstatSync(join(api, "version")).isDirectory()) {
  fail("api/version is a directory (Hostinger still has it as a file)");
}

const rates = JSON.parse(readFileSync(join(api, "rates.json"), "utf8"));
if (!Array.isArray(rates.rates) || rates.rates.length === 0) {
  fail("api/rates.json must contain a non-empty rates array");
}

const version = JSON.parse(readFileSync(join(api, "version.json"), "utf8"));
if (!version.lastUpdated) {
  fail("api/version.json must include lastUpdated");
}

const ratesJson = readFileSync(join(api, "rates.json"), "utf8");
if (readFileSync(join(api, "rates/index.html"), "utf8") !== ratesJson) {
  fail("api/rates/index.html and api/rates.json must have the same body");
}

const versionJson = readFileSync(join(api, "version.json"), "utf8");
if (readFileSync(join(api, "version"), "utf8") !== versionJson) {
  fail("api/version and api/version.json must have the same body");
}

const htaccess = join(dist, ".htaccess");
if (!existsSync(htaccess) || !lstatSync(htaccess).isFile()) {
  fail("dist/.htaccess is required for Hostinger 301s (old GSC 404 URLs)");
}

const sitemapPath = join(dist, "sitemap.xml");
if (!existsSync(sitemapPath) || !lstatSync(sitemapPath).isFile()) {
  fail("dist/sitemap.xml missing (copy sitemap-0.xml after Astro sitemap build)");
}

const sitemap = readFileSync(sitemapPath, "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.length < 50) {
  fail(`sitemap.xml only has ${locs.length} URLs`);
}

const blockedPrefixes = ["/widget/", "/unsubscribed/", "/unsubscribe/", "/api/"];
for (const loc of locs) {
  if (!loc.startsWith("https://latestmortgagerates.ca")) {
    fail(`sitemap URL is not canonical host: ${loc}`);
  }
  if (!loc.endsWith("/")) {
    fail(`sitemap URL must use trailing slash: ${loc}`);
  }
  const path = loc.slice("https://latestmortgagerates.ca".length);
  if (blockedPrefixes.some((prefix) => path === prefix || path.startsWith(prefix))) {
    fail(`sitemap must not include noindex/utility URL: ${loc}`);
  }
}

console.log(`verify-static-api: ok (flat *.json + version file + rates/ dir + sitemap ${locs.length} URLs)`);
