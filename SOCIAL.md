# Social posting

Latest Mortgage Rates posts rate updates and new blog articles to **X (Twitter)** and, when configured, the **Facebook Page**. Posting is done with the same direct API pattern as `scripts/smart-tweet.ts` (`twitter-api-v2` plus `fetch` to Facebook Graph). Postiz is not used.

## Blog amplify

When a new `BlogPost` is added to `src/content/blog.ts` and that change lands on `master`, `.github/workflows/post-to-social.yml` runs `scripts/blog-to-social.ts`.

That script:

1. Loads `blogPosts` from `src/content/blog.ts`
2. Skips slugs already listed in `data/social-posted-blogs.json`
3. Picks the newest unposted post (default **N=1**, override with `MAX_POSTS`)
4. Posts once to X and once to the Facebook Page (title + excerpt + canonical URL `https://latestmortgagerates.ca/blog/{slug}/`)
5. Records the slug in `data/social-posted-blogs.json` and the workflow commits that file (`chore(social): mark blog {slug} as posted`) so we never double-post

Existing posts in that JSON file were seeded as already posted so turning this on does not blast historical articles. To amplify one of those, use a manual dispatch with **Force repost**.

If Facebook secrets are missing at runtime, X still posts and Facebook is skipped with a warning. The job does **not** fail. Missing Twitter secrets (when an X post is attempted) or a Twitter API error **does** fail the job.

### Local / CI dry run

Prints payloads without posting and without writing the posted set:

```bash
DRY_RUN=true BLOG_SLUG=first-time-buyer-guide-2026 FORCE_REPOST=true npx tsx scripts/blog-to-social.ts
```

Omit `BLOG_SLUG` to preview the newest unposted post (usually none, because historical slugs are seeded).

## Scheduled rate tweets

Unrelated to blog amplify. The same workflow still runs `scripts/smart-tweet.ts` daily and `scripts/monthly-poll.ts` on the 1st. See `.github/workflows/README.md`.

## Required GitHub Actions secrets

**Settings → Secrets and variables → Actions** on `drewbotcarrothers/latestmortgagerates`.

### X / Twitter (already configured)

| Secret | Purpose |
|--------|---------|
| `TWITTER_API_KEY` | OAuth 1.0a API key |
| `TWITTER_API_SECRET` | OAuth 1.0a API secret |
| `TWITTER_ACCESS_TOKEN` | User access token |
| `TWITTER_ACCESS_SECRET` | User access token secret |

### Facebook Page (Andrew must add these)

| Secret | Purpose |
|--------|---------|
| `FACEBOOK_PAGE_ID` | Numeric Facebook Page ID |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Long-lived **Page** access token |

Until those two exist, blog amplify still tweets and logs that Facebook was skipped.

## Manual dispatch for a slug

1. GitHub → **Actions** → **Post to Social Media** → **Run workflow**
2. Type of post: `blog_amplify`
3. Optional **blog slug** (e.g. `best-5-year-fixed-rates-week-38-2026`). Leave empty to amplify the newest unpublished post.
4. Check **Force repost** only if the slug is already in `data/social-posted-blogs.json` and you want to post it again.

Equivalent locally (needs the same env vars as the workflow):

```bash
BLOG_SLUG=best-5-year-fixed-rates-week-38-2026 FORCE_REPOST=true npx tsx scripts/blog-to-social.ts
```

## How to get a Facebook Page token

High-level (Meta’s UI names shift; the permissions do not):

1. Create or open a Meta developer app at [developers.facebook.com](https://developers.facebook.com/)
2. Add the **Facebook Login** product if you need to generate a user token first
3. In Graph API Explorer (or your app’s token tool), generate a token for a user who is an admin of the Latest Mortgage Rates Page
4. Request Page permissions: `pages_manage_posts` and `pages_read_engagement` (and `pages_show_list` if you need to list Pages)
5. Exchange the short-lived **user** token for a long-lived user token, then request a **Page** access token for the Page (`GET /me/accounts` or the Page token field)
6. Confirm the token is a Page token (not a user token) and that it never expires, or set a reminder to refresh it
7. Put the Page id in `FACEBOOK_PAGE_ID` and the Page token in `FACEBOOK_PAGE_ACCESS_TOKEN`

Do not commit tokens. The script posts with `POST /{page-id}/feed` (`message` + `link`).
