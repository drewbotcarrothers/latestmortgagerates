# Simplii Financial Mortgage Rates — Page Structure Investigation

**Date:** 2026-08-13  
**URL:** https://www.simplii.com/en/rates/mortgage-rates.html  
**Fetched At:** 2026-08-13T11:01:54Z  

---

## 1. Summary

Simplii Financial’s mortgage rates page uses **server-side placeholders** (`RDS%...%`) that are **replaced with actual numeric values by JavaScript at runtime**. The raw HTML fetched via `curl`/`web_fetch` does **not** contain the live rates — it contains placeholder strings like `RDS%rate[5].FRCM.Published(2_null_null_Years_T,null,18,null)(#O2#)%`.

This means **Playwright (or a full browser) is required** to extract the actual displayed rates. A simple HTTP fetch is insufficient.

---

## 2. HTML Elements Containing Rate Data

### 2.1 Special Rates Table (Top Section)
Located around HTML line ~3190–3226.

**Structure:** Plain HTML `<table>` with class `dotted-cool-black`.

| HTML Path | Description |
|-----------|-------------|
| `table.dotted-cool-black tbody tr` | Rows for each term |
| `td:nth-child(1)` | Term label (e.g., "2-year fixed") |
| `td:nth-child(2)` | Special rate (placeholder replaced by JS) |
| `td:nth-child(3)` | APR (placeholder replaced by JS) |

**Example row (raw HTML):**
```html
<tr>
  <td><span class="body-copy">2-year fixed</span></td>
  <td>
    <span class="data-rds new-class"
          data-rds="%rate[5].FRCM.Published(2_null_null_Years_T,null,18,null)(#O2#)%"
          data-cibc-rate="true">
      RDS%rate[5].FRCM.Published(2_null_null_Years_T,null,18,null)(#O2#)%
    </span>
  </td>
  <td>
    <span class="data-rds new-class"
          data-rds="%rate[5].FRCM.Published(2_null_null_Years_T,null,2,null)(#O2#)%"
          data-cibc-rate="true">
      RDS%rate[5].FRCM.Published(2_null_null_Years_T,null,2,null)(#O2#)%
    </span>
  </td>
</tr>
```

**Terms in this table:**
- 2-year fixed
- 3-year fixed
- 4-year fixed
- 5-year fixed
- 5-year variable

---

### 2.2 Posted Rates Table (Bottom Section — Collapsible)
Located around HTML line ~3760–3858.

**Structure:** Another `<table>` inside a collapsible accordion ("Show more" / "Show less").

**Columns (left to right):**
1. Term (6 month, 12 month, 2 year, 3 year, 4 year, 5 year, 7 year, 10 year)
2. Simplii Variable-rate mortgages – Posted rates
3. Simplii Fixed-rate mortgages – Posted rates
4. Simplii Convertible mortgages
5. Starter Mortgage – Posted rates
6. Fixed Plus Mortgage – Posted rates
7. Fundamental Mortgage – Posted rates

**Example cell (raw HTML):**
```html
<td style="text-align: center;">
  <span class="data-rds new-class"
        data-rds="%rate[5].FRCM.Published(2_null_null_Years_T,null,1,null)(#O2#)%"
        data-cibc-rate="true">
    RDS%rate[5].FRCM.Published(2_null_null_Years_T,null,1,null)(#O2#)%
  </span>
</td>
```

---

### 2.3 Prime Rate
Located around HTML line ~4058.

```html
<h3>
  CIBC Prime Rate:
  <span class="data-rds new-class"
        data-rds="%rate[1].PRIME.Published(null,null,null,null)(#O2#)%"
        data-cibc-rate="true">
    RDS%rate[1].PRIME.Published(null,null,null,null)(#O2#)%
  </span>
</h3>
<p>Effective date:
  <span class="data-rds new-class"
        data-rds="%SYSTEM_DATE(#M# #d#, #Y#)%"
        data-cibc-rate="true">
    RDS%SYSTEM_DATE(#M# #d#, #Y#)%
  </span>
</p>
```

---

## 3. Dynamic Loading via JavaScript

### 3.1 How Rates Are Loaded
The raw HTML contains **RDS (Rate Data Service) placeholders**. These are replaced client-side by JavaScript.

**Key scripts loaded:**
- `/etc.clientlibs/cibcpublic/clientlibs/rds-shared.min.js` (line ~4971) — **this is the most likely script that replaces placeholders**
- `/etc.clientlibs/cibcpublic/clientlibs/foundation.min.js`
- `/etc.clientlibs/simpliipublic/clientlibs/all.min.js`

