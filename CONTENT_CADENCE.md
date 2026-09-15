# Content cadence

Blog posts live in `src/content/blog.ts` as `BlogPost` objects. Copy the HTML/Tailwind style, field names, and internal-link patterns from existing entries (`best-5-year-fixed-rates-week-38-2026` / `best-5-year-fixed-rates-week-12-2025`, `bank-of-canada-holds-rate-september-2026` / `bank-of-canada-holds-rate-march-2025`).

Do not invent percentages. Pull live rates from `https://latestmortgagerates.ca/api/rates.json` and/or repo `data/rates.json`. Pull Bank of Canada rationale only from the official press release.

## Mondays — weekly 5-year fixed roundup

- `category: "rates"`
- Slug: `best-5-year-fixed-rates-week-{ISO}-YYYY` (ISO week, e.g. week 38 of 2026)
- List the top 5-year fixed quotes and note the best variable if the scrape includes one
- Link `/rates/5-year-fixed/`, `/rates/variable/`, `/rates/insured/`, `/rates/uninsured/`, and `/tools/mortgage-calculator/`
- Date the post to the Monday (or the scrape day if you publish later the same week)

## Bank of Canada announcement mornings — decision post

- Same morning as the overnight-rate announcement
- `category: "news"`
- Slug: `bank-of-canada-{holds|cuts|hikes}-rate-{month}-YYYY`
- Cover variable vs fixed and renewals
- Link `/rates/variable/`, `/rates/5-year-fixed/`, `/tools/stress-test-qualifier/`, and `/mortgage-guide/`
- Include the next scheduled decision date from the Bank’s information note

## Featured

Set `featured: true` on the newest / most important post(s). Unfeature stale weekly and prior-decision posts so the blog index highlights current rates and the latest BoC call.
