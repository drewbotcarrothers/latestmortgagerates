import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("..", import.meta.url));

function walk(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else if ([".ts", ".tsx", ".astro"].includes(extname(full))) files.push(full);
  }
  return files;
}

function rel(file: string): string {
  return file.replace(SRC, "src").replace(/\\/g, "/");
}

function read(file: string): string {
  return readFileSync(file, "utf8");
}

const GUIDE_IMPORT = /from ["']@\/components\/GuideCTA["']/;
const GUIDE_USAGE = /<GuideCTA\b[^>]*>/g;
const VARIANT_FULL = /<GuideCTA\b[^>]*variant=["']full["']/;
const VARIANT_COMPACT = /<GuideCTA\b[^>]*variant=["']compact["']/;

/** Pages/components that should render GuideCTA directly. */
const REQUIRED_PLACEMENTS = [
  "src/views/HomePage.tsx",
  "src/views/blog/BlogPost.tsx",
  "src/views/lenders/LenderPage.tsx",
  "src/components/CityTools.tsx",
  "src/views/tools/ToolsIndex.tsx",
  "src/views/tools/mortgage-calculator/Page.tsx",
  "src/views/tools/affordability-calculator/Page.tsx",
  "src/views/tools/land-transfer-tax-calculator/Page.tsx",
  "src/views/tools/cmhc-insurance-calculator/Page.tsx",
  "src/views/tools/closing-costs-calculator/Page.tsx",
  "src/views/tools/rent-vs-buy-calculator/Page.tsx",
  "src/views/tools/mortgage-penalty-calculator/Page.tsx",
  "src/views/tools/mortgage-renewal-calculator/Page.tsx",
  "src/views/tools/refinance-calculator/Page.tsx",
  "src/views/tools/stress-test-qualifier/Page.tsx",
  "src/views/rates/FiveYearFixedPage.tsx",
  "src/views/rates/VariablePage.tsx",
  "src/views/rates/InsuredPage.tsx",
  "src/views/rates/UninsuredPage.tsx",
];

describe("GuideCTA placements", () => {
  it("keeps Stripe buy link and mortgage-guide learn-more on the shared component", () => {
    const source = read(join(SRC, "components/GuideCTA.tsx"));
    assert.match(source, /https:\/\/buy\.stripe\.com\/7sY4gz8ZtbAqg2s8nw9oc00/);
    assert.match(source, /href="\/mortgage-guide\/"/);
    assert.match(source, /Buy Now — \$29/);
    assert.match(source, /Learn More/);
  });

  it("appears on high-intent surfaces (tools, rate hubs, lenders, cities, home, blog)", () => {
    const missing: string[] = [];
    for (const path of REQUIRED_PLACEMENTS) {
      const text = read(join(SRC, path.replace(/^src\//, "")));
      if (!GUIDE_IMPORT.test(text) || !text.includes("<GuideCTA")) {
        missing.push(path);
      }
    }
    assert.equal(missing.length, 0, `missing GuideCTA:\n${missing.join("\n")}`);
  });

  it("uses one GuideCTA per page (no full+compact stacking)", () => {
    const stacked: string[] = [];
    for (const file of walk(SRC)) {
      if (file.endsWith(".test.ts")) continue;
      const text = read(file);
      const usages = text.match(GUIDE_USAGE) ?? [];
      if (usages.length > 1) stacked.push(`${rel(file)} (${usages.length})`);
      if (VARIANT_FULL.test(text) && VARIANT_COMPACT.test(text)) {
        stacked.push(`${rel(file)} (full+compact)`);
      }
    }
    assert.equal(stacked.length, 0, `stacked GuideCTAs:\n${stacked.join("\n")}`);
  });

  it("covers every city page via CityTools instead of per-city copies", () => {
    const cityViews = join(SRC, "views/cities");
    const missingShared: string[] = [];
    const duplicated: string[] = [];
    for (const name of readdirSync(cityViews)) {
      if (!name.endsWith(".tsx")) continue;
      const text = read(join(cityViews, name));
      if (!text.includes("CityTools")) missingShared.push(`src/views/cities/${name}`);
      if (GUIDE_IMPORT.test(text)) duplicated.push(`src/views/cities/${name}`);
    }
    assert.equal(missingShared.length, 0, `cities without CityTools:\n${missingShared.join("\n")}`);
    assert.equal(duplicated.length, 0, `cities with extra GuideCTA:\n${duplicated.join("\n")}`);
  });

  it("covers every lender page via LenderPage", () => {
    const lenderPage = read(join(SRC, "views/lenders/LenderPage.tsx"));
    assert.match(lenderPage, GUIDE_IMPORT);
    assert.match(lenderPage, /<GuideCTA variant="compact"/);
    const slugPage = read(join(SRC, "pages/lenders/[slug].astro"));
    assert.match(slugPage, /LenderPage/);
  });
});
