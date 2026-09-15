#!/usr/bin/env node
/**
 * Fail the build if Astro emits directory-style API paths that collide with
 * Hostinger leftovers (`api/version` as a file → FTP 550 Not a directory).
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

function assertNotPresent(relPath) {
  if (existsSync(join(dist, relPath))) {
    fail(`${relPath} must not exist (directory-style API output breaks Hostinger FTP)`);
  }
}

for (const rel of ["api/rates.json", "api/version.json", "api/rates", "api/version"]) {
  assertFile(rel);
}

assertNotPresent("api/rates/index.html");
assertNotPresent("api/rates/index.json");
assertNotPresent("api/version/index.html");
assertNotPresent("api/version/index.json");

if (existsSync(join(api, "rates")) && lstatSync(join(api, "rates")).isDirectory()) {
  fail("api/rates is a directory");
}
if (existsSync(join(api, "version")) && lstatSync(join(api, "version")).isDirectory()) {
  fail("api/version is a directory");
}

const rates = JSON.parse(readFileSync(join(api, "rates.json"), "utf8"));
if (!Array.isArray(rates.rates) || rates.rates.length === 0) {
  fail("api/rates.json must contain a non-empty rates array");
}

const version = JSON.parse(readFileSync(join(api, "version.json"), "utf8"));
if (!version.lastUpdated) {
  fail("api/version.json must include lastUpdated");
}

const ratesFile = readFileSync(join(api, "rates"), "utf8");
if (ratesFile !== readFileSync(join(api, "rates.json"), "utf8")) {
  fail("api/rates and api/rates.json must have the same body");
}

const versionFile = readFileSync(join(api, "version"), "utf8");
if (versionFile !== readFileSync(join(api, "version.json"), "utf8")) {
  fail("api/version and api/version.json must have the same body");
}

console.log("verify-static-api: ok (flat api/rates.json + api/version.json)");
