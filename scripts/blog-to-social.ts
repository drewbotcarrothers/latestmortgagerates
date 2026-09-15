import { TwitterApi } from "twitter-api-v2";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { BlogPost } from "../src/content/blog.ts";

export const SITE_ORIGIN = "https://latestmortgagerates.ca";
export const TWITTER_CHAR_LIMIT = 260;
export const FACEBOOK_GRAPH_VERSION = "v21.0";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export interface PostedEntry {
  postedAt: string;
  twitterId?: string | null;
  facebookId?: string | null;
  source?: string;
}

export interface PostedState {
  version: 1;
  posted: Record<string, PostedEntry>;
}

export interface AmplifyOptions {
  slug?: string;
  forceRepost?: boolean;
  maxPosts?: number;
  dryRun?: boolean;
}

export interface SocialPayloads {
  url: string;
  twitter: string;
  facebookMessage: string;
  facebookLink: string;
}

function envFlag(name: string): boolean {
  const value = process.env[name];
  if (!value) return false;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function postedBlogsPath(): string {
  return process.env.SOCIAL_POSTED_BLOGS_PATH
    || path.join(REPO_ROOT, "data", "social-posted-blogs.json");
}

export function canonicalBlogUrl(slug: string): string {
  return `${SITE_ORIGIN}/blog/${slug}/`;
}

export function stripForSocial(text: string): string {
  return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(text: string, max: number): string {
  const cleaned = stripForSocial(text);
  if (cleaned.length <= max) return cleaned;
  if (max <= 1) return "…";
  const sliced = cleaned.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  const cut = lastSpace >= Math.floor(max * 0.6) ? sliced.slice(0, lastSpace) : sliced;
  return `${cut.trimEnd()}…`;
}

export function hashtagsFor(post: Pick<BlogPost, "category" | "title" | "tags">): string[] {
  const haystack = `${post.title} ${(post.tags || []).join(" ")}`;
  const tags = ["#MortgageRates"];

  if (post.category === "news" || /bank of canada|\bboc\b/i.test(haystack)) {
    tags.push("#BankOfCanada");
  } else if (post.category === "guides") {
    tags.push("#MortgageTips");
  } else if (post.category === "market") {
    tags.push("#HousingMarket");
  } else {
    tags.push("#Canada");
  }

  return tags.slice(0, 2);
}

export function composeTwitterCopy(post: Pick<BlogPost, "slug" | "title" | "excerpt" | "category" | "tags">): string {
  const url = canonicalBlogUrl(post.slug);
  const tagLine = hashtagsFor(post).join(" ");
  const suffix = `\n\n${url}\n\n${tagLine}`;
  const titleBudget = Math.max(24, TWITTER_CHAR_LIMIT - suffix.length);
  const title = truncate(post.title, titleBudget);

  let tweet = `${title}${suffix}`;
  const leftover = TWITTER_CHAR_LIMIT - tweet.length - 2;
  if (leftover >= 32) {
    const excerpt = truncate(post.excerpt, leftover);
    if (excerpt) tweet = `${title}\n\n${excerpt}${suffix}`;
  }

  if (tweet.length > TWITTER_CHAR_LIMIT) {
    const hardTitle = truncate(post.title, Math.max(12, TWITTER_CHAR_LIMIT - suffix.length));
    tweet = `${hardTitle}${suffix}`;
  }

  return tweet;
}

export function composeFacebookCopy(post: Pick<BlogPost, "slug" | "title" | "excerpt">): {
  message: string;
  link: string;
} {
  const link = canonicalBlogUrl(post.slug);
  const excerpt = stripForSocial(post.excerpt);
  const message = excerpt
    ? `${post.title}\n\n${excerpt}\n\n${link}`
    : `${post.title}\n\n${link}`;
  return { message, link };
}

export function composePayloads(post: BlogPost): SocialPayloads {
  const facebook = composeFacebookCopy(post);
  return {
    url: canonicalBlogUrl(post.slug),
    twitter: composeTwitterCopy(post),
    facebookMessage: facebook.message,
    facebookLink: facebook.link,
  };
}

export function emptyPostedState(): PostedState {
  return { version: 1, posted: {} };
}

export function loadPostedState(filePath = postedBlogsPath()): PostedState {
  if (!fs.existsSync(filePath)) {
    return emptyPostedState();
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8")) as PostedState;
    if (!parsed || parsed.version !== 1 || typeof parsed.posted !== "object" || parsed.posted === null) {
      console.warn(`⚠️ Unexpected posted-blogs file shape at ${filePath}; starting fresh`);
      return emptyPostedState();
    }
    return parsed;
  } catch (error) {
    console.warn(`⚠️ Could not parse ${filePath}; starting fresh`, error);
    return emptyPostedState();
  }
}

export function savePostedState(state: PostedState, filePath = postedBlogsPath()): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(state, null, 2)}\n`);
}

export function selectPostsToAmplify(
  posts: BlogPost[],
  postedSlugs: Set<string>,
  options: AmplifyOptions = {},
): BlogPost[] {
  const maxPosts = options.maxPosts ?? 1;

  if (options.slug) {
    const match = posts.find((post) => post.slug === options.slug);
    if (!match) {
      throw new Error(`Unknown blog slug: ${options.slug}`);
    }
    if (postedSlugs.has(match.slug) && !options.forceRepost) {
      return [];
    }
    return [match];
  }

  return [...posts]
    .filter((post) => !postedSlugs.has(post.slug))
    .sort((a, b) => {
      const byDate = b.date.localeCompare(a.date);
      if (byDate !== 0) return byDate;
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, maxPosts);
}

function writeGithubOutput(name: string, value: string): void {
  const outputFile = process.env.GITHUB_OUTPUT;
  if (!outputFile) return;
  fs.appendFileSync(outputFile, `${name}=${value}\n`);
}

function requireTwitterClient(): TwitterApi {
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    console.error("❌ Missing Twitter credentials (TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_SECRET)");
    process.exit(1);
  }

  return new TwitterApi({
    appKey: apiKey,
    appSecret: apiSecret,
    accessToken,
    accessSecret,
  });
}

async function postToX(text: string): Promise<string> {
  const client = requireTwitterClient();
  console.log("🚀 Posting to X...");
  const tweet = await client.v2.tweet(text);
  const id = tweet.data.id;
  console.log(`✅ X post succeeded (${id})`);
  console.log(`🔗 https://twitter.com/Mortgage_RateCA/status/${id}`);
  return id;
}

