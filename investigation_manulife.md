# Manulife Bank Mortgage Rate Page Investigation

**Investigated URLs:**
- https://www.manulifebank.ca/personal-banking/mortgages.html (overview page)
- https://www.manulifebank.ca/current-rates.html (detailed rates page)

**Investigation Date:** 2026-08-13

---

## Summary

Manulife Bank displays mortgage rates on two pages:
1. The mortgages overview page (`/personal-banking/mortgages.html`) embeds a limited rate display in dropdown selectors.
2. The dedicated rates page (`/current-rates.html`) contains a full tabular display of all mortgage rates.

Both pages appear to render rates in **static HTML** with no obvious dynamic JavaScript loading or hidden API endpoints. The snapshot shows all rate data present in the initial server-rendered HTML.

---

## HTML Elements Containing Rate Data

### 1. Mortgages Overview Page (`/personal-banking/mortgages.html`)

Rates are embedded in two `<combobox>` (select) elements:

- **Manulife One dropdown:**
  ```
  combobox "selectMortgage1_button"
    - 5 Year Open (Manulife One Base Rate plus 0%) → 4.95%
  ```

- **Manulife Bank Select dropdown:**
  ```
  combobox "selectMortgage2_button"
    - 1 Year Closed → 6.89%
    (and presumably other terms via the dropdown)
  ```

These dropdowns are inside generic div containers near product description text.

### 2. Current Rates Page (`/current-rates.html`) — PRIMARY TARGET

This is the authoritative source. Rates are displayed in **semantic HTML `<table>` elements**.

#### Section: Special Rates (Carousel)
- Container: generic divs with heading levels 3/4
- **5-year closed fixed-rate (Manulife One):** As low as 4.69%* (APR) — New clients only
- **5-year closed fixed-rate (Manulife Bank Select):** As low as 4.69%** (APR) — New clients only
- **5-year closed fixed-rate (Manulife Bank Select High Ratio):** As low as 4.39%† (APR)

#### Table 1: Manulife One Rates
- Table: `<table>` with `rowgroup` containing `row` and `cell` elements
- Rows:
  - Manulife One Base Rate: **4.95%**
  - Variable-rate sub-account terms
  - 5-year open (Base Rate plus 0%): **4.95%**
  - Fixed-rate sub-account terms
  - 1-year closed: **6.89%**
  - 2-year closed: **6.34%**
  - 3-year closed: **4.99%**
  - 4-year closed: **5.29%**
  - 5-year closed: **4.94%**
  - 7-year closed: **6.35%**
  - 10-year closed: **6.69%**
  - Interest rate for positive account balances: **1.00%**

#### Table 2: Manulife Bank Select Rates
- Same `<table>` structure
- Rows:
  - Manulife Bank Prime Rate: **4.45%**
  - Variable-rate terms
  - 5-year closed (Prime + 0.00%): **4.45%**
  - 5-year open (Prime + 1.00%): **5.45%**
  - Fixed-rate terms
  - 1-year closed: **6.89%**
  - 2-year closed: **6.34%**
  - 3-year closed: **4.99%**
  - 4-year closed: **5.29%**
  - 5-year closed: **4.94%**
  - 7-year closed: **6.35%**
  - 10-year closed: **6.69%**
  - Manulife Bank Select bank account interest rate: **1.00%**

---

## Are Rates Loaded Dynamically via JavaScript?

**No evidence found.** The browser snapshot (aria tree) shows all rate content present immediately after page load without any dynamic injection. The rates appear to be server-rendered in the initial HTML response.

No `<script>` tags containing JSON rate data were observed in the rendered page structure. The content is plain HTML tables and headings.

---

## API Endpoints or Embedded JSON

**None detected.**

No hidden XHR/fetch API calls were observed. No JSON-LD or `<script type="application/json">` blocks containing rate data were visible in the rendered page structure.

The rates appear to be hard-coded/static HTML served directly by the CMS.

---

## Suggested Playwright Selectors / Regex Patterns

### Recommended Approach: Scrape the Current Rates Page

**URL:** `https://www.manulifebank.ca/current-rates.html`

