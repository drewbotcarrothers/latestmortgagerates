import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { CITIES, allCitySlugs, cityPath, getCity, requireCity } from "./cities.ts";
import { allResolvedCityContent, getCityContent, getCitySeo } from "./cityContent.ts";

const SRC = fileURLToPath(new URL("..", import.meta.url));

const FEATURED = [
  "toronto",
  "vancouver",
  "calgary",
  "edmonton",
  "ottawa",
  "montreal",
  "mississauga",
  "brampton",
  "winnipeg",
  "halifax",
  "victoria",
  "hamilton",
  "london",
  "kitchener",
  "quebec-city",
];

const inventedPostedRate = /\d+\.\d{2}\s*%/;
const inventedAveragePrice = /average home price/i;

describe("city catalog", () => {
  it("covers every static city directory except the index", () => {
    const dirs = readdirSync(join(SRC, "pages/cities")).filter((name) => !name.includes("."));
    assert.deepEqual([...dirs].sort(), [...allCitySlugs()].sort());
  });

  it("only lists nearby slugs that exist", () => {
    for (const city of CITIES) {
      for (const near of city.nearby) {
        assert.ok(getCity(near), `${city.slug} nearby missing page: ${near}`);
        assert.notEqual(near, city.slug, `${city.slug} should not list itself as nearby`);
      }
    }
  });

  it("uses trailing slashes on city paths", () => {
    for (const slug of allCitySlugs()) {
      assert.equal(cityPath(slug), `/cities/${slug}/`);
    }
  });
});

describe("city local content", () => {
  const all = allResolvedCityContent();

  it("resolves unique title, description, and H1 for every city", () => {
    const titles = all.map((c) => c.seo.title);
    const descriptions = all.map((c) => c.seo.description);
    const h1s = all.map((c) => c.seo.h1);
    assert.equal(new Set(titles).size, all.length);
    assert.equal(new Set(descriptions).size, all.length);
    assert.equal(new Set(h1s).size, all.length);
    for (const city of all) {
      assert.match(city.seo.title, new RegExp(city.name.replace(".", "\\.")));
      assert.match(city.seo.h1, new RegExp(city.name.replace(".", "\\.")));
      assert.equal(city.seo.canonical, `https://latestmortgagerates.ca/cities/${city.slug}/`);
      assert.match(city.seo.canonical, /\/$/);
      assert.ok(city.seo.title.length <= 70, `${city.slug} title too long: ${city.seo.title}`);
      assert.ok(city.faqs.length >= 3, `${city.slug} needs local FAQs`);
      assert.ok(city.intro.includes(city.name), `${city.slug} intro missing city name`);
      assert.ok(city.nearby.length >= 1, `${city.slug} needs nearby cities`);
    }
  });

  it("does not invent posted rates or average home prices in editorial copy", () => {
    for (const city of all) {
      const blob = [
        city.intro,
        city.lttBody,
        city.heroTagline,
        city.firstTimeBuyer.intro,
        city.renewal.intro,
        ...city.marketNotes,
        ...city.faqs.map((f) => f.question + f.answer),
        city.seo.title,
        city.seo.description,
      ].join("\n");
      assert.doesNotMatch(blob, inventedPostedRate, city.slug);
      assert.doesNotMatch(blob, inventedAveragePrice, city.slug);
      assert.doesNotMatch(blob, /AggregateRating|reviewCount|ratingValue/);
    }
  });

  it("keeps Toronto and a smaller Alberta city on different tax and FAQ copy", () => {
    const toronto = getCityContent("toronto");
    const hat = getCityContent("medicine-hat");
    assert.match(toronto.lttHeadline, /municipal/i);
    assert.match(toronto.lttBody, /\$4,475/);
    assert.equal(hat.lttHasProvincialTax, false);
    assert.match(hat.lttHeadline, /no provincial land transfer tax/i);
    assert.notEqual(toronto.intro, hat.intro);
    assert.notEqual(toronto.faqs[0].question, hat.faqs[0].question);
    assert.ok(toronto.faqs.length >= 5);
  });

  it("tells Mississauga shoppers they do not pay Toronto MLTT", () => {
    const miss = getCityContent("mississauga");
    assert.match(miss.lttBody, /Toronto/i);
    assert.match(miss.intro, /not the City of Toronto|not pay Toronto|no Toronto/i);
    assert.ok(miss.faqs.some((f) => /toronto/i.test(f.question + f.answer)));
  });

  it("documents Halifax HRM 1.5% deed transfer tax without a first-time rebate", () => {
    const halifax = getCityContent("halifax");
    assert.match(halifax.lttBody, /1\.5%/);
    assert.match(halifax.lttBody, /By-law D-200|deed transfer/i);
    assert.ok(halifax.faqs.some((f) => /rebate/i.test(f.question)));
  });

  it("gives featured high-search cities extra local depth", () => {
    for (const slug of FEATURED) {
      const city = getCityContent(slug);
      assert.equal(city.featured, true, slug);
      assert.ok(city.faqs.length >= 4, slug);
      assert.ok(city.intro.length > 180, `${slug} intro too thin`);
    }
  });

  it("points every city at a real tax or closing-cost tool with a trailing slash", () => {
    for (const city of all) {
      assert.match(city.lttToolHref, /\/$/);
      assert.ok(
        city.lttToolHref === "/tools/land-transfer-tax-calculator/" ||
          city.lttToolHref === "/tools/closing-costs-calculator/",
        city.slug
      );
      if (city.province === "ON" || city.province === "BC" || city.province === "QC") {
        assert.equal(city.lttToolHref, "/tools/land-transfer-tax-calculator/");
      }
      if (city.province === "AB" || city.province === "SK") {
        assert.equal(city.lttHasProvincialTax, false);
        assert.equal(city.lttToolHref, "/tools/closing-costs-calculator/");
      }
    }
  });

  it("exports SEO used by Astro city pages", () => {
    const seo = getCitySeo("vancouver");
    assert.match(seo.title, /Vancouver/i);
    assert.match(seo.title, /PTT|Property Transfer/i);
    const city = requireCity("vancouver");
    assert.equal(city.province, "BC");
  });
});

describe("city page wiring", () => {
  it("uses the shared CityPage + getCitySeo on every city route", () => {
    const missing: string[] = [];
    for (const slug of allCitySlugs()) {
      const text = readFileSync(join(SRC, "pages/cities", slug, "index.astro"), "utf8");
      if (!text.includes("CityPage") || !text.includes("getCitySeo") || !text.includes(`slug="${slug}"`)) {
        missing.push(slug);
      }
    }
    assert.equal(missing.length, 0, missing.join(", "));
  });

  it("keeps GuideCTA and AdUnit on CityTools, not the city template", () => {
    const page = readFileSync(join(SRC, "views/cities/CityPage.tsx"), "utf8");
    const local = readFileSync(join(SRC, "components/CityLocalContent.tsx"), "utf8");
    assert.match(page, /<CityTools /);
    assert.match(page, /<CityLocalContent /);
    assert.doesNotMatch(page, /GuideCTA/);
    assert.doesNotMatch(page, /AdUnit/);
    assert.doesNotMatch(local, /GuideCTA/);
    assert.doesNotMatch(local, /AdUnit/);
    assert.doesNotMatch(page, /LocalBusiness/);
    assert.doesNotMatch(page, /AggregateRating/);
  });
});
