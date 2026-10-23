import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import { fileURLToPath } from "node:url";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { legacyRedirects } from "./src/lib/legacyRedirects.mjs";
import { isIndexablePath } from "./src/lib/sitemapFilter.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const srcDir = fileURLToPath(new URL("./src", import.meta.url));
const dataDir = fileURLToPath(new URL("./data", import.meta.url));

/**
 * Write a file at `dir/name`, removing a directory at that path first.
 * Hostinger still has a Next.js leftover file named `api/version`.
 * Astro must not emit `api/version/index.html` or FTP fails with 550 Not a directory.
 */
function writeFlatFile(dir, name, body) {
  const target = join(dir, name);
  if (existsSync(target) && lstatSync(target).isDirectory()) {
    rmSync(target, { recursive: true, force: true });
  }
  writeFileSync(target, body);
}

function compareByRate(a, b) {
  return (a.rate || 99) - (b.rate || 99);
}

/** "5 Year Fixed", "3 Year Variable", or "6 Month Fixed" when the term is not a whole year. */
function formatRateType(termMonths, rateType) {
  const months = Number(termMonths);
  const kind = rateType === "fixed" ? "Fixed" : rateType === "variable" ? "Variable" : String(rateType || "");
  let term = "Unknown term";
  if (Number.isFinite(months) && months > 0) {
    term = months % 12 === 0 ? `${months / 12} Year` : `${months} Month`;
  }
  return kind ? `${term} ${kind}` : term;
}

function legacyRateRow(r) {
  return {
    lender: r.lender_name,
    lender_slug: r.lender_slug,
    rate: r.rate,
    type: formatRateType(r.term_months, r.rate_type),
    url: `https://latestmortgagerates.ca/lenders/${r.lender_slug}/`,
    updated_at: r.scraped_at,
  };
}

function jsonApiFiles() {
  return {
    name: "lmr-static-json-api",
    hooks: {
      "astro:build:done": ({ dir }) => {
        const out = fileURLToPath(dir);
        const rates = JSON.parse(readFileSync(join(root, "data/rates.json"), "utf8"));
        const metadata = JSON.parse(readFileSync(join(root, "data/metadata.json"), "utf8"));

        const apiDir = join(out, "api");
        mkdirSync(apiDir, { recursive: true });

        // Hostinger after the failed Astro FTP (run 34950784306):
        //   api/version  → leftover Next.js FILE  (MKD fails: 550 Not a directory)
        //   api/rates    → DIRECTORY already created (index.html uploaded)
        // Match that mix: version stays a file; rates may keep a directory.

        const allRates = [...rates].sort(compareByRate).map((r) => ({
          ...r,
          lender: r.lender_name,
          lender_slug: r.lender_slug,
          type: formatRateType(r.term_months, r.rate_type),
          url: `https://latestmortgagerates.ca/lenders/${r.lender_slug}/`,
          updated_at: r.scraped_at,
        }));

        // Previous payload: best five 5-year fixed rows only. Kept so the
        // embed widget (and anything that still wants that short list) does
        // not have to re-filter the full set.
        const top5yrFixed = rates
          .filter((r) => r.rate_type === "fixed" && r.term_months === 60)
          .sort(compareByRate)
          .slice(0, 5)
          .map(legacyRateRow);

        const ratesBody = JSON.stringify({
          rates: allRates,
          top_5yr_fixed: top5yrFixed,
          meta: {
            total_rates: allRates.length,
            lenders_count: metadata?.total_lenders || 34,
            last_updated: metadata?.last_updated,
            source: "https://latestmortgagerates.ca",
          },
        });

        const versionBody = JSON.stringify({
          lastUpdated: metadata.last_updated,
          totalRates: metadata.total_rates,
          totalLenders: metadata.total_lenders,
          buildTime: new Date().toISOString(),
        });

        // Canonical JSON files (widget + new clients). These names do not
        // collide with either leftover (`version` file or `rates/` directory).
        writeFlatFile(apiDir, "rates.json", ratesBody);
        writeFlatFile(apiDir, "version.json", versionBody);
        // Overwrite the Next.js file so /api/version keeps working.
        writeFlatFile(apiDir, "version", versionBody);
        // Keep /api/rates/ working on the directory Hostinger already has.
        // Do not write a file named `api/rates` — that would 550 over the dir.
        const ratesDir = join(apiDir, "rates");
        if (existsSync(ratesDir) && lstatSync(ratesDir).isFile()) {
          rmSync(ratesDir);
        }
        mkdirSync(ratesDir, { recursive: true });
        writeFileSync(join(ratesDir, "index.json"), ratesBody);
        writeFileSync(join(ratesDir, "index.html"), ratesBody);

        copyFileSync(join(root, "data/rates.json"), join(out, "rates.json"));
        copyFileSync(join(root, "data/metadata.json"), join(out, "metadata.json"));

        // Astro emits sitemap-index.xml + sitemap-0.xml. robots.txt points at the index.
        // Keep a sitemap.xml copy of the urlset for the existing Search Console submission.
        const sitemapChunk = join(out, "sitemap-0.xml");
        if (existsSync(sitemapChunk)) {
          copyFileSync(sitemapChunk, join(out, "sitemap.xml"));
        }

        // trailingSlash: always can emit llms.txt/index.html. The public URL is /llms.txt.
        const llmsPath = join(out, "llms.txt");
        if (existsSync(llmsPath) && lstatSync(llmsPath).isDirectory()) {
          const indexHtml = join(llmsPath, "index.html");
          if (existsSync(indexHtml)) {
            const body = readFileSync(indexHtml);
            rmSync(llmsPath, { recursive: true, force: true });
            writeFileSync(llmsPath, body);
          }
        }
      },
    },
  };
}

function isIndexableSitemapUrl(page) {
  return isIndexablePath(new URL(page).pathname);
}

export default defineConfig({
  site: "https://latestmortgagerates.ca",
  output: "static",
  outDir: "dist",
  trailingSlash: "always",
  // Static HTML so Hostinger hCDN has a file. See src/lib/legacyRedirects.mjs.
  redirects: legacyRedirects,
  integrations: [
    react(),
    sitemap({
      lastmod: new Date(),
      filter: isIndexableSitemapUrl,
      customPages: [
        "https://latestmortgagerates.ca/llms.txt",
        "https://latestmortgagerates.ca/editorial-policy/",
      ],
    }),
    jsonApiFiles(),
  ],
  vite: {
    resolve: {
      alias: {
        "@": srcDir,
        "@data": dataDir,
      },
    },
  },
});
