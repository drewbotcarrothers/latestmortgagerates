import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { blogPosts } from "../content/blog.ts";
import { DATA_LINKS } from "./dataLinks.ts";
import { articleJsonLd, blogDateModified } from "./articleSchema.ts";
import { monthlyReportDatasetJsonLd } from "./datasetSchema.ts";
import { isIndexablePath } from "./sitemapFilter.mjs";
import { latestWeeklySlug } from "./noindexPolicy.mjs";
import {
  NOVEMBER_2026_SLUG,
  NOVEMBER_DATA_AS_OF,
  NOVEMBER_TEMPORAL_COVERAGE,
  OCTOBER_2026_RATE_CHANGES,
  datasetFieldsForMonthlyReport,
  november2026Report,
  novemberBankGaps,
  novemberBanksWithoutPosted,
  novemberCells,
} from "./november2026Report.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const forbidden = /reddit|redflagdeals|red flag deals|\brfd\b|carrothers/i;

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("November 2026 below-the-line report", () => {
  const post = november2026Report();

  it("publishes the October snapshot under the November slug", () => {
    assert.equal(post.slug, NOVEMBER_2026_SLUG);
    assert.equal(post.author, "Andrew");
    assert.equal(post.date, "2026-11-03");
    assert.equal(post.updatedDate, "2026-10-31");
    assert.equal(post.excerpt.split(/(?<=%)\.\s+/).length, 2);
    assert.match(post.excerpt, /median 5-year fixed rate self-reported by Canadian borrowers online was 4\.35% \(N = 96\)/);
    assert.match(post.excerpt, /0\.80 percentage points below the Big-5 posted median of 5\.15%/);
    assert.match(post.excerpt, /level with the lowest posted rate of 4\.35%/);
    assert.match(post.excerpt, /median 5-year variable rate was 3\.60% \(N = 212\)/);
    assert.match(post.excerpt, /prime minus 0\.90 \(N = 212\)/);
    assert.match(post.excerpt, /median 3-year fixed rate was 4\.35% \(N = 155\)/);
    assert.match(post.excerpt, /0\.70 percentage points below the Big-5 posted median of 5\.05% \(N = 155\)/);
    assert.match(post.content, /self-reported by Canadian borrowers online/);
    assert.match(post.content, /Self-reported, unverified, and not a mortgage offer/);
    assert.match(post.content, /<!--NOVEMBER_2026_REPORT_CHARTS-->/);
    assert.match(post.content, /\/rate-changes\//);
    assert.match(post.content, /below-the-line-mortgage-rate-report-october-2026/);
    assert.match(post.content, /October 29/);
    assert.match(post.content, /4\.45%/);
    assert.match(post.content, /4\.70%/);
    assert.equal(forbidden.test(`${post.title} ${post.excerpt} ${post.content}`), false);
    assert.equal(post.content.includes("6.15"), false);
    assert.equal(post.content.includes("1.95"), false);
    assert.equal(post.content.includes("3.70"), false);
    assert.equal(post.content.includes("4.55"), false);
    assert.equal(post.content.includes("4.85"), false);
    for (const small of [1, 2, 3, 4, 9]) {
      assert.equal(new RegExp(`N = ${small}(?!\\d)`).test(post.content), false, `published N = ${small}`);
    }
  });

  it("prints N for every published cell and leaves the insured 3-year Big-5 comparison blank", () => {
    const cells = novemberCells();
    assert.ok(cells.length >= 8);
    for (const cell of cells) {
      assert.ok(cell.n >= 10, `${cell.termMonths} ${cell.rateType} ${cell.insured}`);
      assert.match(post.content, new RegExp(`N = ${cell.n}(?!\\d)`));
    }
    const insuredThree = cells.find((cell) => cell.termMonths === 36 && cell.rateType === "fixed" && cell.insured === "insured");
    assert.ok(insuredThree);
    assert.equal(insuredThree.n, 14);
    assert.equal(insuredThree.median, 4.2);
    assert.equal(insuredThree.big5PostedMedian, null);
    assert.equal(insuredThree.spreadVsBig5Median, null);
    assert.equal(insuredThree.shareBelowBig5, null);
    const snapshot = read("src/data/below-the-line-october-2026.json");
    assert.equal(snapshot.includes("6.15"), false);
    assert.equal(forbidden.test(snapshot), false);
  });

  it("publishes Big-5 rows only when N is at least 10", () => {
    const gaps = novemberBankGaps();
    assert.ok(gaps.every((row) => row.n >= 10 && row.postedRate != null));
    assert.deepEqual(
      gaps.map((row) => [row.slug, row.termMonths, row.rateType, row.n]),
      [
        ["td", 60, "fixed", 10],
        ["td", 60, "variable", 29],
        ["rbc", 60, "variable", 24],
        ["rbc", 36, "fixed", 19],
        ["cibc", 60, "variable", 11],
        ["cibc", 36, "fixed", 13],
        ["bmo", 60, "variable", 24],
        ["bmo", 36, "fixed", 12],
        ["scotiabank", 36, "fixed", 21],
      ],
    );
    const missing = novemberBanksWithoutPosted();
    assert.deepEqual(
      missing.map((row) => [row.slug, row.termMonths, row.rateType, row.n, row.reportedMedian]),
      [["scotiabank", 60, "variable", 18, 3.55]],
    );
    assert.match(post.content, /N = 18(?!\d)/);
  });

  it("sets Dataset dateModified to the October 31 as-of date and keeps Article schema", () => {
    const live = blogPosts.find((item) => item.slug === NOVEMBER_2026_SLUG);
    assert.ok(live);
    assert.equal(blogDateModified(live), NOVEMBER_DATA_AS_OF);
    const article = articleJsonLd({
      type: "BlogPosting",
      headline: live.title,
      description: live.excerpt,
      datePublished: live.date,
      dateModified: blogDateModified(live),
      url: `https://latestmortgagerates.ca/blog/${live.slug}/`,
    });
    assert.equal(article["@type"], "BlogPosting");
    assert.equal(article.datePublished, "2026-11-03");
    assert.equal(article.dateModified, "2026-10-31");
    assert.equal(article.author.name, "Andrew");

    const fields = datasetFieldsForMonthlyReport(live.slug);
    const dataset = monthlyReportDatasetJsonLd({
      slug: live.slug,
      name: live.title,
      description: live.excerpt,
      ...fields,
    });
    assert.equal(dataset["@type"], "Dataset");
    assert.equal(dataset.dateModified, "2026-10-31");
    assert.equal(dataset.temporalCoverage, NOVEMBER_TEMPORAL_COVERAGE);
    assert.match(dataset.measurementTechnique, /self-reported by Canadian borrowers online/);
    assert.equal(forbidden.test(JSON.stringify(dataset)), false);
    assert.equal(isIndexablePath(`/blog/${NOVEMBER_2026_SLUG}/`), true);
  });

  it("summarizes October from the rate-change tracker", () => {
    const history = JSON.parse(read("data/rate-changes.json")) as {
      changes: Array<{
        date: string;
        lender_slug: string;
        term_months: number;
        rate_type: string;
        field: string;
        previous: number;
        rate: number;
        direction: string;
      }>;
    };
    const focus = history.changes.filter(
      (change) =>
        change.date >= "2026-10-01" &&
        change.date <= "2026-10-31" &&
        change.field === "rate" &&
        (change.term_months === 36 || change.term_months === 60) &&
        (change.rate_type === "fixed" || change.rate_type === "variable"),
    );
    const increases = focus.filter((change) => change.direction === "hike");
    const decreases = focus.filter((change) => change.direction === "cut");
    assert.equal(focus.length, OCTOBER_2026_RATE_CHANGES.total);
    assert.equal(increases.length, OCTOBER_2026_RATE_CHANGES.increases);
    assert.equal(decreases.length, OCTOBER_2026_RATE_CHANGES.decreases);
    assert.equal(new Set(focus.map((change) => change.lender_slug)).size, OCTOBER_2026_RATE_CHANGES.lenders);
    for (const row of OCTOBER_2026_RATE_CHANGES.products) {
      const matching = focus.filter((change) => change.term_months === row.termMonths && change.rate_type === row.rateType);
      assert.equal(matching.filter((change) => change.direction === "hike").length, row.increases, row.label);
      assert.equal(matching.filter((change) => change.direction === "cut").length, row.decreases, row.label);
    }
    const afterPrime = focus.filter((change) => change.rate_type === "variable" && change.date >= "2026-10-29" && change.direction === "hike");
    const quarterPoint = afterPrime.filter((change) => Math.round((change.rate - change.previous) * 100) === 25);
    assert.equal(afterPrime.length, OCTOBER_2026_RATE_CHANGES.variableIncreasesOnOrAfterPrime);
    assert.equal(quarterPoint.length, OCTOBER_2026_RATE_CHANGES.variableIncreasesOfQuarterPoint);
    assert.match(post.content, new RegExp(`${OCTOBER_2026_RATE_CHANGES.total} advertised-rate changes`));
    assert.match(post.content, /N = 140(?!\d)/);
    assert.match(post.content, />120</);
    assert.match(post.content, />20</);
  });

  it("links the report from the data hub, guides, editorial policy, discount page, real rates, and the latest weekly post", () => {
    const href = `/blog/${NOVEMBER_2026_SLUG}/`;
    assert.ok(DATA_LINKS.some((link) => link.href === href));
    assert.ok(DATA_LINKS.some((link) => link.href === "/blog/below-the-line-mortgage-rate-report-october-2026/"));
    for (const path of [
      "src/views/data/DiscountByBankPage.tsx",
      "src/views/guides/GuidesIndex.tsx",
      "src/content/editorialPages.ts",
      "src/views/community/RealRatesPage.tsx",
      "src/lib/communityReportCopy.ts",
    ]) {
      assert.match(read(path), new RegExp(NOVEMBER_2026_SLUG), path);
    }
    assert.equal(latestWeeklySlug(), "best-5-year-fixed-rates-week-44-2026");
    const weekly = blogPosts.find((item) => item.slug === "best-5-year-fixed-rates-week-44-2026");
    assert.ok(weekly);
    assert.match(weekly.content, new RegExp(NOVEMBER_2026_SLUG));
    assert.equal(forbidden.test(weekly.content), false);
  });
});
