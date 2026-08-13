# MCAP Mortgage Rate Page Structure Investigation

**Date:** 2026-08-13
**Investigated URLs:**
- https://www.mcap.com (homepage)
- https://www.mcap.com/residential-mortgages
- https://www.mcap.com/residential-mortgages/advice/mortgage-rates-canada
- https://www.mcap.com/residential-mortgages/products/our-mortgages
- https://www.mcap.com/residential-mortgages/advice/mortgage-rates-canada/prime-rate-history
- https://www.mcap.com/residential-mortgages/customers/products/1-10-year-closed
- https://www.mcap.com/residential-mortgages/products/our-mortgages/fixed-rate-mortgage
- https://www.mcap.com/residential-mortgages/products/our-mortgages/adjustable-rate-mortgage

---

## 1. Summary: Does MCAP Publish Mortgage Rates Publicly?

**NO.** Unlike many other Canadian lenders, MCAP does **not** publish specific mortgage rates (e.g., "5-Year Fixed: X%", "3-Year Fixed: Y%") on any public-facing page. The only numeric rate displayed publicly is the **MCAP Prime Rate**.

MCAP's messaging consistently directs users to **"Talk to a broker for our current rates"** or to use their **broker portal (Professor)** for rate access.

---

## 2. What Rate Data IS Available Publicly

### 2.1 MCAP Prime Rate
- **Current value:** `4.45%`
- **Effective date:** October 30, 2025
- **Location:** Displayed on both the residential mortgages homepage and the mortgage rates advice page.
- **HTML structure:**
  ```html
  <div class="container-fluid big-blue-bar simple d-flex justify-content-center flex-column inverse-bg-sm mb-5 prime-rate-module" id="ctap_5">
      <div class="container text-left px-0 px-sm-3">
          <div class="row">
              <div class="col-lg-6 col-md-5 top-text-container">
                  <h3 class="text-white mb-1 font-36 font-weight-700">Current prime rate</h3>
                  <p class="text-white mb-0 font-weight-300">...</p>
              </div>
              <div class="...">
                  <p class="text-white mb-0 font-weight-300 align-self-start mb-3">MCAP Prime Rate</p>
                  <p class="h2 round-number-box text-white bg-primary-blue font-weight-700 text-center">
                      4.45%
                  </p>
              </div>
              <div class="...">
                  <p class="text-white big mt-4 font-weight-700 pl-3 pt-3">
                      Effective October 30, 2025
                  </p>
              </div>
          </div>
      </div>
  </div>
  ```

### 2.2 Prime Rate History Table
- **URL:** `https://www.mcap.com/residential-mortgages/advice/mortgage-rates-canada/prime-rate-history`
- **Format:** Static HTML `<table>`
- **Table class:** `mcap-table text-center first-col-bold`
- **Columns:** `Date of Change` | `MCAP Prime Rate`
- **Sample rows:**
  | Date of Change | MCAP Prime Rate |
  |----------------|-----------------|
  | October 30, 2025 | 4.45 |
  | September 18, 2025 | 4.70 |
  | March 13, 2025 | 4.95 |
  | ... | ... |

### 2.3 Mortgage Payment Calculator (Default Rate)
- **URL:** `https://www.mcap.com/residential-mortgages` (embedded calculator)
- **Default interest rate input:** `4.00%`
- **HTML:**
  ```html
  <input type="text" class="big" id="rate_dup" value="4.00" />
  ```
- **Note:** This is a user-editable default for calculation purposes, NOT a published rate.

---

## 3. What Rate Data is NOT Available

| Expected Data | Found? | Notes |
|-------------|--------|-------|
| Fixed rate table (1yr, 2yr, 3yr, 5yr, etc.) | ❌ NO | Not published publicly |
| Adjustable/Variable rate | ❌ NO | Only described conceptually |
| Posted vs. special rates | ❌ NO | Not published |
| High-ratio vs. conventional rates | ❌ NO | Not published |
| Rate comparison tool | ❌ NO | Only a generic payment calculator |

---

## 4. HTML Elements & Page Structure

### 4.1 Key Pages
1. **Main Rates Info Page:** `/residential-mortgages/advice/mortgage-rates-canada`
   - Contains general advice about fixed vs. adjustable mortgages
   - Prime rate module
   - CTA to "Talk to a broker for our current rates"

2. **Products Overview:** `/residential-mortgages/products/our-mortgages`
   - Describes product types (Fixed Rate, Adjustable Rate, Fusion, Safeguard)
   - No rate numbers

3. **Individual Product Pages:**
   - `/residential-mortgages/products/our-mortgages/fixed-rate-mortgage`
   - `/residential-mortgages/products/our-mortgages/adjustable-rate-mortgage`
   - Purely informational; no rates

4. **Prime Rate History:** `/residential-mortgages/advice/mortgage-rates-canada/prime-rate-history`
   - Contains the only actual rate table on the site

### 4.2 Technology Stack
- **CMS:** Sitecore (ASP.NET)
- **Frontend:** Bootstrap 4, jQuery 3.5.1
- **No SPA framework** — pages are server-rendered HTML
- **Axios library loaded** but only used for internal search/language toggle, NOT for fetching rates

