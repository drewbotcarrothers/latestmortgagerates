import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { INDEXED_CITY_SLUGS, isIndexablePath, isIndexedCity } from "./indexedCities.mjs";
import { allCitySlugs } from "./cities.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("AdSense approval pages", () => {
  it("uses contact@ on contact, about, disclaimer, and privacy", () => {
    for (const path of [
      "src/views/contact/ContactPage.tsx",
      "src/pages/contact/index.astro",
      "src/views/about/AboutPage.tsx",
      "src/views/disclaimer/DisclaimerPage.tsx",
      "src/views/privacy/PrivacyPage.tsx",
      "src/views/terms/TermsPage.tsx",
    ]) {
      const source = read(path);
      assert.match(source, /contact@latestmortgagerates\.ca/, path);
      assert.doesNotMatch(source, /hello@|privacy@|legal@/, path);
    }
    const contact = read("src/views/contact/ContactPage.tsx");
    assert.match(contact, /mailto:contact@latestmortgagerates\.ca/);
    assert.doesNotMatch(contact, /<form/);
  });

  it("links About, Contact, Disclaimer, Privacy, and Terms from the footer", () => {
    const footer = read("src/components/Footer.tsx");
    for (const href of ["/about/", "/contact/", "/disclaimer/", "/privacy/", "/terms/"]) {
      assert.ok(footer.includes(`href="${href}"`), href);
    }
  });

  it("states the AdSense cookie disclosures and drops the contact-form claim", () => {
    const privacy = read("src/views/privacy/PrivacyPage.tsx");
    assert.match(privacy, /October 9, 2026/);
    assert.match(privacy, /https:\/\/adssettings\.google\.com/);
    assert.match(privacy, /https:\/\/youradchoices\.ca/);
    assert.match(privacy, /https:\/\/www\.aboutads\.info/);
    assert.match(privacy, /https:\/\/policies\.google\.com\/technologies\/partner-sites/);
    assert.match(privacy, /PIPEDA/);
    assert.match(privacy, /prior visits/);
    assert.doesNotMatch(privacy, /contact forms/);
  });

  it("keeps glossary terms and smaller cities out of the indexable set", () => {
    assert.equal(isIndexablePath("/glossary/"), true);
    assert.equal(isIndexablePath("/glossary/amortization/"), false);
    assert.equal(isIndexablePath("/unsubscribed/"), false);
    assert.equal(isIndexedCity("toronto"), true);
    assert.equal(isIndexedCity("oshawa"), true);
    assert.equal(isIndexedCity("kelowna"), false);
    assert.equal(INDEXED_CITY_SLUGS.length, 19);
    for (const slug of allCitySlugs()) {
      const indexable = isIndexablePath(`/cities/${slug}/`);
      assert.equal(indexable, isIndexedCity(slug), slug);
    }
    const glossary = read("src/pages/glossary/[slug].astro");
    assert.match(glossary, /noIndex=\{true\}/);
    assert.match(glossary, /robots="noindex, follow"/);
    const unsubscribed = read("src/pages/unsubscribed/index.astro");
    assert.match(unsubscribed, /noIndex=\{true\}/);
    assert.match(unsubscribed, /robots="noindex, follow"/);
  });

  it("redirects /rates/ and HTTP to the https apex without dropping the www rule", () => {
    const htaccess = read("public/.htaccess");
    const www = htaccess.indexOf("www\\.latestmortgagerates");
    const https = htaccess.indexOf("%{HTTPS} !=on");
    assert.ok(www !== -1 && https !== -1 && www < https);
    assert.match(htaccess, /RewriteRule \^rates\/\?\$ \/ \[R=301,L\]/);
    assert.match(htaccess, /https:\/\/latestmortgagerates\.ca\/\$1 \[R=301,L\]/);
  });

  it("marks 2025 posts and separates the negotiate-guide ad from the buy button", () => {
    const post = read("src/views/blog/BlogPost.tsx");
    assert.match(post, /This post is from 2025/);
    assert.match(post, /href="\/"/);
    const guide = read("src/views/guides/NegotiateGuidePage.tsx");
    const buy = guide.indexOf("<GuideCTA />");
    const ad = guide.indexOf("<AdUnit");
    assert.ok(ad !== -1 && buy !== -1 && ad < buy);
    assert.ok(guide.slice(ad, buy).includes("<h2"));
    const cta = read("src/components/GuideCTA.tsx");
    assert.match(cta, /could save thousands, depending on your mortgage/i);
    assert.doesNotMatch(cta, /Insider secrets|\$5,000/);
  });

  it("adds a byline, review date, and sources line on lender, city, and rate hubs", () => {
    for (const path of [
      "src/views/lenders/LenderPage.tsx",
      "src/views/cities/CityPage.tsx",
      "src/views/rates/FiveYearFixedPage.tsx",
      "src/views/rates/VariablePage.tsx",
      "src/views/rates/InsuredPage.tsx",
      "src/views/rates/UninsuredPage.tsx",
    ]) {
      const source = read(path);
      assert.match(source, /EditorialByline/, path);
      assert.match(source, /buildDateIso/, path);
    }
    const byline = read("src/components/EditorialByline.tsx");
    assert.match(byline, /By Andrew/);
    assert.match(byline, /Last reviewed/);
  });
});
