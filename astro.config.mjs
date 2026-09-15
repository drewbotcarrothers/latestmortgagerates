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

        const filtered = rates
          .filter((r) => r.rate_type === "fixed" && r.term_months === 60)
          .sort((a, b) => (a.rate || 99) - (b.rate || 99))
          .slice(0, 5)
          .map((r) => ({
            lender: r.lender_name,
            lender_slug: r.lender_slug,
            rate: r.rate,
            type: `${r.term_months / 12} Year ${r.rate_type === "fixed" ? "Fixed" : "Variable"}`,
            url: `https://latestmortgagerates.ca/lenders/${r.lender_slug}/`,
            updated_at: r.scraped_at,
          }));

        const ratesBody = JSON.stringify({
          rates: filtered,
          meta: {
            total_rates: rates.length,
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
      },
    },
  };
}

export default defineConfig({
  site: "https://latestmortgagerates.ca",
  output: "static",
  outDir: "dist",
  trailingSlash: "always",
  integrations: [
    react(),
    sitemap({
      lastmod: new Date(),
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
