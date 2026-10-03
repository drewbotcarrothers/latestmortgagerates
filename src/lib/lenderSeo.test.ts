import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { formatBuildMonthYear } from "./buildDate.ts";
import {
  hasDoubledWord,
  lenderSeoDescription,
  lenderRatesHeading,
  lenderRatesKeyword,
  lenderSeoTitle,
  trueNorthDescription,
  type LenderRateRow,
} from "./lenderSeo.ts";
import { buildTodayRows } from "./todaysRates.ts";
import { STRIKING_DISTANCE_LENDER_LINKS, isWeeklyRatePost } from "./lenderLinks.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const lenderContent = JSON.parse(
  readFileSync(join(root, "src/content/lenderContent.json"), "utf8")
) as Record<string, Record<string, unknown>>;
const rates = JSON.parse(readFileSync(join(root, "data/rates.json"), "utf8")) as (LenderRateRow & {
  lender_slug: string;
  lender_name: string;
})[];

const inventedRate = /\d+\.\d{2}\s*%/;
const october = new Date("2026-10-03T16:00:00Z");
const monthYear = formatBuildMonthYear(october);

function asRecord(slug: string) {
  const content = lenderContent[slug];
  assert.ok(content, `missing lender content for ${slug}`);
  return content;
}

function ratesFor(slug: string) {
  return rates.filter((row) => row.lender_slug === slug);
}

