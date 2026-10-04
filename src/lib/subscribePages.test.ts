import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("subscribe confirmation pages", () => {
  it("sets noindex, follow and keeps AdSense off", () => {
    for (const page of [
      "src/pages/subscribe/confirmed/index.astro",
      "src/pages/subscribe/thank-you/index.astro",
    ]) {
      const source = read(page);
      assert.match(source, /noIndex=\{true\}/);
      assert.match(source, /robots="noindex, follow"/);
      assert.doesNotMatch(source, /AdUnit|adsbygoogle/);
    }
    const layout = read("src/layouts/BaseLayout.astro");
    assert.match(layout, /robotsContent/);
    assert.match(layout, /!noIndex/);
  });

  it("uses one h1, the shared header, and a max-w-7xl container", () => {
    const confirmed = read("src/views/subscribe/ConfirmedPage.tsx");
    const pending = read("src/views/subscribe/ThankYouPage.tsx");
    const frame = read("src/components/SubscribeStatus.tsx");
    assert.equal((confirmed.match(/<h1[\s>]/g) || []).length, 1);
    assert.equal((pending.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(confirmed, /You&apos;re subscribed!/);
    assert.match(pending, /Check your inbox to confirm/);
    assert.match(frame, /<Header\b/);
    assert.match(frame, /max-w-7xl/);
    assert.equal((frame.match(/<h1[\s>]/g) || []).length, 0);
  });

  it("links the double opt-in step to the confirmed page and the requested destinations", () => {
    const confirmed = read("src/views/subscribe/ConfirmedPage.tsx");
    const pending = read("src/views/subscribe/ThankYouPage.tsx");
    const shared = read("src/components/SubscribeStatus.tsx");
    assert.match(pending, /href="\/subscribe\/confirmed\/"/);
    assert.match(confirmed, /href="\/subscribe\/thank-you\/"/);
    for (const href of ["/", "/real-mortgage-rates/", "/mortgage-guide/", "/privacy/"]) {
      assert.ok(shared.includes(`"${href}"`) || confirmed.includes(`"${href}"`), href);
    }
    assert.match(shared, /Lowest posted rates/);
    assert.match(shared, /below posted/);
    assert.match(shared, /Bank of Canada recaps/);
    assert.match(shared, /Promotions/);
    assert.match(confirmed, /Monthly/);
    assert.doesNotMatch(confirmed, /Weekly|weekly/);
    assert.doesNotMatch(pending, /weekly/i);
    assert.doesNotMatch(shared, /Weekly|Rate-drop alerts/);
    assert.match(shared, /unsubscribe anytime/i);
  });

  it("excludes both URLs from the sitemap", () => {
    const config = read("astro.config.mjs");
    const verify = read("scripts/verify-static-api.mjs");
    assert.match(config, /\/subscribe\/confirmed/);
    assert.match(config, /\/subscribe\/thank-you/);
    assert.match(verify, /\/subscribe\/confirmed\//);
    assert.match(verify, /\/subscribe\/thank-you\//);
  });
});
