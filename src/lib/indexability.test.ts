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

const THIN_LENDERS = [
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

  it("noindexes thin lender pages from the data flag and can index them again by clearing it", () => {
    const flagged = new Set(noIndexLenderSlugs());
    for (const slug of THIN_LENDERS) {
      assert.equal(flagged.has(slug), true, slug);
      assert.equal(isIndexablePath(`/lenders/${slug}/`), false, slug);
    }
    assert.equal(isIndexablePath("/lenders/td/"), true);
    assert.equal(isIndexablePath("/lenders/rbc/"), true);
    assert.equal(isIndexablePath("/lenders/bmo/"), true);
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
    ];
    for (const file of files) {
      assert.equal(forbidden.test(readFileSync(join(root, file), "utf8")), false, file);
    }
  });
});
