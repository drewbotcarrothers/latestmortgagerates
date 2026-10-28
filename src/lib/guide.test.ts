import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import GuideCTA from "../components/GuideCTA.tsx";
import ThankYouPage from "../views/mortgage-guide/ThankYouPage.tsx";
import { isIndexablePath } from "./sitemapFilter.mjs";
import {
  buildGuideBuyUrl,
  buildGuidePageUrl,
  CORE_CHAPTERS,
  GUIDE_BUY_BASE,
  GUIDE_VARIANT,
  SALES_H1,
  SALES_INSIDE_CTA,
  SALES_INSIDE_HEADING,
  SALES_ONLY_HEADING,
  THANK_YOU_FILES,
  THANK_YOU_H1,
  THANK_YOU_PENDING,
  WHATS_INSIDE,
} from "./guide.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

function walk(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

describe("mortgage guide offer", () => {
  it("ships Variant A: the 2026 core guide plus five bonuses", () => {
    assert.equal(GUIDE_VARIANT, "A");
    assert.equal(CORE_CHAPTERS.length, 10);
    assert.match(CORE_CHAPTERS[0], /Hidden Mortgage Market/);
    assert.match(CORE_CHAPTERS[8], /Reading the Rate Outlook/);
    assert.doesNotMatch(CORE_CHAPTERS.join(" "), /Expert predictions|2026 Rate Forecast/);
    assert.equal(WHATS_INSIDE.length, 6);
    assert.match(WHATS_INSIDE[0].title, /2026 Edition/);
    assert.match(WHATS_INSIDE[4].title, /Renewal Playbook 2027/);
    assert.match(WHATS_INSIDE[4].note, /Bonus/);
    assert.equal(SALES_INSIDE_HEADING, "6 files, instant download");
    assert.equal(SALES_INSIDE_CTA, "Download all 6 files — $29 CAD");
    assert.equal(THANK_YOU_FILES.length, 6);
    assert.ok(THANK_YOU_FILES.includes("01 The Guide"));
    assert.ok(THANK_YOU_FILES.includes("05 Bonus: Mortgage Renewal Playbook 2027"));
  });

  it("builds the Stripe payment link with campaign UTMs in one place", () => {
    const wealthsimple = buildGuideBuyUrl({ medium: "cta_compact", content: "lender_wealthsimple" });
    assert.equal(
      wealthsimple,
      `${GUIDE_BUY_BASE}?utm_source=site&utm_medium=cta_compact&utm_campaign=mortgage_guide&utm_content=lender_wealthsimple`,
    );
    const city = buildGuideBuyUrl({ medium: "cta_compact", content: "city_toronto" });
    assert.match(city, /utm_content=city_toronto/);
    const compare = buildGuideBuyUrl({ medium: "cta_compact", content: "compare_td-vs-rbc" });
    assert.match(compare, /utm_campaign=mortgage_guide/);
    assert.match(compare, /utm_content=compare_td-vs-rbc/);
    assert.equal(
      buildGuidePageUrl({ medium: "nav", content: "header" }),
      "/mortgage-guide/?utm_source=site&utm_medium=nav&utm_campaign=mortgage_guide&utm_content=header",
    );
    const sources = walk(join(root, "src")).filter((file) =>
      [".ts", ".tsx", ".astro"].includes(extname(file)) && !file.endsWith(".test.ts"),
    );
    const hardcoded = sources.filter((file) => readFileSync(file, "utf8").includes("7sY4gz8ZtbAqg2s8nw9oc00"));
    assert.deepEqual(
      hardcoded.map((file) => relative(root, file)),
      ["src/lib/guide.ts"],
    );
  });

  it("renders a priced buy.stripe.com link on the compact GuideCTA", () => {
    const html = renderToStaticMarkup(
      createElement(GuideCTA, {
        variant: "compact",
        lenderName: "Wealthsimple",
        utmMedium: "cta_compact",
        utmContent: "lender_wealthsimple",
      }),
    );
    assert.match(html, /buy\.stripe\.com\/7sY4gz8ZtbAqg2s8nw9oc00/);
    assert.match(html, /utm_campaign=mortgage_guide/);
    assert.match(html, /utm_medium=cta_compact/);
    assert.match(html, /utm_content=lender_wealthsimple/);
    assert.match(html, /Get the Toolkit — \$29/);
    assert.match(html, /Renewing with Wealthsimple\?/);
    assert.match(html, /What(?:&#x27;|')s inside/);
    const rfa = renderToStaticMarkup(
      createElement(GuideCTA, {
        variant: "compact",
        lenderName: "RFA",
        utmContent: "lender_rfa",
      }),
    );
    assert.match(rfa, /utm_content=lender_rfa/);
    assert.match(rfa, /Get the Toolkit — \$29/);
    const truenorth = renderToStaticMarkup(
      createElement(GuideCTA, { variant: "compact", lenderName: "True North", utmContent: "lender_truenorth" }),
    );
    assert.match(truenorth, /Renewing with True North\?/);
    const tdRbc = renderToStaticMarkup(
      createElement(GuideCTA, { variant: "compact", utmContent: "compare_td-vs-rbc" }),
    );
    assert.match(tdRbc, /utm_content=compare_td-vs-rbc/);
    assert.match(tdRbc, /buy\.stripe\.com/);
  });

  it("keeps the sales page on Variant A and off AdSense", () => {
    const page = read("src/views/mortgage-guide/EbookPage.tsx");
    const astro = read("src/pages/mortgage-guide/index.astro");
    assert.match(page, /SALES_H1/);
    assert.equal(SALES_H1, "Walk into your renewal with the script, the numbers and a plan");
    assert.match(page, /SALES_ONLY_HEADING/);
    assert.equal(SALES_ONLY_HEADING, "What you only get when you buy");
    assert.match(page, /SALES_INSIDE_HEADING/);
    assert.match(page, /id="inside"/);
    assert.match(page, /sales_hero/);
    assert.match(page, /sales_mid/);
    assert.match(page, /sales_inside/);
    assert.match(page, /sales_final/);
    assert.match(astro, /SALES_OG_TITLE/);
    assert.match(astro, /noAds=\{true\}/);
    assert.doesNotMatch(page, /AdUnit|adsbygoogle|Trusted by Canadian|Expert predictions|updated quarterly|aggregateRating/i);
    assert.match(page, /stress-test-qualifier/);
  });

  it("noindexes the thank-you page and keeps it out of the sitemap", () => {
    const astro = read("src/pages/mortgage-guide/thank-you.astro");
    assert.match(astro, /noIndex=\{true\}/);
    assert.match(astro, /robots="noindex, nofollow"/);
    assert.match(astro, /PUBLIC_GUIDE_DOWNLOAD_URL/);
    assert.match(astro, /PUBLIC_GUIDE_FOLDER_URL/);
    assert.doesNotMatch(astro, /drive\.google\.com/);
    assert.doesNotMatch(astro, /AdUnit|adsbygoogle/);
    assert.equal(isIndexablePath("/mortgage-guide/thank-you/"), false);
    assert.equal(isIndexablePath("/mortgage-guide/"), true);
    assert.match(read("src/lib/indexedCities.mjs"), /\/mortgage-guide\/thank-you/);
    const pending = renderToStaticMarkup(createElement(ThankYouPage, { downloadUrl: "" }));
    assert.match(pending, new RegExp(THANK_YOU_H1.replace("'", "&#x27;")));
    assert.match(pending, /01 The Guide/);
    assert.match(pending, /05 Bonus: Mortgage Renewal Playbook 2027/);
    assert.match(pending, new RegExp(THANK_YOU_PENDING.slice(0, 40).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.doesNotMatch(pending, /Download all files/);
    const ready = renderToStaticMarkup(
      createElement(ThankYouPage, { downloadUrl: "https://downloads.example.com/guide" }),
    );
    assert.match(ready, /href="https:\/\/downloads\.example\.com\/guide"/);
    assert.match(ready, /Download all files/);
    assert.doesNotMatch(ready, /on its way by email/);
    const both = renderToStaticMarkup(
      createElement(ThankYouPage, {
        folderUrl: "https://files.example.com/folder",
        downloadUrl: "https://downloads.example.com/guide.zip",
      }),
    );
    assert.match(both, /href="https:\/\/files\.example\.com\/folder"/);
    assert.match(both, /Open your files/);
    assert.match(both, /href="https:\/\/downloads\.example\.com\/guide\.zip"/);
    assert.match(both, /Download all files/);
  });

  it("does not commit paid PDF or ZIP files under public/", () => {
    const banned = walk(join(root, "public")).filter((file) => /\.(pdf|zip)$/i.test(file));
    assert.deepEqual(banned, []);
  });

  it("quotes one script line on free guides and keeps the full scripts off those pages", () => {
    const teaser = read("src/components/PaidGuideNote.tsx");
    const depth = read("src/views/guides/InDepthGuidePage.tsx");
    const negotiate = read("src/views/guides/NegotiateGuidePage.tsx");
    assert.match(teaser, /SCRIPT_TEASER_LINE/);
    assert.doesNotMatch(teaser, /Hi, my name is/);
    assert.match(depth, /guideHasInlineTeaser/);
    assert.match(negotiate, /negotiate-mortgage-rate/);
    assert.doesNotMatch(depth + negotiate, /Hi, my name is \[name\]/);
    assert.doesNotMatch(depth + negotiate, /A note on the paid guide|The free steps and the paid guide/);
    const hub = read("src/views/guides/GuidesIndex.tsx");
    assert.match(hub, /Mortgage Guide \+ Renewal Toolkit \(\$29\)/);
    assert.match(hub, /Paid · \$29 CAD/);
  });
});