async function postToFacebook(message: string, link: string): Promise<string | null> {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  const version = process.env.FACEBOOK_GRAPH_API_VERSION?.trim() || FACEBOOK_GRAPH_VERSION;

  if (!pageId || !token) {
    console.warn("⚠️ Facebook secrets FACEBOOK_PAGE_ID / FACEBOOK_PAGE_ACCESS_TOKEN are not set; skipping Facebook post");
    return null;
  }

  const endpoint = `https://graph.facebook.com/${version}/${encodeURIComponent(pageId)}/feed`;
  const body = new URLSearchParams({
    message,
    link,
    access_token: token,
  });

  console.log("📘 Posting to Facebook Page...");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const payload = await response.json() as { id?: string; error?: { message?: string } };
    if (!response.ok || !payload.id) {
      const detail = payload.error?.message || JSON.stringify(payload);
      console.warn(`⚠️ Facebook post failed (${response.status}): ${detail}`);
      return null;
    }
    console.log(`✅ Facebook post succeeded (${payload.id})`);
    return payload.id;
  } catch (error) {
    console.warn("⚠️ Facebook post failed:", error);
    return null;
  }
}

async function loadBlogPosts(): Promise<BlogPost[]> {
  const mod = await import("../src/content/blog.ts");
  if (!Array.isArray(mod.blogPosts) || mod.blogPosts.length === 0) {
    throw new Error("src/content/blog.ts did not export any blogPosts");
  }
  return mod.blogPosts;
}

function markPosted(
  state: PostedState,
  slug: string,
  twitterId: string | null,
  facebookId: string | null,
): void {
  state.posted[slug] = {
    postedAt: new Date().toISOString(),
    twitterId,
    facebookId,
    source: "workflow",
  };
}

export async function amplifyBlogPosts(options: AmplifyOptions = {}): Promise<string[]> {
  const dryRun = options.dryRun ?? envFlag("DRY_RUN");
  const posts = await loadBlogPosts();
  const state = loadPostedState();
  const postedSlugs = new Set(Object.keys(state.posted));
  const selected = selectPostsToAmplify(posts, postedSlugs, options);

  if (selected.length === 0) {
    if (options.slug && postedSlugs.has(options.slug) && !options.forceRepost) {
      console.log(`⏭️  ${options.slug} already posted. Re-run with FORCE_REPOST=true to post again.`);
    } else {
      console.log("⏭️  No unpublished blog posts to amplify.");
    }
    writeGithubOutput("posted_slugs", "");
    return [];
  }

  const postedNow: string[] = [];

  for (const post of selected) {
    const payloads = composePayloads(post);
    console.log(`\n📰 ${post.title}`);
    console.log(`🔗 ${payloads.url}`);
    console.log(`\n📝 X (${payloads.twitter.length} chars):\n${payloads.twitter}`);
    console.log(`\n📝 Facebook:\n${payloads.facebookMessage}`);

    if (dryRun) {
      console.log("\n🧪 DRY_RUN=true — not posting and not updating the posted set.");
      postedNow.push(post.slug);
      continue;
    }

    let twitterId: string | null = null;
    try {
      twitterId = await postToX(payloads.twitter);
    } catch (error) {
      console.error("❌ Twitter API error:", error);
      writeGithubOutput("posted_slugs", postedNow.join(","));
      process.exit(1);
    }

    const facebookId = await postToFacebook(payloads.facebookMessage, payloads.facebookLink);
    markPosted(state, post.slug, twitterId, facebookId);
    savePostedState(state);
    postedNow.push(post.slug);
    console.log(`\n📌 Recorded ${post.slug} in ${postedBlogsPath()}`);
  }

  writeGithubOutput("posted_slugs", postedNow.join(","));
  return postedNow;
}

function parseCliOptions(): AmplifyOptions {
  return {
    slug: process.env.BLOG_SLUG?.trim() || undefined,
    forceRepost: envFlag("FORCE_REPOST"),
    maxPosts: envInt("MAX_POSTS", 1),
    dryRun: envFlag("DRY_RUN"),
  };
}

function isExecutedDirectly(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  const thisFile = fileURLToPath(import.meta.url);
  const base = path.basename(entry);
  return path.resolve(entry) === thisFile || /^blog-to-social\.(ts|js|mts|cts)$/.test(base);
}

if (isExecutedDirectly()) {
  amplifyBlogPosts(parseCliOptions()).catch((error) => {
    console.error("❌ Blog amplify failed:", error);
    process.exit(1);
  });
}
