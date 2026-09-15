import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { describe, it } from "node:test";
import type { BlogPost } from "../src/content/blog.ts";
import {
  canonicalBlogUrl,
  composeFacebookCopy,
  composeTwitterCopy,
  hashtagsFor,
  loadPostedState,
  savePostedState,
  selectPostsToAmplify,
  SITE_ORIGIN,
  TWITTER_CHAR_LIMIT,
  truncate,
} from "./blog-to-social.ts";

function fakePost(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    slug: "sample-post",
    title: "Best 5-Year Fixed Mortgage Rates This Week",
    excerpt: "This week's top 5-year fixed rates from Canadian lenders. See who is offering the lowest quotes.",
    content: "<p>Body</p>",
    author: "Andrew",
    authorTitle: "Rate Analyst",
    date: "2026-09-15",
    category: "rates",
    tags: ["best rates", "weekly update"],
    readTime: 4,
    featured: true,
    image: "/blog/sample.jpg",
    ...overrides,
  };
}

describe("canonicalBlogUrl", () => {
  it("uses the live origin, slug, and trailing slash", () => {
    assert.equal(
      canonicalBlogUrl("best-5-year-fixed-rates-week-38-2026"),
      `${SITE_ORIGIN}/blog/best-5-year-fixed-rates-week-38-2026/`,
    );
  });
});

describe("hashtagsFor", () => {
  it("adds Canada for rate roundups", () => {
    assert.deepEqual(hashtagsFor(fakePost()), ["#MortgageRates", "#Canada"]);
  });

  it("uses Bank of Canada tags for news posts", () => {
    assert.deepEqual(
      hashtagsFor(fakePost({ category: "news", title: "Bank of Canada Holds Rate at 2.25%" })),
      ["#MortgageRates", "#BankOfCanada"],
    );
  });

  it("uses guide and market tags", () => {
    assert.deepEqual(hashtagsFor(fakePost({ category: "guides" })), ["#MortgageRates", "#MortgageTips"]);
    assert.deepEqual(hashtagsFor(fakePost({ category: "market" })), ["#MortgageRates", "#HousingMarket"]);
  });
});

describe("composeTwitterCopy", () => {
  it("stays within the 260-character budget and includes url plus hashtags", () => {
    const post = fakePost();
    const tweet = composeTwitterCopy(post);
    assert.ok(tweet.length <= TWITTER_CHAR_LIMIT, `got ${tweet.length}: ${tweet}`);
    assert.match(tweet, /https:\/\/latestmortgagerates\.ca\/blog\/sample-post\//);
    assert.match(tweet, /#MortgageRates/);
    assert.match(tweet, /#Canada/);
    assert.match(tweet, /Best 5-Year Fixed/);
  });

  it("truncates very long titles instead of overflowing", () => {
    const tweet = composeTwitterCopy(fakePost({
      title: "A".repeat(400),
      excerpt: "B".repeat(400),
    }));
    assert.ok(tweet.length <= TWITTER_CHAR_LIMIT, `got ${tweet.length}`);
    assert.match(tweet, /https:\/\/latestmortgagerates\.ca\/blog\/sample-post\//);
  });
});

describe("composeFacebookCopy", () => {
  it("includes title, excerpt, and canonical link", () => {
    const post = fakePost();
    const { message, link } = composeFacebookCopy(post);
    assert.equal(link, canonicalBlogUrl(post.slug));
    assert.match(message, /Best 5-Year Fixed Mortgage Rates This Week/);
    assert.match(message, /This week's top 5-year fixed rates/);
    assert.match(message, /https:\/\/latestmortgagerates\.ca\/blog\/sample-post\//);
  });
});

describe("truncate", () => {
  it("prefers a word boundary when there is room", () => {
    assert.equal(truncate("Canadian mortgage rates explained today", 20), "Canadian mortgage…");
  });
});

describe("selectPostsToAmplify", () => {
  const older = fakePost({ slug: "older-post", date: "2026-01-01", title: "Older" });
  const newer = fakePost({ slug: "newer-post", date: "2026-09-15", title: "Newer" });

  it("picks the newest unposted post and respects the cap", () => {
    const selected = selectPostsToAmplify([older, newer], new Set(), { maxPosts: 1 });
    assert.deepEqual(selected.map((p) => p.slug), ["newer-post"]);
  });

  it("skips slugs already in the posted set", () => {
    const selected = selectPostsToAmplify([older, newer], new Set(["newer-post"]), { maxPosts: 1 });
    assert.deepEqual(selected.map((p) => p.slug), ["older-post"]);
  });

  it("forces a specific slug only when requested", () => {
    assert.deepEqual(
      selectPostsToAmplify([older, newer], new Set(["older-post"]), { slug: "older-post" }).map((p) => p.slug),
      [],
    );
    assert.deepEqual(
      selectPostsToAmplify([older, newer], new Set(["older-post"]), {
        slug: "older-post",
        forceRepost: true,
      }).map((p) => p.slug),
      ["older-post"],
    );
  });

  it("throws on an unknown slug", () => {
    assert.throws(
      () => selectPostsToAmplify([newer], new Set(), { slug: "missing-post" }),
      /Unknown blog slug: missing-post/,
    );
  });
});

describe("posted state file", () => {
  it("round-trips JSON and creates the file if missing", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "social-posted-"));
    const filePath = path.join(dir, "social-posted-blogs.json");
    assert.deepEqual(loadPostedState(filePath), { version: 1, posted: {} });
    savePostedState({
      version: 1,
      posted: {
        "sample-post": { postedAt: "2026-09-15T00:00:00.000Z", source: "test" },
      },
    }, filePath);
    const loaded = loadPostedState(filePath);
    assert.equal(loaded.posted["sample-post"]?.source, "test");
  });
});
