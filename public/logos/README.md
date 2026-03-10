# Lender Logos

Place lender logo images in this directory. Each logo should be a PNG file named after the lender's slug.

## Required Logo Files

### Big 6 Banks
- `rbc.png` - RBC Royal Bank
- `td.png` - TD Canada Trust
- `scotiabank.png` - Scotiabank
- `bmo.png` - BMO Bank of Montreal
- `cibc.png` - CIBC
- `nationalbank.png` - National Bank

### Digital Banks
- `nesto.png` - nesto
- `tangerine.png` - Tangerine
- `eqbank.png` - EQ Bank
- `simplii.png` - Simplii Financial
- `motive.png` - Motive Financial
- `alterna.png` - Alterna Bank

### Credit Unions
- `meridian.png` - Meridian Credit Union
- `desjardins.png` - Desjardins
- `vancity.png` - Vancity
- `coastcapital.png` - Coast Capital Savings

### Regional Banks
- `atb.png` - ATB Financial
- `cwb.png` - Canadian Western Bank

### Monoline Lenders
- `firstnational.png` - First National
- `mcap.png` - MCAP
- `laurentian.png` - Laurentian Bank
- `manulife.png` - Manulife Bank
- `rfa.png` - RFA Bank
- `cmls.png` - CMLS Financial
- `merix.png` - Merix Financial
- `lendwise.png` - Lendwise
- `butlermortgage.png` - Butler Mortgage
- `intellimortgage.png` - IntelliMortgage
- `streetcapital.png` - Street Capital
- `centum.png` - Centum

## Logo Specifications

- **Format:** PNG with transparent background (preferred)
- **Size:** 200x200px minimum (displays at 32x32, 40x40, or 48x48)
- **Style:** Simple, recognizable logos that work at small sizes
- **Naming:** Use lowercase, no spaces (e.g., `firstnational.png` not `First National.png`)

## Fallback Behavior

If a logo file is missing, the component will automatically display:
- A colored circular badge with the lender's initials
- The lender's full name (if `showText` is true)

This ensures the site works even without all logos uploaded.

## Getting Logos

You can:
1. Download official logos from each lender's website
2. Use a logo API service like Clearbit or Logo.dev
3. Create simple text-based logos

## Current Status

All 30 lenders currently use the fallback colored initials system until logo images are added to this directory.