---

## 5. Are Rates Loaded Dynamically via JavaScript?

**NO.** The investigation found:
- No AJAX/XHR calls fetching rate data
- No JSON endpoints serving mortgage rates
- No dynamic DOM injection of rate tables after page load
- The axios library (`https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js`) is loaded but used only for search functionality and language toggling
- All content is static HTML rendered server-side by Sitecore/ASP.NET

---

## 6. API Endpoints or Embedded JSON

### 6.1 No Public API for Rates
- No `/api/rates`, `/api/mortgage-rates`, or similar endpoints found
- No JSON data embedded in `<script type="application/json">` tags for rates

### 6.2 Schema.org JSON-LD (Structured Data)
- Found in `<head>` on most pages:
  ```html
  <script type="application/ld+json">
  {
    "@context": "http://schema.org",
    "@type": "MortgageLoan",
    "name": "1-10 Year Closed - Fixed Rate Mortgage",
    "brand": "MCAP",
    "description": "With a fixed interest rate mortgage payments are guaranteed not to change...",
    "currency": "CAD",
    "interestRate": "3.625",
    "annualPercentageRate": "3.8047",
    ...
  }
  </script>
  ```
- **⚠️ Important:** The `interestRate` value (`3.625`) and `annualPercentageRate` (`3.8047`) in this JSON-LD are **static template/example values** (in USD for a "Agency 30 Year Fixed"), NOT current Canadian mortgage rates. This schema appears to be hardcoded template data.

---

## 7. Playwright Selectors / Regex Patterns for Extraction

### 7.1 Extract Current Prime Rate
```python
# Playwright selector for prime rate value
page.locator(".prime-rate-module .round-number-box").inner_text()
# Expected: "4.45%"

# Alternative: CSS selector
page.locator("div.prime-rate-module p.round-number-box").inner_text()

# Regex pattern for prime rate from page text
prime_rate_pattern = r"MCAP Prime Rate\s*([\d.]+)%"

# Regex for prime rate in the round-number-box element
prime_rate_box_pattern = r"([\d.]+)%"
```

### 7.2 Extract Prime Rate Effective Date
```python
# Playwright selector
effective_date = page.locator(".prime-rate-module p:has-text('Effective')").inner_text()
# Expected: "Effective October 30, 2025"

# Regex
effective_date_pattern = r"Effective\s+([A-Za-z]+ \d{1,2}, \d{4})"
```

### 7.3 Extract Prime Rate History Table
```python
# Playwright: locate the history tables
history_tables = page.locator("table.mcap-table")
for table in history_tables.all():
    rows = table.locator("tbody tr").all()
    for row in rows:
        date_cell = row.locator("td").nth(0).inner_text()
        rate_cell = row.locator("td").nth(1).inner_text()
        # date_cell: "October 30, 2025"
        # rate_cell: "4.45"
```

### 7.4 Extract Schema.org JSON-LD (for metadata only)
```python
# Playwright
json_ld = page.locator('script[type="application/ld+json"]').inner_text()
import json
data = json.loads(json_ld)
# data.get("interestRate")  # "3.625" (template data, not current rate!)
```

---

## 8. Key Findings for Automation

1. **MCAP does NOT publish specific mortgage product rates** (1yr, 2yr, 3yr, 5yr fixed, etc.) on public pages. Automation cannot scrape specific mortgage rates from MCAP's public website.

2. **Only the Prime Rate is scrapable** from public pages. The prime rate is displayed prominently in the `.prime-rate-module` section.

3. **Prime Rate History is available** in a well-structured HTML table at the dedicated history page.

4. **No dynamic loading** — all data is static HTML, making scraping straightforward if data exists.

5. **To get actual mortgage rates**, users must:
   - Contact a broker (MCAP is a wholesale lender)
   - Log into the broker portal ("Professor - Broker Portal")
   - Use the MyMCAP homeowner portal for existing customers

6. **The JSON-LD structured data contains template/example values**, not live rates. Do not rely on it for current rate data.

---

## 9. Files Saved During Investigation

All raw HTML files are saved at:
- `C:\Users\acarr\latestmortgagerates\mcap_our_mortgages.html`
- `C:\Users\acarr\latestmortgagerates\mcap_mortgage_rates_canada.html`
- `C:\Users\acarr\latestmortgagerates\mcap_residential_mortgages.html`
- `C:\Users\acarr\latestmortgagerates\mcap_prime_rate_history.html`
- `C:\Users\acarr\latestmortgagerates\mcap_1_10_year_closed.html`
- `C:\Users\acarr\latestmortgagerates\mcap_fixed_rate.html`
- `C:\Users\acarr\latestmortgagerates\mcap_adjustable_rate.html`

---

## 10. Recommendations

### For Rate Scraping:
- **MCAP is not a good candidate for automated mortgage rate scraping** because they do not publish specific product rates publicly.
- The only automatable data point is the **Prime Rate** (currently 4.45%).

### For Tracking MCAP Rates:
- Consider monitoring the **prime rate history page** for changes.
- Consider monitoring the **residential mortgages page** for changes to the prime rate display.
- Consider reaching out to MCAP directly or using broker portal access if specific rate data is required.