**Mechanism hypothesis:**
1. Page loads with placeholders inside `<span class="data-rds">` elements.
2. `rds-shared.min.js` queries all `.data-rds` elements.
3. It parses the `data-rds` attribute (e.g., `%rate[5].FRCM.Published(2_null_null_Years_T,null,18,null)(#O2#)%`).
4. It makes an API call to CIBC/Simplii’s rate service (likely via Akamai edge).
5. It replaces the placeholder text content with the actual numeric rate.

### 3.2 No Obvious JSON-in-Script Tags
No `application/ld+json`, `window.__INITIAL_STATE__`, or inline JSON blocks containing rates were found in the HTML.

### 3.3 No Obvious XHR/Fetch API Endpoints in Raw HTML
No explicit API URLs were found in `<script>` tags or data attributes. The rate lookup is likely abstracted inside `rds-shared.min.js`.

---

## 4. Playwright Selectors / Extraction Strategy

Because the placeholders are replaced by JavaScript, **use Playwright with `wait_for_timeout` or `wait_for_selector` after page load**.

### 4.1 Recommended Approach

1. **Navigate** to `https://www.simplii.com/en/rates/mortgage-rates.html`
2. **Wait** for JavaScript to finish replacing placeholders (~2–3 seconds or until text no longer contains `RDS%`).
3. **Extract** text from the rendered DOM.

### 4.2 Useful Selectors

**Special rates table:**
```python
# Wait for the special rates table to render actual numbers
page.wait_for_selector("table.dotted-cool-black .data-rds", timeout=10000)

# Extract all rows
rows = page.query_selector_all("table.dotted-cool-black tbody tr")
for row in rows:
    cells = row.query_selector_all("td")
    if len(cells) >= 3:
        term = cells[0].inner_text().strip()
        special_rate = cells[1].inner_text().strip()
        apr = cells[2].inner_text().strip()
        print(f"{term}: {special_rate} (APR: {apr})")
```

**Individual spans by data-rds attribute:**
```python
# 2-year fixed special rate
span = page.query_selector('span[data-rds*="FRCM.Published(2_null_null_Years_T,null,18,null)"]')
rate = span.inner_text().strip() if span else None
```

**Prime rate:**
```python
prime_span = page.query_selector('span[data-rds*="PRIME.Published"]')
prime_rate = prime_span.inner_text().strip() if prime_span else None
```

**Posted rates table (requires expanding):**
```python
# Click "Show more" if the posted rates are hidden
show_more = page.query_selector("a.show-more-link")
if show_more and show_more.is_visible():
    show_more.click()
    page.wait_for_timeout(1000)

# Then query the second table
posted_table = page.query_selector_all("table")[1]  # or use a more specific selector
```

### 4.3 Regex Pattern for Validation
To confirm a value is a real rate (not a placeholder):
```regex
^\d+\.\d+%$   # e.g., "5.34%"
```

To detect placeholders:
```regex
RDS%.*%
```

### 4.4 Wait Condition
Wait until the page no longer contains placeholder text:
```python
page.wait_for_function(
    """() => !document.body.innerText.includes('RDS%')""",
    timeout=15000
)
```

---

## 5. Key Findings for Automation

| Finding | Implication |
|---------|-------------|
| Raw HTML has `RDS%...%` placeholders | `curl`/`web_fetch` alone cannot get rates |
| JavaScript replaces placeholders | Must use Playwright or similar full browser |
| No obvious public JSON API | Cannot easily bypass the page |
| `rds-shared.min.js` handles replacement | May require waiting for JS execution |
| "Show more" accordion hides posted rates | May need to click to expand before extraction |
| `data-rds` attributes contain rate metadata | Can be used as stable selectors even if text changes |

---

## 6. Files

- Saved raw HTML: `C:\Users\acarr\.openclaw\workspace\simplii_mortgage_rates.html`

---

## 7. Next Steps for Scraping

1. Use Playwright to navigate to the page.
2. Wait for JS to replace placeholders (check `document.body.innerText` no longer contains `RDS%`).
3. Extract from `table.dotted-cool-black` for special rates.
4. Click "Show more" if needed, then extract from the second table for posted rates.
5. Parse `inner_text()` from `.data-rds` spans.
6. Validate rates match `\d+\.\d+%` pattern.
