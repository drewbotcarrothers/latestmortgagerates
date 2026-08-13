# EQ Bank Mortgage Rate Page Structure Investigation

**Investigated URLs:**
- `https://www.eqbank.ca` (homepage)
- `https://www.eqbank.ca/personal-banking/mortgage-marketplace` (marketplace landing page)
- `https://www.eqbank.ca/rates` (general rates page)
- `https://www.eqbank.ca/residential/mortgage-rates` (**actual mortgage rates page**)

**Date:** 2026-08-13

---

## 1. Architecture Overview

EQ Bank's public website is built on **Next.js** (React framework). The HTML is server-rendered but heavily relies on React Server Components (RSC) and client-side hydration. The raw HTML file contains a large `<script>` block that pushes data into `self.__next_f`, which is then parsed by Next.js to render the page content dynamically in the browser.

---

## 2. Where Are Mortgage Rates Displayed?

Mortgage rates are **not** displayed on `https://www.eqbank.ca/rates` (this page only shows savings/GIC placeholders). The primary page for mortgage rates is:

```
https://www.eqbank.ca/residential/mortgage-rates
```

On this page, rates appear inside standard HTML `<table>` elements. However, the raw HTML does **not** contain the numeric values directly. Instead, the table cells contain custom `<rate>` placeholder tags. For example:

```html
<td class="oWWJNKFk">
  <rate>Standard-Mortgage-Rate-5-Year-Fixed</rate>
</td>
```

These placeholders are resolved at runtime by JavaScript using a JSON data object embedded elsewhere in the page.

---

## 3. How Rates Are Loaded

### Embedded JSON Data Object

The actual numeric rate values (and all other rate data) are stored in a **massive JSON object** embedded inside a single `<script>` tag in the HTML. This JSON is part of the Next.js hydration payload (`self.__next_f.push([1, "..."])`).

**Location:** The JSON is located in the first (or one of the first) large `<script>` tags in the raw HTML of `/residential/mortgage-rates`, specifically within a `self.__next_f.push([1, ...])` call.

### Structure of the JSON Object

The JSON contains a top-level property (e.g., `rates` or similar) that maps rate identifiers to objects with `name` and `rate` properties. For example:

```json
{
  "Standard-Mortgage-Rate-5-Year-Fixed": {
    "name": "Standard-Mortgage-Rate-5-Year-Fixed",
    "rate": 5.24
  },
  "APR-5-Year-Fixed": {
    "name": "APR-5-Year-Fixed",
    "rate": 5.688
  },
  "EQB-Evolution-Suite-5-Year-Adjustable": {
    "name": "EQB-Evolution-Suite-5-Year-Adjustable",
    "rate": 0.85
  }
}
```

### Rate Identifiers Found

The following mortgage-related rate identifiers were discovered in the JSON:

- `Standard-Mortgage-Rate-1-Year-Fixed`
- `Standard-Mortgage-Rate-2-Year-Fixed`
- `Standard-Mortgage-Rate-3-Year-Fixed`
- `Standard-Mortgage-Rate-4-Year-Fixed`
- `Standard-Mortgage-Rate-5-Year-Fixed`
- `Standard-Mortgage-Rate-5-Year-Adjustable`
- `APR-1-Year-Fixed`
- `APR-2-Year-Fixed`
- `APR-3-Year-Fixed`
- `APR-4-Year-Fixed`
- `APR-5-Year-Fixed`
- `APR-5-Year-Adjustable`
- `EQB-Evolution-Suite-6-Month-Fixed`
- `EQB-Evolution-Suite-5-Year-Adjustable`
- `Reverse-Mortgage-Flex-Rates-Origination-6-Month-Fixed`
- `Reverse-Mortgage-Flex-Rates-Origination-1-Year-Fixed`
- `Reverse-Mortgage-Flex-Rates-Origination-2-Year-Fixed`
- `Reverse-Mortgage-Flex-Rates-Origination-3-Year-Fixed`
- `equitable-prime-rate`
- `es-fixed-12-month`, `es-fixed-24-month`, `es-fixed-36-month`, `es-fixed-48-month`, `es-fixed-60-month`
- `Annual-Percentage-Rate-(APR)-X-Year-Fixed` (various years)

