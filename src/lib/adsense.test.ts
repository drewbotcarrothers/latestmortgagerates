import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ADSENSE_CLIENT,
  ADSENSE_SLOTS,
  isConfiguredSlot,
  slotForFormat,
} from "./adsense.ts";

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

const AD_IMPORT = /from ["']@\/components\/AdUnit["']/;
const AD_USAGE = /<AdUnit\b[^>]*\/?>/g;

const REQUIRED_PLACEMENTS = [
  "src/views/HomePage.tsx",
  "src/views/blog/BlogPost.tsx",
  "src/views/lenders/LenderPage.tsx",
  "src/components/CityTools.tsx",
  "src/views/mortgage-guide/EbookPage.tsx",
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
  "src/views/compare/ComparePage.tsx",
  "src/views/compare/CompareIndex.tsx",
];

const AD_FREE = [
  "src/views/unsubscribed/UnsubscribedPage.tsx",
  "src/views/widget/WidgetPage.tsx",
  "src/views/privacy/PrivacyPage.tsx",
  "src/views/terms/TermsPage.tsx",
];

describe("AdSense config", () => {
  it("uses the live publisher ID", () => {
    assert.equal(ADSENSE_CLIENT, "ca-pub-7909541570116920");
  });

  it("keeps slot IDs empty or numeric — no invented fake IDs", () => {
    for (const [name, slot] of Object.entries(ADSENSE_SLOTS)) {
      assert.ok(
        slot === "" || /^\d+$/.test(slot),
        `${name} looks like a fake slot ID: ${JSON.stringify(slot)}`
      );
    }
    assert.equal(isConfiguredSlot(""), false);
    assert.equal(isConfiguredSlot("PLACEHOLDER"), false);
    assert.equal(isConfiguredSlot("1234567890"), true);
    assert.equal(slotForFormat("sidebar"), ADSENSE_SLOTS.sidebar);
    assert.equal(slotForFormat("inArticle"), ADSENSE_SLOTS.inArticle);
    assert.equal(slotForFormat("display"), ADSENSE_SLOTS.display);
  });
});

describe("AdUnit component", () => {
  it("reserves height, labels ads, and pushes once per mount", () => {
    const source = read(join(SRC, "components/AdUnit.tsx"));
    assert.match(source, /Advertisement/);
    assert.match(source, /min-h-\[250px\]/);
    assert.match(source, /min-h-\[280px\]/);
    assert.match(source, /adsbygoogle/);
    assert.match(source, /pushAdSense/);
    assert.match(source, /pushed\.current/);
    assert.match(source, /data-adsbygoogle-status/);
    assert.match(source, /ADSENSE_CLIENT/);
  });
});

describe("AdSense placements", () => {
  it("appears on priority content surfaces", () => {
    const missing: string[] = [];
    for (const path of REQUIRED_PLACEMENTS) {
      const text = read(join(SRC, path.replace(/^src\//, "")));
      if (!AD_IMPORT.test(text) || !text.includes("<AdUnit")) {
        missing.push(path);
      }
    }
    assert.equal(missing.length, 0, `missing AdUnit:\n${missing.join("\n")}`);
  });

  it("keeps density at most 2 units per page source", () => {
    const crowded: string[] = [];
    for (const file of walk(SRC)) {
      if (file.endsWith(".test.ts")) continue;
      const text = read(file);
      const usages = text.match(AD_USAGE) ?? [];
      if (usages.length > 2) crowded.push(`${rel(file)} (${usages.length})`);
    }
    assert.equal(crowded.length, 0, `more than 2 AdUnits:\n${crowded.join("\n")}`);
  });

  it("stays off thin, legal, widget, and unsubscribed pages", () => {
    const leaked: string[] = [];
    for (const path of AD_FREE) {
      const text = read(join(SRC, path.replace(/^src\//, "")));
      if (text.includes("AdUnit") || text.includes("adsbygoogle")) {
        leaked.push(path);
      }
    }
    assert.equal(leaked.length, 0, `ads on ad-free pages:\n${leaked.join("\n")}`);
  });

  it("covers every city via CityTools instead of per-city copies", () => {
    const cityViews = join(SRC, "views/cities");
    const duplicated: string[] = [];
    for (const name of readdirSync(cityViews)) {
      if (!name.endsWith(".tsx")) continue;
      const text = read(join(cityViews, name));
      if (AD_IMPORT.test(text)) duplicated.push(`src/views/cities/${name}`);
    }
    assert.equal(duplicated.length, 0, `cities with extra AdUnit:\n${duplicated.join("\n")}`);
    const cityTools = read(join(SRC, "components/CityTools.tsx"));
    assert.match(cityTools, /<AdUnit/);
  });

  it("does not load the AdSense script on noindex pages", () => {
    const layout = read(join(SRC, "layouts/BaseLayout.astro"));
    assert.match(layout, /noIndex/);
    assert.match(layout, /adsbygoogle\.js\?client=ca-pub-7909541570116920/);
    assert.match(layout, /!noIndex/);
  });
});