#### Option A: Table Cell Extraction (Most Reliable)

Locate tables by preceding headings, then extract row cells:

```python
# Playwright/Python selector approach
page.goto("https://www.manulifebank.ca/current-rates.html")

# Find the Manulife One table
manulife_one_heading = page.locator("h4:has-text('Manulife One')")
manulife_one_table = manulife_one_heading.locator("xpath=../following-sibling::table[1]")
rows = manulife_one_table.locator("tr").all()
for row in rows:
    cells = row.locator("td").all_inner_texts()
    if len(cells) == 2:
        term, rate = cells[0], cells[1]
        print(f"{term}: {rate}")

# Find the Manulife Bank Select table
select_heading = page.locator("h4:has-text('Manulife Bank Select')")
select_table = select_heading.locator("xpath=../following-sibling::table[1]")
rows = select_table.locator("tr").all()
for row in rows:
    cells = row.locator("td").all_inner_texts()
    if len(cells) == 2:
        term, rate = cells[0], cells[1]
        print(f"{term}: {rate}")
```

#### Option B: Regex Pattern on Page HTML

If scraping raw HTML:

```python
import re

# Pattern for table rows with term and rate
pattern = r'<td[^>]*>(.*?)</td>\s*<td[^>]*>\s*<strong[^>]*>([\d.]+)%</strong>\s*</td>'

# Or broader pattern for any "X-year closed Y.YY%"
broad_pattern = r'(\d+)-year\s+(?:open|closed)\s+.*?([\d.]+)%'

# Special rates section
special_pattern = r'As low as ([\d.]+)%'
```

#### Option C: Aria Tree / Snapshot Approach

Using OpenClaw browser snapshot, the aria-ref IDs for the tables are:
- Manulife One table: `ref=e162`
- Manulife Bank Select table: `ref=e243`

These refs can be used directly in snapshot-based extraction if using the OpenClaw browser tool.

---

## Key Observations & Recommendations

1. **Best page to scrape:** `https://www.manulifebank.ca/current-rates.html` — contains all mortgage rates in clean table format.
2. **Data format:** Static HTML `<table>` elements with `<tr>` rows and `<td>` cells. No JavaScript rendering required.
3. **Rate freshness:** Rates include footnotes with effective dates (e.g., "current as of April 9, 2026"). These dates suggest the page is updated manually or via CMS, not real-time API.
4. **Special rates:** Check the "Special rates" carousel section for promotional/discounted rates (4.69%, 4.39%) that may differ from posted rates.
5. **No anti-bot:** The page loaded successfully via browser automation with no CAPTCHA or heavy anti-bot measures detected.
6. **HTML saved:** Raw HTML was not successfully saved to disk due to server-level blocking on non-browser requests (HTTP 403/Access Denied from edgesuite/akamai), but browser-based fetching works fine.

---

## Rate Data Captured (2026-08-13)

### Manulife One
| Term | Rate |
|------|------|
| Base Rate | 4.95% |
| 5-year open | 4.95% |
| 1-year closed | 6.89% |
| 2-year closed | 6.34% |
| 3-year closed | 4.99% |
| 4-year closed | 5.29% |
| 5-year closed | 4.94% |
| 7-year closed | 6.35% |
| 10-year closed | 6.69% |
| Positive balance | 1.00% |

### Manulife Bank Select
| Term | Rate |
|------|------|
| Prime Rate | 4.45% |
| 5-year closed (Prime+0%) | 4.45% |
| 5-year open (Prime+1%) | 5.45% |
| 1-year closed | 6.89% |
| 2-year closed | 6.34% |
| 3-year closed | 4.99% |
| 4-year closed | 5.29% |
| 5-year closed | 4.94% |
| 7-year closed | 6.35% |
| 10-year closed | 6.69% |
| Account interest | 1.00% |

### Special Rates (New Clients)
| Product | Rate |
|---------|------|
| Manulife One 5-year closed fixed | 4.69%* |
| Manulife Bank Select 5-year closed fixed | 4.69%** |
| Manulife Bank Select High Ratio 5-year closed fixed | 4.39%† |