---

## 4. Dynamic Loading

- **No separate API call** is required to fetch the initial mortgage rates; they are embedded in the HTML payload.
- The page uses Next.js hydration to populate the `<rate>` tags from the embedded JSON.
- Because the raw HTML file already contains the JSON, the data is available immediately without waiting for external XHR/fetch requests.

---

## 5. Extraction Strategies

### Strategy A: Regex / String Parsing on Raw HTML (Recommended for Speed)

Since the JSON is embedded directly in the HTML, you can download the raw HTML and use a regex or JSON parser to extract the rate values without needing a headless browser.

**Steps:**
1. Download `https://www.eqbank.ca/residential/mortgage-rates` HTML.
2. Search for the large `self.__next_f.push([1, ...])` script block.
3. Extract the JSON string from within that block. The JSON object appears after the initial React tree and contains all the rate data.
4. Parse the JSON and navigate to the rates dictionary.

**Suggested Regex Pattern (PowerShell/Python):**

```powershell
# Find the line containing the rates JSON
Select-String -Path "eqbank_mortgage_rates.html" -Pattern '"Standard-Mortgage-Rate-5-Year-Fixed"\s*:\s*\{[^}]+"rate"\s*:\s*([0-9.]+)'
```

Or, more generally, to capture all rate identifiers and values:
```regex
"([\w\-\(\)]+)":\s*\{\s*"name":\s*"[^"]+",\s*"rate":\s*([0-9.]+)\s*\}
```

### Strategy B: Playwright / Puppeteer (DOM Extraction)

If you want to extract the rates as they appear in the rendered table (after hydration):

**Suggested Playwright Selectors:**

1. Wait for the table to render:
   ```javascript
   await page.waitForSelector('table.kYHYNgYX');
   ```

2. Extract all table rows:
   ```javascript
   const rows = await page.$$('table.kYHYNgYX tbody tr');
   for (const row of rows) {
     const cells = await row.$$('td');
     // cells[0] is label, cells[1..n] are rates
   }
   ```

3. Alternative: Extract text directly from the `<rate>` tags before hydration resolves (not recommended, as they contain IDs, not values).

**Better Playwright Approach:**
Use Playwright to execute JavaScript in the browser context to access the Next.js internal data or simply wait for the table text to populate, then scrape the text:

```javascript
const rateText = await page.locator('table.kYHYNgYX tbody tr:first-child td:nth-child(7)').textContent();
// rateText should be something like "5.24%"
```

### Strategy C: JSON Path Extraction

If you successfully parse the embedded JSON object, the rates are typically under a key like:

```
$['rates']['Standard-Mortgage-Rate-5-Year-Fixed']['rate']
```

---

## 6. Summary of Findings

| Question | Answer |
|----------|--------|
| **What elements contain rate data?** | Raw HTML uses `<rate>` placeholder tags inside `<td>` cells. Actual values are in an embedded JSON object within a `<script>` tag. |
| **Are rates loaded dynamically?** | Yes, but not via a separate API. They are hydrated client-side from a JSON payload already present in the initial HTML. |
| **Are there API endpoints?** | No external API call was observed for the initial rate load. All data is in the first HTML response. |
| **Best extraction method?** | **Regex/JSON parsing on raw HTML** is fastest and most reliable. Playwright is viable but slower if you wait for DOM hydration. |

---

## 7. Files Saved During Investigation

- `C:\Users\acarr\latestmortgagerates\eqbank_rates.html` (~408 KB) - Raw HTML from `/rates`
- `C:\Users\acarr\latestmortgagerates\eqbank_mortgage_rates.html` (~367 KB) - Raw HTML from `/residential/mortgage-rates`
- `C:\Users\acarr\latestmortgagerates\eqbank_mortgage_marketplace.html` (~267 KB) - Raw HTML from `/personal-banking/mortgage-marketplace`
