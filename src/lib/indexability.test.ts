import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { blogPosts } from "../content/blog.ts";
import { AUTHOR_ABOUT_PARAGRAPHS, AUTHOR_BIO, AUTHOR_NAME, AUTHOR_RELATED_SITES } from "./author.ts";
import { isIndexablePath } from "./sitemapFilter.mjs";
import { blogPostRecords, latestWeeklySlug, noIndexLenderSlugs } from "./noindexPolicy.mjs";
import {
  aboutSections,
  contactSections,
  editorialWordCount,
  expertsSections,
  trendsSections,
} from "../content/editorialPages.ts";
import {
  cmhcInsuranceFaqs,
  cmhcInsuranceGuide,
  explainerWordCount,
  renewalOfferFaqs,
  renewalOfferGuide,
  rentVsBuyFaqs,
  rentVsBuyGuide,
} from "../content/calculatorGuides.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));

const REINDEXED_LENDERS = [
  "coastcapital",
  "nationalbank",
  "equitable",
  "simplii",
  "firstnational",
  "nesto",
  "hometrust",
  "tangerine",
  "butlermortgage",
  "alterna",
  "rfa",
  "truenorth",
  "scotiabank",
  "laurentian",
  "desjardins",
  "cmls",
];

function lenderPlainText(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(lenderPlainText).join(" ");
  if (typeof value === "object") return Object.values(value).map(lenderPlainText).join(" ");
  return "";
}

