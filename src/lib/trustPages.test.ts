import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { blogPosts } from "../content/blog.ts";
import { editorialPolicySections, editorialWordCount } from "../content/editorialPages.ts";
import { IN_DEPTH_GUIDES } from "../content/inDepthGuides.ts";
import { negotiateGuide } from "../content/guides/negotiateMeta.ts";
import {
  ARTICLE_AUTHOR,
  ARTICLE_PUBLISHER,
  articleJsonLd,
  blogDateModified,
  guideDates,
  isMonthlyRateReport,
} from "./articleSchema.ts";
import { BOND_SLUG } from "./bondYieldArticle.ts";
import { communityRates } from "./communityRates.ts";
import {
  MEASUREMENT_TECHNIQUE,
  monthlyReportDatasetJsonLd,
  realRatesDatasetJsonLd,
} from "./datasetSchema.ts";
import { HOME_DESCRIPTION, HOME_TITLE } from "./homeMeta.ts";
import { LENDER_COUNT, lenderCountLabel } from "./lenderCount.ts";
import { buildLlmsTxt } from "./llmsTxt.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));
const forbidden = /reddit|redflagdeals|red flag deals|\brfd\b|carrothers/i;

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("trust pages and search metadata", () => {
  it("sets the homepage title from the lender count in the rate file", () => {
    assert.ok(LENDER_COUNT >= 25, `lender count is ${LENDER_COUNT}`);
    assert.equal(HOME_TITLE, `Compare Mortgage Rates in Canada: ${lenderCountLabel} Lenders, Updated Daily`);
    assert.match(HOME_DESCRIPTION, new RegExp(lenderCountLabel.replace("+", "\\+")));
    assert.match(HOME_DESCRIPTION, /updated daily/i);
    const page = read("src/pages/index.astro");
    assert.match(page, /HOME_TITLE/);
    assert.match(page, /HOME_DESCRIPTION/);
  });

  it("retitles the glossary and links prime rate to /prime-rate/", () => {
    assert.match(read("src/pages/glossary/index.astro"), /Mortgage Terms Glossary \(Canada\)/);
    assert.match(read("src/views/glossary/GlossaryIndex.tsx"), /This glossary defines mortgage terms the way they are used in Canada/);
    const term = read("src/views/glossary/GlossaryTerm.tsx");
    assert.match(term, /slug === "prime-rate"/);
    assert.match(term, /href="\/prime-rate\/"/);
  });

  it("links the editorial policy from the footer, author page, and about page", () => {
    for (const path of [
      "src/components/Footer.tsx",
      "src/views/author/AuthorPage.tsx",
      "src/views/about/AboutPage.tsx",
      "src/content/editorialPages.ts",
    ]) {
      assert.match(read(path), /\/editorial-policy\//, path);
    }
    const policy = editorialPolicySections.flatMap((section) => [section.heading, ...section.paragraphs]).join("\n");
    assert.match(policy, /contact@latestmortgagerates\.ca/);
    assert.match(policy, /Independence/);
    assert.match(policy, /fact-check|Fact-checking/i);
    assert.match(policy, /twice a day/i);
    assert.match(policy, /Advertising and affiliate disclosure/);
    assert.match(policy, /Bank of Canada/);
    assert.ok(editorialWordCount(editorialPolicySections) >= 400);
    assert.equal(forbidden.test(policy), false);
  });

  it("states the borrower-reported rules on the methodology page", () => {
    const page = read("src/views/community/MethodologyPage.tsx");
    assert.match(page, /twice a day/i);
    assert.match(page, /N is shown/);
    assert.match(page, /publicMinN/);
    assert.match(page, /0\.05/);
    assert.match(page, /communityRates\.attribution/);
    assert.match(page, /communityRates\.disclaimer/);
    assert.match(page, /Outlier handling/);
    assert.match(page, /do not delete a report because the rate is high or low/i);
    assert.equal(forbidden.test(page), false);
  });

  it("builds llms.txt from the guides, tools, rates, and contact address", () => {
    const text = buildLlmsTxt();
    assert.match(text, /contact@latestmortgagerates\.ca/);
    assert.match(text, /self-reported by Canadian borrowers online/);
    assert.match(text, /\/editorial-policy\//);
    assert.match(text, /\/real-mortgage-rates\//);
    assert.match(text, /\/methodology\//);
    assert.match(text, /\/rates\/5-year-fixed\//);
    assert.match(text, /\/tools\/mortgage-calculator\//);
    assert.match(text, /\/llms\.txt|Latest Mortgage Rates/);
    for (const guide of IN_DEPTH_GUIDES) {
      assert.ok(text.includes(guide.path), guide.path);
    }
    assert.ok(text.includes(negotiateGuide.path));
    for (const path of [
      "/prime-rate/",
      "/rate-changes/",
      "/mortgage-break-costs/",
      "/mortgage-rate-forecast-2027/",
      "/reports/discount-by-bank/",
      "/rate-data/",
      "/lenders/",
      "/lenders/td/",
      "/lenders/rbc/",
    ]) {
      assert.ok(text.includes(path), path);
    }
    assert.equal(forbidden.test(text), false);
    assert.match(read("astro.config.mjs"), /latestmortgagerates\.ca\/llms\.txt/);
    assert.match(read("astro.config.mjs"), /editorial-policy/);
    assert.match(read("src/pages/llms.txt.ts"), /buildLlmsTxt/);
  });

  it("adds Article schema on guides and fixes the October report dateModified", () => {
    const guide = IN_DEPTH_GUIDES[0];
    const dates = guideDates(guide);
    const article = articleJsonLd({
      headline: guide.h1,
      description: guide.description,
      datePublished: dates.datePublished,
      dateModified: dates.dateModified,
      url: `https://latestmortgagerates.ca${guide.path}`,
    });
    assert.equal(article["@type"], "Article");
    assert.equal(article.headline, guide.h1);
    assert.equal(article.author, ARTICLE_AUTHOR);
    assert.equal(ARTICLE_AUTHOR.name, "Andrew");
    assert.equal(ARTICLE_AUTHOR.url, "https://latestmortgagerates.ca/author/andrew/");
    assert.equal(ARTICLE_PUBLISHER["@type"], "Organization");
    assert.equal(ARTICLE_PUBLISHER.logo["@type"], "ImageObject");
    assert.match(ARTICLE_PUBLISHER.logo.url, /logo\.png$/);

    const overridden = guideDates({ reviewedIso: "2026-10-01T12:00:00Z", updatedDate: "2026-10-18" });
    assert.equal(overridden.datePublished, "2026-10-01");
    assert.equal(overridden.dateModified, "2026-10-18");

    const october = blogPosts.find((post) => post.slug === "below-the-line-mortgage-rate-report-october-2026");
    assert.ok(october);
    assert.equal(october.date, "2026-10-03");
    assert.equal(blogDateModified(october), communityRates.asOf);
    assert.equal(blogDateModified({ slug: october.slug, date: "2026-10-03" }), communityRates.asOf);
    assert.notEqual(communityRates.asOf, "2026-10-03");

    const posting = articleJsonLd({
      type: "BlogPosting",
      headline: october.title,
      description: october.excerpt,
      datePublished: october.date,
      dateModified: blogDateModified(october),
      url: `https://latestmortgagerates.ca/blog/${october.slug}/`,
    });
    assert.equal(posting.datePublished, "2026-10-03");
    assert.equal(posting.dateModified, communityRates.asOf);

    assert.match(read("src/views/guides/InDepthGuidePage.tsx"), /articleJsonLd/);
    assert.match(read("src/views/guides/InDepthGuidePage.tsx"), /updatedIso/);
    assert.equal(IN_DEPTH_GUIDES.length, 16);
    assert.match(read("src/views/author/AuthorPage.tsx"), /IN_DEPTH_GUIDES\.map/);
    for (const slug of [
      "porting-mortgage-canada",
      "should-i-lock-in-variable-rate",
      "2027-mortgage-renewal-wave",
      "heloc-rates-canada",
    ]) {
      const page = read(`src/pages/guides/${slug}/index.astro`);
      assert.match(page, /InDepthGuidePage/, slug);
      assert.match(page, new RegExp(slug), slug);
      assert.ok(IN_DEPTH_GUIDES.some((guide) => guide.slug === slug), slug);
    }
    assert.match(read("src/views/guides/NegotiateGuidePage.tsx"), /Updated /);
    assert.match(read("src/views/blog/BlogPost.tsx"), /Updated /);
    assert.match(read("src/components/EditorialByline.tsx"), /Updated /);
  });

  it("describes the real-rate dataset with the as-of date, not the article publish date", () => {
    const dataset = realRatesDatasetJsonLd();
    assert.equal(dataset["@type"], "Dataset");
    assert.equal(dataset.dateModified, communityRates.asOf);
    assert.equal(dataset.isAccessibleForFree, true);
    assert.ok(dataset.license);
    assert.equal(dataset.creator["@type"], "Organization");
    assert.equal(dataset.measurementTechnique, MEASUREMENT_TECHNIQUE);
    assert.match(dataset.measurementTechnique, /self-reported by Canadian borrowers online/);
    assert.match(dataset.measurementTechnique, /daily lender posted-rate scrape/);
    assert.ok(dataset.variableMeasured.length >= 4);
    assert.match(dataset.temporalCoverage, /^\d{4}-\d{2}-\d{2}\/\d{4}-\d{2}-\d{2}$/);

    const report = monthlyReportDatasetJsonLd({
      slug: "below-the-line-mortgage-rate-report-october-2026",
      name: "Below-the-Line Mortgage Rate Report: October 2026",
      description: "October report",
    });
    assert.equal(report.dateModified, communityRates.asOf);
    assert.match(read("src/views/community/RealRatesPage.tsx"), /realRatesDatasetJsonLd/);
    assert.match(read("src/views/blog/BlogPost.tsx"), /monthlyReportDatasetJsonLd/);
    assert.match(read("src/views/blog/BlogPost.tsx"), /isMonthlyRateReport\(post\.slug\)/);
    assert.equal(isMonthlyRateReport(BOND_SLUG), false);
    assert.equal(forbidden.test(JSON.stringify(dataset)), false);

    const datasetPages = [
      "src/pages/prime-rate/index.astro",
      "src/pages/rate-changes/index.astro",
      "src/pages/mortgage-break-costs/index.astro",
      "src/pages/mortgage-rate-forecast-2027/index.astro",
      "src/pages/reports/discount-by-bank/index.astro",
      "src/pages/rate-data/index.astro",
      "src/pages/blog/[slug].astro",
    ];
    for (const path of datasetPages) {
      const source = read(path);
      assert.equal((source.match(/datasetJsonLd\(/g) || []).length, 1, path);
      assert.equal((source.match(/application\/ld\+json/g) || []).length, 1, path);
      assert.doesNotMatch(source, /realRatesDatasetJsonLd|monthlyReportDatasetJsonLd|communityDatasetJsonLd/, path);
    }
    for (const view of [
      "src/views/data/PrimeRatePage.tsx",
      "src/views/data/RateChangesPage.tsx",
      "src/views/data/BreakCostsPage.tsx",
      "src/views/data/ForecastPage.tsx",
      "src/views/data/DiscountByBankPage.tsx",
      "src/views/data/RateDataPage.tsx",
    ]) {
      assert.doesNotMatch(read(view), /datasetJsonLd|application\/ld\+json|realRatesDatasetJsonLd/, view);
    }
  });
});