describe("GSC near-page-1 lender SEO", () => {
  it("builds Wealthsimple, ATB, Vancity, and Meridian titles from the build month", () => {
    assert.equal(monthYear, "Oct 2026");
    assert.equal(
      lenderSeoTitle("wealthsimple", "Wealthsimple", monthYear),
      "Wealthsimple Mortgage Rates Today (Oct 2026): Fixed & Variable vs Big 5"
    );
    assert.equal(
      lenderSeoTitle("atb", "ATB Financial", monthYear),
      "ATB Mortgage Rates Today (Oct 2026) – ATB Financial Fixed, Variable & HELOC"
    );
    assert.equal(
      lenderSeoTitle("vancity", "Vancity", monthYear),
      "Vancity Mortgage Rates Today (Oct 2026) – BC Fixed & Variable vs Banks"
    );
    assert.equal(
      lenderSeoTitle("meridian", "Meridian Credit Union", monthYear),
      "Meridian Credit Union Mortgage Rates Today (Oct 2026) – Ontario Fixed, Variable & HELOC"
    );
    const january = formatBuildMonthYear(new Date("2027-01-15T16:00:00Z"));
    assert.equal(january, "Jan 2027");
    assert.match(lenderSeoTitle("wealthsimple", "Wealthsimple", january), /\(Jan 2027\)/);
    assert.doesNotMatch(
      readFileSync(join(root, "src/lib/lenderSeo.ts"), "utf8"),
      /Oct 2026/
    );
    assert.match(
      readFileSync(join(root, "src/pages/lenders/[slug].astro"), "utf8"),
      /formatBuildMonthYear/
    );
  });

  it("optimizes Wealthsimple for the mortgage-rates query cluster", () => {
    const ws = asRecord("wealthsimple");
    const title = lenderSeoTitle("wealthsimple", "Wealthsimple", monthYear);
    const description = String(ws.seoDescription);
    const faqs = ws.faqs as { question: string; answer: string }[];
    const questions = faqs.map((faq) => faq.question.toLowerCase());

    assert.match(title, /Wealthsimple Mortgage Rates Today/i);
    assert.match(title, /Big 5/i);
    assert.match(description, /Does Wealthsimple offer mortgages/i);
    assert.match(String(ws.heroIntro), /Wealthsimple mortgage rates/i);
    assert.match(String(ws.overview), /Does Wealthsimple offer mortgages/);
    assert.ok((ws.relatedLinks as unknown[]).length >= 6);
    assert.ok(faqs.length >= 6);
    assert.ok(questions.some((question) => question.includes("does wealthsimple offer mortgages")));
    assert.ok(questions.some((question) => question.includes("wealthsimple mortgage rate today")));
    assert.ok(questions.some((question) => question.includes("fixed")));
    assert.ok(questions.some((question) => question.includes("variable")));
    assert.ok(questions.some((question) => question.includes("renew")));
    assert.ok(questions.some((question) => question.includes("prime")));
    assert.ok(questions.some((question) => question.includes("big 5") || question.includes("banks")));
    for (const faq of faqs) {
      assert.doesNotMatch(faq.answer, inventedRate, faq.question);
    }
  });

  it("targets Vancity and Meridian Credit Union mortgage-rate queries", () => {
    const vancity = asRecord("vancity");
    const meridian = asRecord("meridian");
    assert.match(lenderSeoTitle("vancity", "Vancity", monthYear), /Vancity Mortgage Rates Today/i);
    assert.match(
      lenderSeoTitle("meridian", "Meridian Credit Union", monthYear),
      /Meridian Credit Union Mortgage Rates Today/i
    );
    const vancityQuestions = (vancity.faqs as { question: string }[]).map((faq) => faq.question.toLowerCase());
    const meridianQuestions = (meridian.faqs as { question: string }[]).map((faq) => faq.question.toLowerCase());
    assert.ok(vancityQuestions.some((question) => question.includes("van city")));
    assert.ok(vancityQuestions.some((question) => question.includes("today")));
    assert.ok(vancityQuestions.some((question) => question.includes("fixed")));
    assert.ok(vancityQuestions.some((question) => question.includes("variable")));
    assert.ok(vancityQuestions.some((question) => question.includes("renewal")));
    assert.ok(meridianQuestions.some((question) => question.includes("ontario")));
    assert.ok(meridianQuestions.some((question) => question.includes("heloc")));
    assert.ok(meridianQuestions.some((question) => question.includes("renewal")));
    assert.ok((vancity.faqs as unknown[]).length >= 5);
    assert.ok((meridian.faqs as unknown[]).length >= 5);
    assert.match(String(vancity.overview), /Mixer Mortgage/);
    assert.match(String(meridian.overview), /Maximum Mortgage/);
    for (const faq of [...(vancity.faqs as { answer: string; question: string }[]), ...(meridian.faqs as { answer: string; question: string }[])]) {
      assert.doesNotMatch(faq.answer, inventedRate, faq.question);
    }
  });

  it("leads ATB title with the query and keeps a current-rates FAQ", () => {
    const atb = asRecord("atb");
    assert.ok(lenderSeoTitle("atb", "ATB Financial", monthYear).startsWith("ATB Mortgage Rates Today"));
    const faqs = atb.faqs as { question: string; answer: string }[];
    assert.ok(faqs.some((faq) => /current ATB mortgage rates/i.test(faq.question)));
    assert.ok(faqs.some((faq) => /ATB Financial mortgage rates/i.test(faq.question)));
    assert.ok(faqs.some((faq) => /fixed/i.test(faq.question)));
    assert.ok(faqs.some((faq) => /variable/i.test(faq.question)));
    assert.ok(faqs.some((faq) => /HELOC/i.test(faq.question)));
    assert.ok(faqs.some((faq) => /renewal/i.test(faq.question)));
    for (const faq of faqs) {
      assert.doesNotMatch(faq.answer, inventedRate, faq.question);
    }
  });

  it("retitles TD away from the affordability calculator and targets refinance rates", () => {
    const td = asRecord("td");
    const title = lenderSeoTitle("td", "TD Bank", monthYear);
    const description = lenderSeoDescription({
      slug: "td",
      lenderName: "TD Bank",
      stored: String(td.seoDescription),
      rates: ratesFor("td"),
    });
    assert.equal(
      title,
      "TD Mortgage Rates Today – Fixed, Variable & Special Offers (Oct 2026)"
    );
    assert.doesNotMatch(title, /calculator|affordability/i);
    assert.doesNotMatch(description, /calculator|affordability/i);
    assert.match(description, /refinance/i);
    const faqs = td.faqs as { question: string; answer: string }[];
    assert.ok(faqs.some((faq) => /td bank refinance rates/i.test(faq.question)));
    for (const faq of faqs) {
      assert.doesNotMatch(faq.answer, inventedRate, faq.question);
    }
    const sections = td.extraSections as { heading: string; html: string }[];
    assert.ok(sections.some((section) => /td bank refinance rates/i.test(section.heading)));
    assert.doesNotMatch(sections.map((section) => section.html).join(" "), inventedRate);
    const links = td.relatedLinks as { href: string }[];
    assert.ok(links.some((link) => link.href.includes("affordability-calculator")));
    const lenderPage = readFileSync(join(root, "src/views/lenders/LenderPage.tsx"), "utf8");
    assert.match(lenderPage, /<h1[^>]*>\{lenderRatesHeading\(lenderName\)\}<\/h1>/);
    assert.doesNotMatch(lenderPage, /<h1[^>]*>[^<]*[Cc]alculator/);
    assert.equal(lenderRatesHeading("True North Mortgage"), "True North Mortgage Rates");
    assert.equal(lenderRatesHeading("Butler Mortgage"), "Butler Mortgage Rates");
    assert.equal(lenderRatesKeyword("Butler Mortgage"), "Butler Mortgage rates");
    assert.equal(lenderRatesKeyword("True North Mortgage"), "True North Mortgage rates");
    assert.equal(lenderRatesHeading("TD Bank"), "TD Bank Mortgage Rates");
    assert.equal(lenderRatesKeyword("TD Bank"), "TD Bank mortgage rates");
    const compare = readFileSync(join(root, "src/views/compare/ComparePage.tsx"), "utf8");
    assert.match(compare, /href="\/lenders\/td\/"[^>]*>\s*TD mortgage rates/);
  });

  it("fixes the True North doubled title and drops the guaranteed rate claim", () => {
    const title = lenderSeoTitle("truenorth", "True North Mortgage", monthYear);
    assert.equal(title, "True North Mortgage Rates Today – Fixed & Variable vs Big Banks");
    assert.equal(hasDoubledWord(title), false);
    const description = trueNorthDescription(ratesFor("truenorth"));
    assert.doesNotMatch(description, /guaranteed/i);
    const fiveYearFixed = Math.min(
      ...ratesFor("truenorth")
        .filter((row) => row.term_months === 60 && row.rate_type === "fixed")
        .map((row) => row.rate)
    );
    assert.match(description, new RegExp(fiveYearFixed.toFixed(2)));
    const shortTerm = ratesFor("truenorth").find((row) => row.term_months === 6 && row.rate_type === "fixed");
    assert.ok(shortTerm);
    assert.notEqual(shortTerm.rate, fiveYearFixed);
    assert.doesNotMatch(description, new RegExp(shortTerm.rate.toFixed(2)));
    assert.doesNotMatch(String(asRecord("truenorth").tagline), /guaranteed/i);
  });

  it("audits every lender title and meta for doubled words and guaranteed rate claims", () => {
    const names = new Map<string, string>();
    for (const row of rates) names.set(row.lender_slug, row.lender_name);
    for (const [slug, name] of names) {
      const content = lenderContent[slug] ?? {};
      const title = lenderSeoTitle(slug, name, monthYear, content.seoTitle as string | undefined);
      const description = lenderSeoDescription({
        slug,
        lenderName: name,
        stored: content.seoDescription as string | undefined,
        tagline: content.tagline as string | undefined,
        rates: ratesFor(slug),
      });
      assert.equal(hasDoubledWord(title), false, title);
      assert.equal(hasDoubledWord(description), false, description);
      assert.equal(hasDoubledWord(lenderRatesKeyword(name)), false, lenderRatesKeyword(name));
      assert.doesNotMatch(description, /guaranteed/i, `${slug} description`);
      if (content.seoDescription) {
        assert.doesNotMatch(String(content.seoDescription), inventedRate, `${slug} stored description`);
        assert.doesNotMatch(String(content.seoDescription), /guaranteed/i, `${slug} stored description`);
      }
      if (content.seoTitle) {
        assert.equal(hasDoubledWord(String(content.seoTitle)), false, String(content.seoTitle));
      }
    }
  });

  it("builds the today's-rates table from the scrape", () => {
    const atbRows = buildTodayRows(ratesFor("atb"));
    const fiveFixed = atbRows.find((row) => row.label === "5-year fixed");
    const liveInsured = Math.min(
      ...ratesFor("atb")
        .filter((row) => row.term_months === 60 && row.rate_type === "fixed" && row.mortgage_type === "insured")
        .map((row) => row.rate)
    );
    assert.equal(fiveFixed?.insured, liveInsured);
    const wealthsimple = buildTodayRows(ratesFor("wealthsimple"));
    assert.equal(wealthsimple.find((row) => row.label === "1-year fixed")?.insured, null);
    const withPosted = buildTodayRows([
      {
        term_months: 60,
        rate_type: "fixed",
        rate: 5.34,
        mortgage_type: "uninsured",
        posted_rate: 6.09,
      },
    ]);
    assert.equal(withPosted[2].gap, 0.75);
    assert.equal(withPosted[2].posted, 6.09);
  });

  it("links the striking-distance lender pages from home, weekly posts, and compare", () => {
    const home = readFileSync(join(root, "src/views/HomePage.tsx"), "utf8");
    const blog = readFileSync(join(root, "src/views/blog/BlogPost.tsx"), "utf8");
    const compare = readFileSync(join(root, "src/views/compare/ComparePage.tsx"), "utf8");
    const compareIndex = readFileSync(join(root, "src/views/compare/CompareIndex.tsx"), "utf8");
    for (const source of [home, blog, compare, compareIndex]) {
      assert.match(source, /StrikingDistanceLenderLinks/);
    }
    assert.equal(isWeeklyRatePost("best-5-year-fixed-rates-week-40-2026"), true);
    assert.equal(isWeeklyRatePost("bank-of-canada-holds-rate-september-2026"), false);
    for (const link of STRIKING_DISTANCE_LENDER_LINKS) {
      assert.match(link.href, /^\/lenders\/[a-z]+\/$/);
      assert.match(link.anchor, /mortgage rates/i);
    }
  });

  it("does not emit review or star-rating fields in lender copy", () => {
    const blob = JSON.stringify(lenderContent);
    assert.doesNotMatch(blob, /AggregateRating/);
    assert.doesNotMatch(blob, /"reviewCount"/);
    assert.doesNotMatch(blob, /"ratingValue"/);
  });
});

describe("TD affordability tool titles", () => {
  it("names the GDS/TDS calculator in title and meta", () => {
    const page = readFileSync(
      join(root, "src/pages/tools/affordability-calculator/index.astro"),
      "utf8"
    );
    assert.match(page, /Mortgage Affordability Calculator Canada \| TD/);
    assert.match(page, /GDS\/TDS/);
  });
});