function wordCount(value: unknown): number {
  return lenderPlainText(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function shingles(value: unknown, n: number): Set<string> {
  const words = lenderPlainText(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const set = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) set.add(words.slice(i, i + n).join(" "));
  return set;
}

function overlapCoefficient(a: Set<string>, b: Set<string>): number {
  let shared = 0;
  const [smaller, larger] = a.size < b.size ? [a, b] : [b, a];
  for (const gram of smaller) if (larger.has(gram)) shared++;
  return smaller.size ? shared / smaller.size : 0;
}

describe("indexability", () => {
  it("keeps only the latest weekly roundup indexable, including a future week", () => {
    assert.equal(latestWeeklySlug(), "best-5-year-fixed-rates-week-43-2026");
    assert.equal(isIndexablePath("/blog/best-5-year-fixed-rates-week-43-2026/"), true);
    for (const week of [38, 39, 40, 41, 42]) {
      assert.equal(isIndexablePath(`/blog/best-5-year-fixed-rates-week-${week}-2026/`), false, String(week));
    }
    assert.equal(isIndexablePath("/blog/best-5-year-fixed-rates-week-12-2025/"), false);
    assert.equal(
      latestWeeklySlug([
        { slug: "best-5-year-fixed-rates-week-43-2026", noIndex: false },
        { slug: "best-5-year-fixed-rates-week-44-2026", noIndex: false },
      ]),
      "best-5-year-fixed-rates-week-44-2026",
    );
  });

  it("noindexes the March 2025 decision from its flag and leaves the September 2026 recap indexed", () => {
    const records = blogPostRecords();
    const march = records.find((record) => record.slug === "bank-of-canada-holds-rate-march-2025");
    assert.equal(march?.noIndex, true);
    assert.equal(isIndexablePath("/blog/bank-of-canada-holds-rate-march-2025/"), false);
    assert.equal(isIndexablePath("/blog/bank-of-canada-holds-rate-september-2026/"), true);
    assert.equal(isIndexablePath("/blog/below-the-line-mortgage-rate-report-october-2026/"), true);
  });

  it("indexes the expanded lender pages and still honours a noIndex flag", () => {
    const lenderContent = JSON.parse(readFileSync(join(root, "src/content/lenderContent.json"), "utf8"));
    const flagged = new Set(noIndexLenderSlugs());
    assert.equal(flagged.size, 0);
    let worstOverlap = 0;
    let overlapSum = 0;
    let overlapPairs = 0;
    const bags = new Map(REINDEXED_LENDERS.map((slug) => [slug, shingles(lenderContent[slug], 5)]));
    for (const slug of REINDEXED_LENDERS) {
      assert.equal(flagged.has(slug), false, slug);
      assert.equal(isIndexablePath(`/lenders/${slug}/`), true, slug);
      const words = wordCount(lenderContent[slug]);
      assert.ok(words >= 800, `${slug} is ${words} words`);
      assert.ok((lenderContent[slug].faqs || []).length >= 4, slug);
      assert.equal(lenderContent[slug].noIndex, undefined, slug);
    }
    for (let i = 0; i < REINDEXED_LENDERS.length; i++) {
      for (let j = i + 1; j < REINDEXED_LENDERS.length; j++) {
        const overlap = overlapCoefficient(bags.get(REINDEXED_LENDERS[i]), bags.get(REINDEXED_LENDERS[j]));
        worstOverlap = Math.max(worstOverlap, overlap);
        overlapSum += overlap;
        overlapPairs++;
      }
    }
    assert.ok(worstOverlap < 0.2, `max 5-shingle overlap is ${worstOverlap}`);
    assert.ok(overlapSum / overlapPairs < 0.05, `average 5-shingle overlap is ${overlapSum / overlapPairs}`);
    assert.equal(isIndexablePath("/lenders/td/"), true);
    assert.equal(isIndexablePath("/lenders/rbc/"), true);
    assert.equal(isIndexablePath("/lenders/bmo/"), true);
    assert.deepEqual(noIndexLenderSlugs({ coastcapital: { noIndex: true }, td: {} }), ["coastcapital"]);
    const cleared = noIndexLenderSlugs({ coastcapital: { noIndex: false }, td: {} });
    assert.deepEqual(cleared, []);
  });

  it("noindexes Winnipeg, Halifax, Saskatoon, and Regina until they are listed again", () => {
    for (const slug of ["winnipeg", "halifax", "saskatoon", "regina"]) {
      assert.equal(isIndexablePath(`/cities/${slug}/`), false, slug);
    }
    assert.equal(isIndexablePath("/cities/toronto/"), true);
    assert.equal(isIndexablePath("/author/andrew/"), true);
    assert.equal(isIndexablePath("/guides/"), true);
    assert.equal(isIndexablePath("/guides/negotiate-mortgage-rate/"), true);
    assert.equal(isIndexablePath("/guides/2026-mortgage-renewal-playbook/"), true);
    assert.equal(isIndexablePath("/guides/mortgage-prepayment-penalties/"), true);
    assert.equal(isIndexablePath("/guides/mortgage-stress-test/"), true);
    assert.equal(isIndexablePath("/guides/banks-vs-monoline-lenders-vs-credit-unions/"), true);
    assert.equal(isIndexablePath("/guides/fixed-vs-variable-mortgage-2026/"), true);
    assert.equal(isIndexablePath("/guides/first-time-home-buyer-programs-canada/"), true);
    assert.equal(isIndexablePath("/guides/switching-mortgage-lenders-at-renewal/"), true);
    assert.equal(isIndexablePath("/guides/posted-vs-discounted-mortgage-rates/"), true);
    assert.equal(isIndexablePath("/guides/cmhc-mortgage-insurance-canada/"), true);
    assert.equal(isIndexablePath("/guides/30-year-amortization-canada/"), true);
    assert.equal(isIndexablePath("/guides/bank-of-canada-rate-and-your-mortgage/"), true);
    assert.equal(isIndexablePath("/guides/mortgage-renewal-vs-refinance-vs-heloc/"), true);
    assert.equal(isIndexablePath("/guides/porting-mortgage-canada/"), true);
    assert.equal(isIndexablePath("/guides/should-i-lock-in-variable-rate/"), true);
    assert.equal(isIndexablePath("/guides/2027-mortgage-renewal-wave/"), true);
    assert.equal(isIndexablePath("/guides/heloc-rates-canada/"), true);
    assert.equal(isIndexablePath("/guides/closing-costs-canada-by-province/"), true);
    assert.equal(isIndexablePath("/guides/big-5-bank-mortgages-compared/"), true);
    assert.equal(isIndexablePath("/guides/blend-and-extend-mortgage/"), true);
    assert.equal(isIndexablePath("/guides/mortgage-rate-hold-canada/"), true);
  });

  it("points robots.txt at the sitemap index and drops the Reddit share button", () => {
    const robots = readFileSync(join(root, "public/robots.txt"), "utf8");
    assert.match(robots, /Sitemap: https:\/\/latestmortgagerates\.ca\/sitemap-index\.xml/);
    const share = readFileSync(join(root, "src/components/SocialShare.tsx"), "utf8");
    assert.doesNotMatch(share, /reddit/i);
    const htaccess = readFileSync(join(root, "public/.htaccess"), "utf8");
    assert.doesNotMatch(htaccess, /guides\/\?\$/);
  });
});

describe("expanded page depth", () => {
  it("keeps the public byline as Andrew and the supplied bio", () => {
    assert.equal(AUTHOR_NAME, "Andrew");
    assert.equal(
      AUTHOR_BIO,
      "Andrew is a personal finance expert, DIY investor and life optimizer based in Toronto, Canada. With over 19 years of corporate experience at a leading Canadian company, Andrew combines deep industry knowledge with a passion for technology to help others navigate personal finance and streamline their daily lives.",
    );
    for (const post of blogPosts) {
      assert.equal(post.author, "Andrew", post.slug);
    }
    const aboutAndrew = AUTHOR_ABOUT_PARAGRAPHS.join("\n");
    assert.match(aboutAndrew, /Andrew runs Latest Mortgage Rates/);
    assert.doesNotMatch(aboutAndrew, /Andrew runs Saving Optimizer/);
    assert.doesNotMatch(aboutAndrew, /Andrew [A-Z]/);
    for (const site of AUTHOR_RELATED_SITES) {
      assert.match(aboutAndrew, /related Canadian sites/);
      assert.equal(site.name.includes("LatestMortgageRates"), false);
    }
    const aboutSource = readFileSync(join(root, "src/content/editorialPages.ts"), "utf8");
    const authorPage = readFileSync(join(root, "src/views/author/AuthorPage.tsx"), "utf8");
    assert.match(aboutSource, /authorAboutSection/);
    assert.match(authorPage, /authorAboutSection/);
    const aboutWords = editorialWordCount(aboutSections);
    const expertsWords = editorialWordCount(expertsSections);
    const trendsWords = editorialWordCount(trendsSections);
    assert.ok(aboutWords >= 800, `about is ${aboutWords} words`);
    assert.ok(expertsWords >= 500, `experts is ${expertsWords} words`);
    assert.ok(trendsWords >= 500, `trends is ${trendsWords} words`);
    assert.match(contactSections.flatMap((section) => section.paragraphs).join(" "), /contact@latestmortgagerates\.ca/);
    assert.match(contactSections.flatMap((section) => section.paragraphs).join(" "), /three business days/);
    assert.match(aboutSections.flatMap((section) => section.paragraphs).join("\n"), /self-reported by Canadian borrowers online/);
  });

  it("adds 300–600 words on the three thin calculators", () => {
    const counts = {
      cmhc: explainerWordCount(cmhcInsuranceGuide(), cmhcInsuranceFaqs()),
      renewal: explainerWordCount(renewalOfferGuide(), renewalOfferFaqs()),
      rent: explainerWordCount(rentVsBuyGuide(), rentVsBuyFaqs()),
    };
    for (const [name, words] of Object.entries(counts)) {
      assert.ok(words >= 300 && words <= 600, `${name} is ${words} words`);
    }
  });

  it("does not name Reddit, RFD, or RedFlagDeals in site source", () => {
    const forbidden = /reddit|redflagdeals|red flag deals|\brfd\b/i;
    const files = [
      "src/components/SocialShare.tsx",
      "src/views/about/AboutPage.tsx",
      "src/views/contact/ContactPage.tsx",
      "src/views/experts/ExpertsPage.tsx",
      "src/views/trends/TrendsPageClient.tsx",
      "src/views/guides/GuidesIndex.tsx",
      "src/views/author/AuthorPage.tsx",
      "src/content/editorialPages.ts",
      "src/lib/author.ts",
      "src/content/calculatorGuides.ts",
      "src/content/inDepthGuides.ts",
      "src/content/guides/shared.ts",
      "src/content/guides/renewalPlaybook.ts",
      "src/content/guides/prepaymentPenalties.ts",
      "src/content/guides/stressTestGuide.ts",
      "src/content/guides/lenderTypes.ts",
      "src/content/guides/cmhcMortgageInsurance.ts",
      "src/content/guides/thirtyYearAmortization.ts",
      "src/content/guides/bankOfCanadaMortgage.ts",
      "src/content/guides/renewalVsRefinance.ts",
      "src/content/guides/batch3Math.ts",
      "src/content/guides/portingMortgage.ts",
      "src/content/guides/lockInVariable.ts",
      "src/content/guides/renewalWave2027.ts",
      "src/content/guides/helocRates.ts",
      "src/content/guides/batch4Math.ts",
      "src/content/guides/closingCosts.ts",
      "src/content/guides/bigFiveBanks.ts",
      "src/content/guides/blendAndExtend.ts",
      "src/content/guides/rateHold.ts",
      "src/views/guides/InDepthGuidePage.tsx",
      "src/content/lenderContent.json",
    ];
    for (const file of files) {
      assert.equal(forbidden.test(readFileSync(join(root, file), "utf8")), false, file);
    }
  });
});
