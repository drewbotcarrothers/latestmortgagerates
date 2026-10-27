import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { communityRates, formatAsOf, formatRate } from "./communityRates.ts";
import { negotiateAnswerLead, negotiateGuide } from "../content/guides/negotiateMeta.ts";
import {
  NEGOTIATE_RATE_VIDEO,
  NEGOTIATE_RATE_VIDEO_ID,
  NEGOTIATE_SERIES_EARLIER,
  negotiateRateVideoId,
} from "../content/guides/negotiateVideo.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("negotiate guide lead", () => {
  const cell = communityRates.windows["30d"].products.find(
    (product) => product.termMonths === 60 && product.rateType === "fixed" && product.insured === "unknown",
  );

  it("opens with two sentences, the rounded 5-year median, N, and the as-of date", () => {
    assert.ok(cell && cell.big5PostedMedian != null);
    const lead = negotiateAnswerLead();
    const sentences = lead.text.split(/(?<=\.)\s+/).filter(Boolean);
    assert.deepEqual(sentences, [lead.first, lead.second]);
    assert.match(lead.first, new RegExp(formatAsOf(communityRates.asOf).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(lead.first, /median 5-year fixed rate/);
    assert.match(lead.first, /insured status was not stated/);
    assert.match(lead.first, new RegExp(formatRate(cell!.median).replace(".", "\\.")));
    assert.match(lead.first, new RegExp(`N = ${cell!.n}`));
    assert.match(lead.first, /Big Five posted median/);
    assert.match(lead.first, new RegExp(formatRate(cell!.big5PostedMedian).replace(".", "\\.")));
    assert.match(lead.second, /rounded to the nearest 0\.05/);
    assert.match(lead.second, /self-reported by Canadian borrowers online/);
    assert.match(lead.second, /unverified/);
    assert.match(lead.second, /not a mortgage offer/);
    assert.equal(negotiateGuide.description, lead.text);
    assert.equal(negotiateGuide.updatedDate >= "2026-10-27", true);
  });

  it("does not name a forum or a surname", () => {
    const forbidden = /reddit|redflagdeals|red flag deals|\brfd\b|carrothers/i;
    for (const file of [
      "src/content/guides/negotiateMeta.ts",
      "src/content/guides/negotiateVideo.ts",
      "src/views/guides/NegotiateGuidePage.tsx",
      "src/pages/guides/negotiate-mortgage-rate/index.astro",
    ]) {
      assert.equal(forbidden.test(read(file)), false, file);
    }
  });
});

describe("negotiate guide discount table and renewal links", () => {
  const page = read("src/views/guides/NegotiateGuidePage.tsx");

  it("reuses the discount-by-bank rows and links the report", () => {
    assert.match(page, /Discount below each bank/);
    assert.match(page, /discountRows/);
    assert.match(page, /withSnapshotPostedRates/);
    assert.match(page, /\/reports\/discount-by-bank\//);
    assert.match(page, /\/real-mortgage-rates\//);
    assert.match(page, /N is at least \{DISCOUNT_MIN_N\}/);
  });

  it("links the renewal cluster", () => {
    for (const href of [
      "/guides/2026-mortgage-renewal-playbook/",
      "/guides/switching-mortgage-lenders-at-renewal/",
      "/guides/mortgage-prepayment-penalties/",
      "/guides/blend-and-extend-mortgage/",
      "/guides/mortgage-rate-hold-canada/",
      "/real-mortgage-rates/",
      "/blog/below-the-line-mortgage-rate-report-october-2026/",
    ]) {
      assert.match(page, new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), href);
    }
  });
});

describe("negotiate guide video slot", () => {
  const page = read("src/views/guides/NegotiateGuidePage.tsx");
  const astro = read("src/pages/guides/negotiate-mortgage-rate/index.astro");

  it("keeps the id empty until the October 29 upload, and accepts only an 11-character id", () => {
    assert.equal(NEGOTIATE_RATE_VIDEO_ID, "");
    assert.equal(negotiateRateVideoId(), null);
    assert.equal(negotiateRateVideoId("short"), null);
    assert.equal(negotiateRateVideoId("not a video"), null);
    assert.equal(negotiateRateVideoId("anZgA1p9wNA"), "anZgA1p9wNA");
    for (const video of NEGOTIATE_SERIES_EARLIER) {
      assert.equal(video.id === NEGOTIATE_RATE_VIDEO_ID, false);
      assert.equal(negotiateRateVideoId(video.id), video.id);
    }
  });

  it("wires YouTubeEmbed to the id constant and does not hard-code a negotiate video id", () => {
    assert.match(astro, /negotiateRateVideoId\(\)/);
    assert.match(astro, /<YouTubeEmbed/);
    assert.match(astro, /videoId=\{videoId\}/);
    assert.doesNotMatch(astro, /videoId="[A-Za-z0-9_-]{11}"/);
    assert.match(page, /data-negotiate-video/);
    assert.match(page, /NEGOTIATE_RATE_VIDEO\.scheduledLabel/);
    assert.equal(NEGOTIATE_RATE_VIDEO.scheduledLabel, "Thursday, October 29, 2026 at noon Eastern");
    assert.match(page, /videoId && children/);
  });
});
