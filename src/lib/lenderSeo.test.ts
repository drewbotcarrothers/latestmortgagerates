import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const lenderContent = JSON.parse(
  readFileSync(join(root, "src/content/lenderContent.json"), "utf8")
) as Record<string, Record<string, unknown>>;

const inventedRate = /\d+\.\d{2}\s*%/;

function asRecord(slug: string) {
  const content = lenderContent[slug];
  assert.ok(content, `missing lender content for ${slug}`);
  return content;
}

describe("GSC near-page-1 lender SEO", () => {
  it("optimizes Wealthsimple for the mortgage-rates query cluster", () => {
    const ws = asRecord("wealthsimple");
    const title = String(ws.seoTitle);
    const description = String(ws.seoDescription);
    const faqs = ws.faqs as { question: string; answer: string }[];
    const questions = faqs.map((f) => f.question.toLowerCase());

    assert.match(title, /Wealthsimple Mortgage Rates/i);
    assert.match(title, /Canada|Big 5/i);
    assert.ok(title.length <= 60, `title too long for SERP: ${title.length}`);
    assert.match(description, /Does Wealthsimple offer mortgages/i);
    assert.match(String(ws.heroIntro), /Wealthsimple mortgage rates/i);
    assert.match(String(ws.overview), /Does Wealthsimple offer mortgages/);
    assert.ok((ws.relatedLinks as unknown[]).length >= 6);
    assert.ok(faqs.length >= 6);
    assert.ok(questions.some((q) => q.includes("does wealthsimple offer mortgages")));
    assert.ok(questions.some((q) => q.includes("prime")));
    assert.ok(questions.some((q) => q.includes("big 5") || q.includes("banks")));
    for (const faq of faqs) {
      assert.doesNotMatch(faq.answer, inventedRate, faq.question);
    }
  });

  it("targets Vancity and Meridian Credit Union mortgage-rate queries", () => {
    const vancity = asRecord("vancity");
    const meridian = asRecord("meridian");
    assert.match(String(vancity.seoTitle), /Vancity Mortgage Rates/i);
    assert.match(String(meridian.seoTitle), /Meridian Credit Union Mortgage Rates/i);
    assert.ok((vancity.faqs as unknown[]).length >= 5);
    assert.ok((meridian.faqs as unknown[]).length >= 5);
    assert.match(String(vancity.overview), /Mixer Mortgage/);
    assert.match(String(meridian.overview), /Maximum Mortgage/);
  });

  it("leads ATB title with the query and keeps a current-rates FAQ", () => {
    const atb = asRecord("atb");
    assert.ok(String(atb.seoTitle).startsWith("ATB Mortgage Rates"));
    const faqs = atb.faqs as { question: string; answer: string }[];
    assert.ok(faqs.some((f) => /current ATB mortgage rates/i.test(f.question)));
    for (const faq of faqs) {
      assert.doesNotMatch(faq.answer, inventedRate, faq.question);
    }
  });

  it("aligns TD copy with the affordability-calculator query", () => {
    const td = asRecord("td");
    assert.match(String(td.seoTitle), /Affordability/i);
    assert.match(String(td.seoDescription), /affordability/i);
    const faqs = td.faqs as { question: string; answer: string }[];
    assert.ok(faqs.some((f) => /affordability calculator/i.test(f.question)));
    const links = td.relatedLinks as { href: string }[];
    assert.ok(links.some((l) => l.href.includes("affordability-calculator")));
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
