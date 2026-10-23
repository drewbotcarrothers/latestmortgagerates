import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const INDEXNOW_HOST = "latestmortgagerates.ca";
export const INDEXNOW_MAX_URLS = 10000;

const KEY_FILE = /^([a-f0-9]{32})\.txt$/;

export function parseLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((match) => match[1]);
}

function sitemapFileName(url) {
  const path = url.split("?")[0];
  const name = path.split("/").pop() || "";
  return /^sitemap.*\.xml$/i.test(name) ? name : "";
}

/** Page URLs from a sitemap index plus the urlset files it points at. */
export function urlsFromSitemapTree(files) {
  const pageUrls = [];
  const seenFiles = new Set();

  function walk(name) {
    if (seenFiles.has(name) || !files[name]) return;
    seenFiles.add(name);
    for (const loc of parseLocs(files[name])) {
      const child = sitemapFileName(loc);
      if (child && files[child]) walk(child);
      else if (!sitemapFileName(loc)) pageUrls.push(loc);
    }
  }

  if (files["sitemap-index.xml"]) walk("sitemap-index.xml");
  else if (files["sitemap-0.xml"]) walk("sitemap-0.xml");
  else if (files["sitemap.xml"]) walk("sitemap.xml");

  return [...new Set(pageUrls)];
}

export function loadSitemapFiles(distDir) {
  const files = {};
  if (!existsSync(distDir)) return files;
  for (const name of readdirSync(distDir)) {
    if (/^sitemap.*\.xml$/i.test(name)) {
      files[name] = readFileSync(`${distDir}/${name}`, "utf8");
    }
  }
  return files;
}

export function loadSitemapUrls(distDir) {
  return urlsFromSitemapTree(loadSitemapFiles(distDir));
}

export function filterHostUrls(urls, host = INDEXNOW_HOST) {
  return urls.filter((url) => {
    try {
      return new URL(url).host === host;
    } catch {
      return false;
    }
  });
}

/** Changed URLs when a list is provided; otherwise every sitemap URL. */
export function chooseUrlList(sitemapUrls, changedUrls) {
  const source = changedUrls && changedUrls.length > 0 ? changedUrls : sitemapUrls;
  const unique = [];
  const seen = new Set();
  for (const url of source) {
    if (!url || seen.has(url)) continue;
    seen.add(url);
    unique.push(url);
  }
  return unique;
}

export function chunkUrls(urls, size = INDEXNOW_MAX_URLS) {
  if (size < 1) throw new Error("IndexNow chunk size must be at least 1");
  const chunks = [];
  for (let i = 0; i < urls.length; i += size) chunks.push(urls.slice(i, i + size));
  return chunks;
}

export function buildIndexNowBody({ host, key, urls }) {
  return {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  };
}

/** A public/<32-hex>.txt file whose body is that same key. */
export function findIndexNowKey(dir) {
  if (!existsSync(dir)) throw new Error(`IndexNow key directory not found: ${dir}`);
  const matches = [];
  for (const name of readdirSync(dir)) {
    const match = name.match(KEY_FILE);
    if (!match) continue;
    const body = readFileSync(`${dir}/${name}`, "utf8").trim();
    if (body === match[1]) matches.push({ key: match[1], fileName: name });
  }
  if (matches.length !== 1) {
    throw new Error(`Expected one IndexNow key file in ${dir}, found ${matches.length}`);
  }
  return matches[0];
}

export function readChangedUrls(filePath) {
  const text = readFileSync(filePath, "utf8");
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
}

function parseArgs(argv) {
  const args = { dist: "dist", changed: "", keyDir: "", dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dist") args.dist = argv[++i];
    else if (arg === "--changed") args.changed = argv[++i];
    else if (arg === "--key-dir") args.keyDir = argv[++i];
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--help") args.help = true;
  }
  return args;
}

function resolveKey(keyDirs) {
  let lastError = new Error("IndexNow key file not found");
  for (const dir of keyDirs) {
    if (!existsSync(dir)) continue;
    try {
      return findIndexNowKey(dir);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

export async function submitIndexNow({ distDir, changedFile, keyDir, dryRun, fetchImpl = fetch }) {
  const keyInfo = resolveKey(keyDir ? [keyDir] : [distDir, resolve("public")]);
  const sitemapUrls = filterHostUrls(loadSitemapUrls(distDir));
  const changedUrls = changedFile ? filterHostUrls(readChangedUrls(changedFile)) : [];
  const urlList = chooseUrlList(sitemapUrls, changedUrls);
  if (urlList.length === 0) {
    console.log("IndexNow: no URLs to submit");
    return { submitted: 0, requests: 0 };
  }
  const chunks = chunkUrls(urlList);
  if (dryRun) {
    console.log(`IndexNow dry run: ${urlList.length} URLs in ${chunks.length} request(s)`);
    return { submitted: urlList.length, requests: chunks.length, dryRun: true };
  }
  let submitted = 0;
  for (const chunk of chunks) {
    const body = buildIndexNowBody({ host: INDEXNOW_HOST, key: keyInfo.key, urls: chunk });
    const response = await fetchImpl(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const text = typeof response.text === "function" ? await response.text() : "";
      console.error(`IndexNow HTTP ${response.status} for ${chunk.length} URLs`);
      if (text) console.error(String(text).slice(0, 500));
      throw new Error(`IndexNow HTTP ${response.status}`);
    }
    submitted += chunk.length;
    console.log(`IndexNow accepted ${chunk.length} URLs`);
  }
  return { submitted, requests: chunks.length };
}

function invokedDirectly() {
  const entry = process.argv[1];
  if (!entry) return false;
  return resolve(entry) === fileURLToPath(import.meta.url);
}

if (invokedDirectly()) {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log("Usage: node scripts/indexnow.mjs --dist dist [--changed urls.txt] [--key-dir public] [--dry-run]");
    process.exit(0);
  }
  submitIndexNow({
    distDir: resolve(args.dist),
    changedFile: args.changed ? resolve(args.changed) : "",
    keyDir: args.keyDir ? resolve(args.keyDir) : "",
    dryRun: args.dryRun,
  }).catch((error) => {
    console.error(error instanceof Error ? error.message : "IndexNow failed");
    process.exitCode = 1;
  });
}
