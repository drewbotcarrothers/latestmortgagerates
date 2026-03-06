import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Force static generation for static export
export const dynamic = "force-static";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  content: string[];
  faqs?: { question: string; answer: string }[];
}

const blogPosts: Record<string, BlogPost> = {
  "fixed-vs-variable-mortgage-rates": {
    slug: "fixed-vs-variable-mortgage-rates",
    title: "Fixed vs Variable Mortgage Rates: Which is Right for You?",
    excerpt: "Compare the pros and cons of fixed and variable rate mortgages in Canada.",
    category: "Mortgage Basics",
    readTime: "5 min read",
    publishedAt: "2026-03-03",
    content: [
      "## What Are Fixed Rate Mortgages?",
      "",
      "A fixed rate mortgage guarantees your interest rate stays the same for the entire term of your mortgage, typically 1-10 years. Your monthly payments remain constant, giving you predictable budgeting and peace of mind.",
      "",
      "**Key benefits of fixed rates:**",
      "",
      "- **Payment stability**: Your monthly payment never changes",
      "- **Budgeting ease**: Perfect for first-time buyers and those on fixed incomes",
      "- **Protection from rate increases**: If rates go up, your payment stays the same",
      "- **Lower stress**: No need to worry about market fluctuations",
      "",
      "**Current best 5-year fixed rates**: Starting from 4.19%",
      "",
      "## What Are Variable Rate Mortgages?",
      "",
      "A variable rate mortgage has an interest rate that fluctuates with your lender's prime rate. When the Bank of Canada changes its overnight rate, your lender's prime rate typically follows, affecting your monthly payment or amortization.",
      "",
      "**Key benefits of variable rates:**",
      "",
      "- **Lower initial rates**: Variable rates are typically lower than fixed rates",
      "- **Potential savings**: Historically, variable rates have cost less over time",
      "- **Flexibility**: Often come with lower prepayment penalties",
      "- **Benefits from rate drops**: When rates decrease, you pay less interest",
      "",
      "**Current best 5-year variable rates**: Starting from 3.85%",
      "",
      "## Which Should You Choose?",
      "",
      "### Choose a Fixed Rate If:",
      "",
      "- You prefer predictable monthly payments",
      "- You're buying your first home and want stability",
      "- You believe interest rates will rise significantly",
      "- You have a fixed income or tight budget",
      "- You value peace of mind over potential savings",
      "",
      "### Choose a Variable Rate If:",
      "",
      "- You can handle some payment uncertainty",
      "- You have financial cushion for rate increases",
      "- You believe rates will stay stable or decrease",
      "- You may sell or refinance before term ends (lower penalties)",
      "- You're comfortable with market fluctuations",
      "",
      "## The Hybrid Approach",
      "",
      "Some borrowers split their mortgage into fixed and variable portions—typically 50/50 or 60/40. This hedges your bets: you get some payment stability while potentially benefiting from rate decreases on the variable portion.",
      "",
      "## Current Market Outlook",
      "",
      "With the Bank of Canada having cut rates recently, variable rate mortgages are looking attractive for risk-tolerant borrowers. However, fixed rates have also become more competitive, offering near-historic lows.",
      "",
      "**Bottom line**: There's no universally right answer. Your choice should reflect your risk tolerance, financial situation, and market outlook. Compare current rates and speak with a mortgage professional before deciding.",
    ],
    faqs: [
      {
        question: "Can I switch from variable to fixed during my term?",
        answer: "Yes, most lenders allow you to convert from a variable rate to a fixed rate at any time without penalty. However, you'll be locked into the fixed rate available at that time.",
      },
      {
        question: "What happens when my mortgage term ends?",
        answer: "At the end of your term, you'll need to renew your mortgage. This is an opportunity to renegotiate your rate and potentially switch between fixed and variable.",
      },
    ],
  },
  "first-time-home-buyer-guide-canada": {
    slug: "first-time-home-buyer-guide-canada",
    title: "First-Time Home Buyer Guide: Everything You Need to Know",
    excerpt: "A complete guide for first-time buyers in Canada.",
    category: "First-Time Buyers",
    readTime: "8 min read",
    publishedAt: "2026-03-03",
    content: [
      "## Introduction",
      "",
      "Buying your first home is one of the biggest financial decisions you'll make. This guide covers everything Canadian first-time buyers need to know, from saving your down payment to closing the deal.",
      "",
      "## Down Payment Requirements",
      "",
      "In Canada, your minimum down payment depends on the purchase price:",
      "",
      "- **Under $500,000**: Minimum 5% of purchase price",
      "- **$500,000 to $999,999**: 5% on first $500,000 + 10% on remainder",
      "- **$1,000,000 or more**: Minimum 20% required",
      "",
      "**Pro tip**: Saving 20% avoids CMHC insurance (0.6% - 4% of mortgage amount), but isn't always practical in expensive markets.",
      "",
      "## First-Time Buyer Programs",
      "",
      "### 1. First Home Savings Account (FHSA)",
      "",
      "The FHSA is a game-changer for first-time buyers:",
      "",
      "- Contribute up to $8,000/year (lifetime max $40,000)",
      "- Contributions are tax-deductible",
      "- Withdrawals are tax-free",
      "- Can combine with RRSP Home Buyers' Plan",
      "",
      "### 2. RRSP Home Buyers' Plan (HBP)",
      "",
      "- Withdraw up to $35,000 from your RRSP ($70,000 for couples)",
      "- Must repay over 15 years",
      "- No tax on withdrawal",
      "",
      "### 3. Land Transfer Tax Rebates",
      "",
      "Many provinces offer rebates:",
      "",
      "- **Ontario**: Up to $4,000 rebate",
      "- **BC**: Up to $8,000 rebate",
      "- **Toronto**: Additional municipal rebate up to $4,475",
    ],
    faqs: [
      {
        question: "What's the minimum credit score needed?",
        answer: "Most lenders require 600 minimum, but 680+ gets you the best rates.",
      },
      {
        question: "Can I buy a home with no down payment?",
        answer: "No, minimum 5% is required for properties under $500,000.",
      },
    ],
  },
  "mortgage-stress-test-canada": {
    slug: "mortgage-stress-test-canada",
    title: "Understanding the Mortgage Stress Test in Canada",
    excerpt: "What is the mortgage stress test and how does it affect your borrowing power?",
    category: "Mortgage Rules",
    readTime: "6 min read",
    publishedAt: "2026-03-03",
    content: [
      "## What is the Mortgage Stress Test?",
      "",
      "The mortgage stress test ensures borrowers can afford their mortgage payments even if interest rates rise. Lenders must qualify you using the higher of: your contract rate + 2% or 5.25%.",
      "",
      "## GDS and TDS Ratios",
      "",
      "Your Gross Debt Service (GDS) ratio includes mortgage, property tax, and heating costs—maximum 32% of gross income. Total Debt Service (TDS) includes all debt payments—maximum 40% of gross income.",
      "",
      "## How to Pass the Stress Test",
      "",
      "- Reduce your debt",
      "- Increase your down payment",
      "- Consider longer amortization",
      "- Add a co-signer",
      "- Shop for the lowest rate",
    ],
    faqs: [
      {
        question: "Can I avoid the stress test?",
        answer: "If you're putting 20%+ down and renewing with your current lender, you typically avoid it.",
      },
    ],
  },
  "insured-vs-uninsured-mortgages": {
    slug: "insured-vs-uninsured-mortgages",
    title: "Insured vs Uninsured Mortgages: CMHC Premiums Explained",
    excerpt: "Understanding the difference between insured and conventional mortgages.",
    category: "Mortgage Basics",
    readTime: "5 min read",
    publishedAt: "2026-03-03",
    content: [
      "## Insured vs Uninsured Mortgages",
      "",
      "Insured mortgages require default insurance when you put down less than 20%. Premiums range from 2.80% (15-19.99% down) to 4.00% (5-9.99% down).",
      "",
      "Uninsured conventional mortgages require 20% down but offer more flexibility and no premium costs.",
    ],
    faqs: [
      {
        question: "Is CMHC insurance refundable?",
        answer: "No, it's a one-time premium added to your mortgage.",
      },
    ],
  },
  "mortgage-prepayment-penalties": {
    slug: "mortgage-prepayment-penalties",
    title: "Mortgage Prepayment Penalties Explained",
    excerpt: "Learn how prepayment penalties work and how to minimize them.",
    category: "Mortgage Strategy",
    readTime: "7 min read",
    publishedAt: "2026-03-03",
    content: [
      "## When Penalties Apply",
      "",
      "Penalties may apply when you sell before term ends, refinance, switch lenders, or pay off your mortgage early.",
      "",
      "## Fixed Rate Penalties",
      "",
      "The greater of interest rate differential (IRD) or three months' interest.",
      "",
      "## Variable Rate Penalties",
      "",
      "Three months' interest only—typically much lower than fixed rates.",
      "",
      "## How to Avoid Penalties",
      "",
      "- Port your mortgage to a new property",
      "- Use prepayment privileges",
      "- Wait until renewal",
    ],
  },
  "prime-rate-explained-canada": {
    slug: "prime-rate-explained-canada",
    title: "What is the Prime Rate and How Does It Affect Your Mortgage?",
    excerpt: "Everything you need to know about Canada's prime rate.",
    category: "Mortgage Basics",
    readTime: "4 min read",
    publishedAt: "2026-03-03",
    content: [
      "## Understanding Prime Rate",
      "",
      "The prime rate is what banks charge their most creditworthy customers. Currently approximately 5.45%. It's typically: Bank of Canada overnight rate + 2.0-2.2%.",
      "",
      "## Impact on Mortgages",
      "",
      "Variable rate mortgages change with prime rate. HELOCs typically charge prime + 0.5-1.0%. Fixed rates follow bond yields, not prime.",
    ],
    faqs: [
      {
        question: "How often does prime rate change?",
        answer: "It follows Bank of Canada decisions, typically 8 times per year.",
      },
    ],
  },
  // NEW BLOG POSTS
  "closing-costs-canada": {
    slug: "closing-costs-canada",
    title: "Closing Costs in Canada: Complete Guide for Homebuyers",
    excerpt: "Understand all the costs involved when buying a home in Canada, from down payments to land transfer tax and legal fees.",
    category: "Home Buying",
    readTime: "10 min read",
    publishedAt: "2026-03-04",
    content: [
      "## Introduction to Closing Costs",
      "",
      "When purchasing a home in Canada, closing costs add 1.5% to 4% of the property's purchase price. For a $700,000 home, budget an extra $10,500 to $28,000 beyond your down payment.",
      "",
      "## Down Payment Requirements",
      "",
      "- **Under $500,000**: Minimum 5%",
      "- **$500,000 to $999,999**: 5% on first $500,000 + 10% on remainder",
      "- **$1,000,000 and above**: Minimum 20%",
      "",
      "## Land Transfer Tax",
      "",
      "Provincial tax paid when property changes ownership. Ontario rates: 0.5% on first $55,000, 1% to $250,000, 1.5% to $400,000, 2% above $400,000. BC and Quebec have different rates.",
      "",
      "## Legal Fees and Disbursements",
      "",
      "Real estate lawyer costs: $800-$1,500 in fees plus $400-$800 in disbursements. Title insurance: $250-$400.",
      "",
      "## Other Closing Costs",
      "",
      "- Home inspection: $400-$600",
      "- Appraisal: $300-$500",
      "- CMHC insurance premium: 2.8%-4% of mortgage (if less than 20% down)",
      "- Property tax adjustments",
      "- Moving costs: $1,000-$5,000",
      "",
      "## First-Time Buyer Rebates",
      "",
      "- Ontario: Up to $4,000",
      "- British Columbia: Up to $8,000",
      "- Toronto: Additional municipal rebate up to $4,475",
      "- PEI: Full exemption",
    ],
    faqs: [
      {
        question: "Can closing costs be added to my mortgage?",
        answer: "Generally no, except for CMHC premiums which are capitalized. Closing costs require cash.",
      },
      {
        question: "When do I pay closing costs?",
        answer: "Most are paid on closing day via bank draft from your lawyer.",
      },
    ],
  },
  "mortgage-pre-approval-guide": {
    slug: "mortgage-pre-approval-guide",
    title: "How to Get Mortgage Pre-Approval in Canada",
    excerpt: "A step-by-step guide to mortgage pre-approval, including required documents and tips for success.",
    category: "Home Buying",
    readTime: "8 min read",
    publishedAt: "2026-03-04",
    content: [
      "## What is Mortgage Pre-Approval?",
      "",
      "Pre-approval is a lender's conditional commitment to lend you a specific amount based on your finances. It locks in an interest rate for 90-120 days and strengthens your offers.",
      "",
      "## Required Documents",
      "",
      "**Proof of Income:**",
      "- Letter of employment",
      "- Recent pay stubs",
      "- T4s and Notice of Assessment",
      "",
      "**Proof of Assets:**",
      "- Bank statements (90 days)",
      "- Investment account statements",
      "- RRSP/FHSA statements",
      "",
      "**Other Documents:**",
      "- ID verification",
      "- Credit report consent",
      "",
      "## The Pre-Approval Process",
      "",
      "1. Gather documents (3-5 days)",
      "2. Submit application to lender or broker",
      "3. Credit check performed",
      "4. Income and debt verification",
      "5. Receive pre-approval letter",
      "",
      "## Pre-Approval vs Pre-Qualification",
      "",
      "Pre-qualification is an estimate based on self-reported info. Pre-approval involves credit checks and document verification.",
      "",
      "## Tips for Success",
      "",
      "- Check and improve your credit score first",
      "- Avoid major purchases before applying",
      "- Don't change jobs",
      "- Save for a larger down payment",
      "- Pay down existing debt",
    ],
    faqs: [
      {
        question: "How long does pre-approval take?",
        answer: "24-72 hours for standard applications, longer for self-employed or complex situations.",
      },
      {
        question: "Does pre-approval guarantee a mortgage?",
        answer: "No, it's conditional. Final approval requires property appraisal and verification of unchanged finances.",
      },
    ],
  },
  "variable-vs-fixed-rates-2025": {
    slug: "variable-vs-fixed-rates-2025",
    title: "Variable vs Fixed Rates: 2025 Market Outlook",
    excerpt: "Expert analysis of the 2024-2025 mortgage rate outlook to help you choose between variable and fixed rates.",
    category: "Mortgage Strategy",
    readTime: "9 min read",
    publishedAt: "2026-03-04",
    content: [
      "## 2024-2025 Rate Environment",
      "",
      "After aggressive rate hikes in 2022-2023, the Bank of Canada began cutting rates in mid-2024. Current prime rate sits around 5.45%, down from the 7.20% peak.",
      "",
      "## Market Predictions for 2025",
      "",
      "Economists expect gradual rate cuts through 2025 as inflation continues cooling. Most forecasts suggest:",
      "",
      "- 2-3 additional rate cuts by end of 2025",
      "- Prime rate potentially reaching 4.5-5.0%",
      "- Fixed rates remaining relatively stable",
      "",
      "## Variable Rate Prospects",
      "",
      "If the Bank of Canada continues cutting, variable rate holders will benefit from:",
      "",
      "- Lower monthly payments or more principal being paid",
      "- Lower total interest costs over the term",
      "- Flexibility to convert to fixed if rates rise",
      "",
      "**Risk**: If inflation resurges, rates could stay higher longer.",
      "",
      "## Fixed Rate Outlook",
      "",
      "Fixed rates currently offer stability with rates that have already factored in expected cuts. Benefits include:",
      "",
      "- Payment certainty for the full term",
      "- Protection from rate volatility",
      "- Locking in near historic lows",
      "",
      "## Historical Performance",
      "",
      "Over the past 30 years, variable rates have cost less than fixed rates about 75% of the time. However, during volatile periods (like 2022-2023), fixed rates provided better protection.",
      "",
      "## Which to Choose?",
      "",
      "**Consider variable if:**",
      "- You're comfortable with some uncertainty",
      "- You have financial flexibility for higher payments",
      "- You believe rates will fall further",
      "",
      "**Consider fixed if:**",
      "- You need payment certainty",
      "- You're risk-averse",
      "- You're at maximum affordability",
    ],
    faqs: [
      {
        question: "Will rates go down in 2025?",
        answer: "Most economists predict gradual cuts, but it depends on inflation and economic performance.",
      },
      {
        question: "Should I wait for rates to drop before buying?",
        answer: "Timing the market is difficult. Focus on overall affordability and your personal situation rather than trying to predict rates.",
      },
    ],
  },
  "best-mortgage-rates-toronto": {
    slug: "best-mortgage-rates-toronto",
    title: "Best Mortgage Rates in Toronto 2025",
    excerpt: "Find the lowest mortgage rates in Toronto. Compare rates from top lenders for the GTA housing market.",
    category: "City Guides",
    readTime: "7 min read",
    publishedAt: "2026-03-04",
    content: [
      "## Toronto Mortgage Market 2025",
      "",
      "Toronto's housing market remains competitive. Average home prices in the GTA hover around $1.1-1.2 million, making mortgage rates critical to affordability.",
      "",
      "## Current Toronto Rates",
      "",
      "**5-Year Fixed**: Starting from 4.19%",
      "**5-Year Variable**: Starting from 3.85%",
      "**3-Year Fixed**: Starting from 4.39%",
      "**10-Year Fixed**: Starting from 4.54%",
      "",
      "## Toronto Market Characteristics",
      "",
      "- High prices mean many buyers need insured mortgages with less than 20% down",
      "- Condo market differs significantly from detached homes",
      "- Municipal land transfer tax doubles costs",
      "- First-time buyer rebates available up to $4,000 provincial + $4,475 municipal",
      "",
      "## Getting the Best Rate in Toronto",
      "",
      "1. Work with a broker familiar with GTA lenders",
      "2. Consider credit unions for competitive rates",
      "3. Online lenders often beat big bank rates",
      "4. Ask about rate holds (90-120 days)",
      "5. Consider all terms, not just 5-year",
      "",
      "## Toronto-Specific Tips",
      "",
      "- Condos often have higher monthly fees affecting qualifying amounts",
      "- Close to transit adds value and may improve rates",
      "- Some lenders offer special programs for downtown properties",
    ],
    faqs: [
      {
        question: "Are rates higher in Toronto?",
        answer: "Rates are generally consistent nationally, but Toronto's high prices mean more buyers need insured mortgages which can have different qualification rules.",
      },
    ],
  },
  "best-mortgage-rates-vancouver": {
    slug: "best-mortgage-rates-vancouver",
    title: "Best Mortgage Rates in Vancouver 2025",
    excerpt: "Find the lowest mortgage rates in Vancouver and Greater Vancouver Area. Compare rates for BC homebuyers.",
    category: "City Guides",
    readTime: "7 min read",
    publishedAt: "2026-03-04",
    content: [
      "## Vancouver Mortgage Market 2025",
      "",
      "Greater Vancouver's market shows resilience with average detached home prices around $2 million and condos around $750,000. High prices amplify the importance of securing the best rate.",
      "",
      "## Current Vancouver Rates",
      "",
      "**5-Year Fixed**: Starting from 4.14%",
      "**5-Year Variable**: Starting from 3.80%",
      "**3-Year Fixed**: Starting from 4.34%",
      "",
      "## BC Property Transfer Tax",
      "",
      "BC's property transfer tax applies to fair market value:",
      "- 1% on first $200,000",
      "- 2% on $200,000 to $2,000,000",
      "- 3% on $2,000,000 to $3,000,000",
      "- 5% on amounts over $3,000,000",
      "",
      "First-time buyers may qualify for exemptions on properties under $500,000.",
      "",
      "## Vancouver Market Factors",
      "",
      "- Foreign buyer ban affects demand",
      "- Speculation and vacancy tax may apply",
      "- Many buyers use co-signers due to high prices",
      "- Credit unions are popular alternatives",
      "",
      "## Getting the Best Rate in Vancouver",
      "",
      "1. Shop multiple lenders including credit unions",
      "2. Consider longer amortizations (30 years) for affordability",
      "3. Explore mortgage brokers with BC specialist knowledge",
      "4. Ask about portable mortgages if you may relocate",
    ],
    faqs: [
      {
        question: "Do Vancouver rates differ from rest of Canada?",
        answer: "Base rates are similar, but Vancouver's high prices mean different qualification challenges.",
      },
    ],
  },
  "best-mortgage-rates-calgary-montreal": {
    slug: "best-mortgage-rates-calgary-montreal",
    title: "Best Mortgage Rates in Calgary and Montreal 2025",
    excerpt: "Compare mortgage rates in Calgary and Montreal, two of Canada's most affordable major housing markets.",
    category: "City Guides",
    readTime: "8 min read",
    publishedAt: "2026-03-04",
    content: [
      "## Calgary Mortgage Market 2025",
      "",
      "Calgary remains one of Canada's most affordable major cities. Average home prices around $540,000 provide excellent value compared to Toronto and Vancouver.",
      "",
      "### Alberta Advantages",
      "",
      "- **No land transfer tax** (saves thousands vs other provinces)",
      "- Higher average incomes support affordability",
      "- No provincial sales tax on CMHC premiums",
      "- Lower closing costs overall",
      "",
      "### Current Calgary Rates",
      "",
      "**5-Year Fixed**: Starting from 4.19%",
      "**5-Year Variable**: Starting from 3.85%",
      "**3-Year Fixed**: Starting from 4.39%",
      "",
      "## Montreal Mortgage Market 2025",
      "",
      "Montreal offers relative affordability with average home prices around $540,000. The market has different dynamics with more multiplex properties.",
      "",
      "### Quebec Market Characteristics",
      "",
      "- Different qualification rules (TDS up to 40%)",
      "- Welcome Tax (taxe de bienvenue) applies",
      "- More multiplex housing options",
      "- Strong credit union presence (caisses populaires)",
      "",
      "### Current Montreal Rates",
      "",
      "**5-Year Fixed**: Starting from 4.24%",
      "**5-Year Variable**: Starting from 3.90%",
      "",
      "## Comparing the Two Markets",
      "",
      "| Factor | Calgary | Montreal |",
      "|--------|---------|----------|",
      "| Avg Home Price | ~$540K | ~$540K |",
      "| Land Transfer Tax | $0 | Varies |",
      "| Economic Base | Energy | Tech/Finance |",
      "| Market Trend | Stable | Growing |",
      "",
      "Both cities offer significantly better affordability than Toronto or Vancouver.",
    ],
    faqs: [
      {
        question: "Are rates better in Calgary or Montreal?",
        answer: "Rates are comparable, but Calgary's lack of land transfer tax makes overall costs lower.",
      },
    ],
  },
  "refinancing-your-mortgage": {
    slug: "refinancing-your-mortgage",
    title: "Refinancing Your Mortgage: When Does It Make Sense?",
    excerpt: "Learn when to refinance your mortgage, how much you can save, and what costs to expect.",
    category: "Mortgage Strategy",
    readTime: "9 min read",
    publishedAt: "2026-03-04",
    content: [
      "## What is Mortgage Refinancing?",
      "",
      "Refinancing replaces your existing mortgage with a new one, typically to get a better rate, access equity, or change loan terms.",
      "",
      "## Reasons to Refinance",
      "",
      "**Rate Reduction**:",
      "- Current rates are lower than your rate",
      "- Calculate break-even point (savings vs penalty costs)",
      "",
      "**Access Equity**:",
      "- Borrow up to 80% of home value for renovations, investments, or debt consolidation",
      "- Usually requires home appreciation",
      "",
      "**Change Terms**:",
      "- Switch from variable to fixed (or vice versa)",
      "- Extend amortization to lower payments",
      "- Add or remove co-signers",
      "",
      "## When Refinancing Makes Sense",
      "",
      "**The 1-2% Rule**: Generally worth it if you can reduce your rate by 1-2% or more.",
      "",
      "**Break-Even Calculation**:",
      "1. Calculate monthly savings with new rate",
      "2. Add up all refinancing costs",
      "3. Divide costs by monthly savings = months to break even",
      "",
      "**Example**:",
      "- Current rate: 5.5%",
      "- New rate: 4.2%",
      "- Penalty: $8,000",
      "- Legal/appraisal: $2,000",
      "- Monthly savings: $400",
      "- Break-even: 25 months",
      "",
      "## Refinancing Costs",
      "",
      "- Prepayment penalty: $3,000-$15,000+",
      "- Legal fees: $800-$1,500",
      "- Appraisal: $300-$500",
      "- Discharge fees: $200-$400",
      "",
      "## Alternatives to Refinancing",
      "",
      "- **Blend and extend**: Combine old rate with new, no penalty",
      "- **Home equity line of credit**: Access equity separately",
      "- **Wait for renewal**: No penalty at end of term",
    ],
    faqs: [
      {
        question: "How often can I refinance?",
        answer: "Typically every 6-12 months, but penalties usually make frequent refinancing uneconomical.",
      },
      {
        question: "Does refinancing hurt my credit?",
        answer: "The credit check causes a small temporary dip. Multiple refinances in short periods may concern lenders.",
      },
    ],
  },
  "porting-vs-breaking-mortgage": {
    slug: "porting-vs-breaking-mortgage",
    title: "Porting vs Breaking Your Mortgage: What You Need to Know",
    excerpt: "Understand the difference between porting your mortgage and breaking it when selling your home.",
    category: "Mortgage Strategy",
    readTime: "7 min read",
    publishedAt: "2026-03-04",
    content: [
      "## What is Mortgage Porting?",
      "",
      "Porting transfers your existing mortgage to a new property, keeping your current rate and terms while avoiding prepayment penalties. Most porting allows 30-120 days to close on your new home after selling.",
      "",
      "## Advantages of Porting",
      "",
      "- **No prepayment penalty**: Save thousands on penalties",
      "- **Keep your rate**: If your rate is better than current market rates",
      "- **Maintain terms**: Keep prepayment privileges and other features",
      "- **Blend option**: May be able to add new funds at blended rate",
      "",
      "## When Porting Works",
      "",
      "**Ideal scenarios**:",
      "- Selling and buying simultaneously",
      "- Your current rate is lower than market rates",
      "- You want to avoid penalties",
      "- Buying in similar price range",
      "",
      "## Breaking Your Mortgage",
      "",
      "Breaking means paying out your mortgage before term ends, triggering prepayment penalties.",
      "",
      "**When Breaking Makes Sense**:",
      "- Rates have dropped significantly",
      "- Moving to a lower cost area",
      "- Need different mortgage features",
      "- Penalty is low (near renewal)",
      "",
      "## Port vs Break Comparison",
      "",
      "| Factor | Porting | Breaking |",
      "|--------|---------|----------|",
      "| Penalty | None | 3 months interest to $10K+ |",
      "| Rate | Keep existing | Lock new rate |",
      "| Flexibility | Limited | Full |",
      "| Timeline | 30-120 days | Immediate |",
      "",
      "## Questions to Ask Your Lender",
      "",
      "- How long do I have to port?",
      "- Can I port to any property or just similar type/location?",
      "- What happens if new home costs more?",
      "- Can I blend and extend when porting?",
    ],
    faqs: [
      {
        question: "How long do I have to port my mortgage?",
        answer: "Most lenders allow 30-120 days between selling your old home and closing on the new one. Some offer extended portability up to 6-12 months.",
      },
      {
        question: "Can I port if I need a bigger mortgage?",
        answer: "Yes, most lenders allow you to increase your mortgage amount when porting. The additional amount typically at current rates (or blended rate if offered).",
      },
    ],
  },
  "mortgage-default-insurance-explained": {
    slug: "mortgage-default-insurance-explained",
    title: "Mortgage Default Insurance (CMHC) Explained",
    excerpt: "Everything you need to know about mortgage default insurance, including costs, providers, and how it affects your mortgage.",
    category: "Mortgage Basics",
    readTime: "8 min read",
    publishedAt: "2026-03-04",
    content: [
      "## What is Mortgage Default Insurance?",
      "",
      "Mortgage default insurance protects lenders if a borrower stops making payments. It's required for mortgages with less than 20% down payment (high-ratio mortgages). Premiums are added to your mortgage balance.",
      "",
      "The three providers in Canada are:",
      "- **CMHC** (Canada Mortgage and Housing Corporation) - government",
      "- **Sagen** (formerly Genworth) - private",
      "- **Canada Guaranty** - private",
      "",
      "## Premium Rates",
      "",
      "Premium is calculated as percentage of mortgage amount:",
      "",
      "| Down Payment | Premium Rate |",
      "|--------------|--------------|",
      "| 5% - 9.99%   | 4.00%        |",
      "| 10% - 14.99% | 3.10%        |",
      "| 15% - 19.99% | 2.80%        |",
      "",
      "**Example**: $500,000 home with 10% down",
      "- Mortgage: $450,000",
      "- Premium (3.10%): $13,950 added to mortgage",
      "- Total mortgage: $463,950",
      "",
      "## How Insurance Affects Your Mortgage",
      "",
      "**Maximum Amortization**: 25 years only (not 30)",
      "",
      "**Stress Test**: You must qualify using your contract rate + 2% or 5.25%, whichever is higher",
      "",
      "**Refinancing**: Limited flexibility to refinance without paying off insurance",
      "",
      "**Provincial Tax**: PST on the premium is paid upfront, not financed",
      "",
      "## Benefits of Insured Mortgages",
      "",
      "- **Lower interest rates**: Insured mortgages often have lowest rates",
      "- **Enter market sooner**: Buy with just 5% down",
      "- **Better lender access**: More lenders compete for insured mortgages",
      "",
      "## Drawbacks",
      "",
      "- Premium cost adds thousands over mortgage life",
      "- Shorter maximum amortization (25 years)",
      "- Provincial tax on premium",
      "- Less refinancing flexibility",
    ],
    faqs: [
      {
        question: "Is mortgage insurance the same as life insurance?",
        answer: "No. Mortgage default insurance protects the lender. Mortgage life insurance pays off your mortgage if you die. They are completely different products.",
      },
      {
        question: "Can I remove mortgage insurance?",
        answer: "Once added, it stays for the life of the mortgage. To remove it, you'd need to refinance when you have 20%+ equity, but refinancing has costs.",
      },
    ],
  },
  "improve-credit-score-mortgage": {
    slug: "improve-credit-score-mortgage",
    title: "How to Improve Your Credit Score for Better Mortgage Rates",
    excerpt: "Actionable strategies to boost your credit score and qualify for the best mortgage rates in Canada.",
    category: "Mortgage Strategy",
    readTime: "9 min read",
    publishedAt: "2026-03-04",
    content: [
      "## Why Credit Score Matters for Mortgages",
      "",
      "Your credit score significantly impacts your mortgage options:",
      "",
      "- **680+**: Best rates, all lender options",
      "- **650-679**: Good rates, most lenders available",
      "- **600-649**: Higher rates, limited options",
      "- **Below 600**: Alternative lenders only, highest rates",
      "",
      "## Understanding Your Credit Score",
      "",
      "Credit scores in Canada range from 300-900. The main factors affecting your score:",
      "",
      "- Payment history (35%): Paying bills on time",
      "- Credit utilization (30%): How much of available credit you use",
      "- Credit history length (15%): Average age of accounts",
      "- Credit mix (10%): Types of credit (loans, cards, lines)",
      "- New credit inquiries (10%): Recent applications",
      "",
      "## Quick Wins (1-3 Months)",
      "",
      "**1. Pay down credit card balances**",
      "Keep utilization under 30%, ideally under 10%. If you have a $10,000 limit, keep balance under $1,000.",
      "",
      "**2. Make all payments on time**",
      "Set up automatic payments. Even one missed payment can hurt your score.",
      "",
      "**3. Don't apply for new credit**",
      "Each hard inquiry slightly lowers your score. Stop applying 6+ months before mortgage.",
      "",
      "## Medium-Term Strategies (3-12 Months)",
      "",
      "**1. Keep old credit cards open**",
      "Length of credit history matters. Keep your oldest cards active with small purchases.",
      "",
      "**2. Increase credit limits**",
      "Higher limits lower your utilization ratio. Request increases on existing cards.",
      "",
      "**3. Diversify credit types**",
      "Mix of credit card, line of credit, and installment loan shows responsible management.",
      "",
      "**4. Dispute errors on your report**",
      "Check Equifax and TransUnion reports. Dispute any inaccuracies.",
      "",
      "## What NOT to Do Before a Mortgage",
      "",
      "- **Don't close old credit cards**: Hurts credit history length",
      "- **Don't miss any payments**: Stay perfect for 12+ months",
      "- **Don't max out credit**: Keep utilization low",
      "- **Don't co-sign loans**: Counts as your debt",
      "- **Don't switch jobs**: Employment stability matters",
      "",
      "## Monitoring Your Score",
      "",
      "Use free services like Borrowell or Credit Karma to track your score monthly. Check your full credit reports annually from both bureaus.",
    ],
    faqs: [
      {
        question: "How fast can I improve my credit score?",
        answer: "You can see improvements in 1-3 months by paying down balances. Significant increases (50+ points) typically take 6-12 months of good habits.",
      },
      {
        question: "Will checking my score hurt it?",
        answer: "No. Checking your own score is a soft inquiry and doesn't affect your credit. Only hard inquiries from lenders impact your score.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];
  
  if (!post) {
    return {
      title: "Post Not Found | Latest Mortgage Rates Canada",
    };
  }
  
  const relatedKeywords = [
    "Canadian mortgage",
    "mortgage rates Canada",
    "home buyer tips",
    "mortgage advice",
  ];
  
  return {
    title: `${post.title} | Latest Mortgage Rates Canada`,
    description: post.excerpt,
    keywords: [...post.title.split(" "), post.category.toLowerCase(), ...relatedKeywords],
    alternates: {
      canonical: `https://latestmortgagerates.ca/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://latestmortgagerates.ca/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: ["Latest Mortgage Rates Canada"],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts[slug];
  
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            author: {
              "@type": "Organization",
              name: "Latest Mortgage Rates Canada",
              url: "https://latestmortgagerates.ca",
            },
            datePublished: post.publishedAt,
            articleSection: post.category,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://latestmortgagerates.ca/blog/${post.slug}`,
            },
            ...(post.faqs && {
              "@type": ["BlogPosting", "FAQPage"],
              mainEntity: post.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium truncate max-w-xs">{post.title}</li>
            </ol>
          </nav>
          
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
            {post.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{post.readTime}</span>
            <span>•</span>
            <time>{new Date(post.publishedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
        </div>
      </header>

      <article className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="prose prose-lg max-w-none">
            {post.content.map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace("## ", "")}</h2>;
              }
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return <p key={index} className="font-bold text-gray-900">{paragraph.replace(/\*\*/g, "")}</p>;
              }
              if (paragraph.startsWith("- ")) {
                return <li key={index} className="ml-6 text-gray-700">{paragraph.replace("- ", "")}</li>;
              }
              if (paragraph.startsWith("|")) {
                return null;
              }
              if (paragraph === "") {
                return <br key={index} />;
              }
              return <p key={index} className="text-gray-700 mb-4">{paragraph}</p>;
            })}
          </div>

          {post.faqs && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {post.faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2">Ready to Compare Mortgage Rates?</h3>
            <p className="text-gray-600 mb-4">
              See today&apos;s best rates from Canada&apos;s top lenders and find your perfect mortgage.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Compare Rates
              </Link>
              <Link
                href="/blog"
                className="px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                More Guides
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
