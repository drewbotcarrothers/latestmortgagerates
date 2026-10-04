import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../..", import.meta.url));

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("Hostinger Reach newsletter signup", () => {
  it("lazy-loads one embed script and does not add an h1", () => {
    const source = read("src/components/NewsletterSignup.tsx");
    assert.match(source, /0aff7137-20b2-444f-a443-b8bd0887758a/);
    assert.match(source, /https:\/\/cdn-reach\.hostinger\.com\/js\/embed\.js/);
    assert.match(source, /script\.async = true/);
    assert.match(source, /script\.defer = true/);
    assert.match(source, /IntersectionObserver/);
    assert.match(source, /Get the monthly mortgage rate report/);
    assert.match(source, /what Canadians actually got below posted/);
    assert.match(source, /mailto:privacy@latestmortgagerates\.ca/);
    assert.equal((source.match(/<h1[\s>]/g) || []).length, 0);
    assert.doesNotMatch(source, /localStorage/);
    assert.doesNotMatch(source, /0\.05%/);
  });

  it("replaces the homepage and blog forms and appears on key pages", () => {
    assert.equal(existsSync(join(root, "src/components/RateAlertForm.tsx")), false);
    const home = read("src/views/HomePage.tsx");
    const blog = read("src/views/blog/BlogIndex.tsx");
    const post = read("src/views/blog/BlogPost.tsx");
    const real = read("src/views/community/RealRatesPage.tsx");
    const lender = read("src/views/lenders/LenderPage.tsx");
    for (const source of [home, blog, post, real, lender]) {
      assert.match(source, /<NewsletterSignup\b/);
    }
    assert.match(home, /anchorId="rate-alert"/);
    assert.doesNotMatch(home, /RateAlertForm|rateAlertSubscribers/);
    assert.doesNotMatch(blog, /Never Miss an Update|weekly mortgage rate roundup/);
    const banner = read("src/components/RateDropBanner.tsx");
    assert.match(banner, /monthly mortgage rate report/i);
    assert.doesNotMatch(banner, /signing up for our Rate Alert|Get Alerts/);
  });

  it("retires the open PHP handlers and blocks the subscriber file", () => {
    assert.equal(existsSync(join(root, "public/subscribe.php")), false);
    assert.equal(existsSync(join(root, "public/unsubscribe.php")), false);
    const htaccess = read("public/.htaccess");
    assert.match(htaccess, /data\/subscribers\\\.json/);
    assert.match(htaccess, /Require all denied/);
    assert.match(htaccess, /cdn-reach\.hostinger\.com/);
    assert.match(htaccess, /reach-forms\.hostingerusercontent\.com/);
    assert.match(htaccess, /reach\.hostinger\.com/);
  });

  it("describes Hostinger Reach on the privacy page and monthly copy on subscribe pages", () => {
    const privacy = read("src/views/privacy/PrivacyPage.tsx");
    assert.match(privacy, /Hostinger Reach/);
    assert.match(privacy, /email provider/);
    assert.match(privacy, /double opt-in/i);
    assert.match(privacy, /unsubscribe anytime/i);
    const unsubscribed = read("src/views/unsubscribed/UnsubscribedPage.tsx");
    assert.match(unsubscribed, /unsubscribe link in any newsletter email/i);
    assert.doesNotMatch(unsubscribed, /Successfully Unsubscribed/);
  });
});
