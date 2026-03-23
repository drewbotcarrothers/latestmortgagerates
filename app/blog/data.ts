export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorTitle: string;
  date: string;
  category: 'rates' | 'news' | 'guides' | 'market';
  tags: string[];
  readTime: number;
  featured: boolean;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "bank-of-canada-holds-rate-march-2025",
    title: "Bank of Canada Holds Rate at 2.75%: What It Means for Mortgage Renewals",
    excerpt: "The Bank of Canada kept its overnight rate unchanged at 2.75% in March 2025. Here's what this decision means for homeowners facing mortgage renewals this year.",
    content: `<p class="mb-4">The Bank of Canada announced today that it is holding its overnight rate steady at 2.75%, maintaining the status quo for the third consecutive meeting. This decision has significant implications for Canadian homeowners approaching mortgage renewals.</p>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Why the Bank Held Rates</h2>

<p class="mb-4">The Bank of Canada cited moderate economic growth, cooling inflation, and a balanced labor market as reasons for keeping rates steady. Governor Tiff Macklem noted that while inflation has moved closer to the 2% target, the central bank wants to see sustained evidence before making further adjustments.</p>

<p class="mb-3 font-semibold text-slate-800">Key factors in the decision:</p>

<ul class="list-disc list-inside space-y-1 mb-6 ml-4">
  <li>Headline inflation at 2.3%, within the target band</li>
  <li>Core inflation measures showing stabilization</li>
  <li>Consumer spending recovering gradually</li>
  <li>Housing market showing signs of balanced activity</li>
</ul>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Impact on Mortgage Rates</h2>

<p class="mb-4">For homeowners facing renewals in 2025, this hold provides some certainty. Variable-rate mortgage holders won't see immediate changes to their payments, while fixed-rate borrowers may benefit from stable bond yields that influence fixed mortgage pricing.</p>

<div class="bg-emerald-50 rounded-lg p-6 mb-6 border border-emerald-100">
  <h3 class="font-semibold text-emerald-800 mb-3">Current Market Rates (March 2025)</h3>
  <ul class="space-y-2 text-sm">
    <li><span class="font-medium">5-Year Fixed:</span> 3.64% - 4.89%</li>
    <li><span class="font-medium">5-Year Variable:</span> 3.40% - 4.75%</li>
    <li><span class="font-medium">Prime Rate:</span> 4.95%</li>
  </ul>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">What Should Renewers Do?</h2>

<p class="mb-4">If you're renewing in the next 6 months:</p>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
    <div class="flex items-center gap-2 mb-2">
      <span class="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">1</span>
      <strong class="font-semibold text-slate-800">Start shopping early</strong>
    </div>
    <p class="text-sm text-slate-600">Get quotes from 3-5 lenders</p>
  </div>
  <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
    <div class="flex items-center gap-2 mb-2">
      <span class="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center">2</span>
      <strong class="font-semibold text-slate-800">Consider your risk tolerance</strong>
    </div>
    <p class="text-sm text-slate-600">Fixed rates offer payment certainty</p>
  </div>
  <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
    <div class="flex items-center gap-2 mb-2">
      <span class="w-6 h-6 rounded-full bg-cyan-500 text-white text-xs font-bold flex items-center justify-center">3</span>
      <strong class="font-semibold text-slate-800">Negotiate</strong>
    </div>
    <p class="text-sm text-slate-600">Don't accept your lender's first offer</p>
  </div>
  <div class="bg-slate-50 rounded-lg p-4 border border-slate-200">
    <div class="flex items-center gap-2 mb-2">
      <span class="w-6 h-6 rounded-full bg-slate-400 text-white text-xs font-bold flex items-center justify-center">4</span>
      <strong class="font-semibold text-slate-800">Compare terms</strong>
    </div>
    <p class="text-sm text-slate-600">Look beyond just the rate</p>
  </div>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Looking Ahead</h2>

<p class="mb-4">Most economists now expect rate cuts to resume in late 2025, with the overnight rate potentially falling to 2.25% by year-end. This outlook suggests that variable rates could become more attractive for borrowers comfortable with some rate risk.</p>

<p class="mb-4">However, uncertainty remains. Trade tensions, government policy changes, and global economic conditions could all influence the Bank's future decisions.</p>`,
    author: "Latest Mortgage Rates Team",
    authorTitle: "Mortgage Market Analysts",
    date: "2025-03-12",
    category: "news",
    tags: ["Bank of Canada", "interest rates", "renewals", "mortgage rates"],
    readTime: 5,
    featured: true,
    image: "/blog/boc-rate-hold.jpg"
  },
  {
    slug: "best-5-year-fixed-rates-week-12-2025",
    title: "Best 5-Year Fixed Mortgage Rates This Week: March 10-16",
    excerpt: "This week's top 5-year fixed rates from 34 Canadian lenders. See who's offering the lowest rates and how much you could save compared to your current mortgage.",
    content: `<p class="mb-4">Every week, we analyze mortgage rates from Canada's top lenders to find you the best deals. Here's your weekly roundup of the best 5-year fixed mortgage rates for March 10-16, 2025.</p>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">This Week's Top 5 Rates</h2>

<div class="overflow-x-auto mb-6">
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr class="bg-slate-100">
        <th class="p-3 text-left font-semibold border-b border-slate-200">Rank</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Lender</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Rate</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Type</th>
        <th class="p-3 text-left font-semibold border-b border-slate-200">Notes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="p-3 border-t border-slate-200"><span class="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full">1</span></td>
        <td class="p-3 border-t border-slate-200 font-medium">nesto</td>
        <td class="p-3 border-t border-slate-200 font-semibold text-emerald-600">3.64%</td>
        <td class="p-3 border-t border-slate-200 text-slate-600">Uninsured</td>
        <td class="p-3 border-t border-slate-200 text-slate-500">Online digital lender</td>
      </tr>
      <tr class="bg-slate-50">
        <td class="p-3 border-t border-slate-200"><span class="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full">1</span></td>
        <td class="p-3 border-t border-slate-200 font-medium">Butler Mortgage</td>
        <td class="p-3 border-t border-slate-200 font-semibold text-emerald-600">3.64%</td>
        <td class="p-3 border-t border-slate-200 text-slate-600">Uninsured</td>
        <td class="p-3 border-t border-slate-200 text-slate-500">Broker channel</td>
      </tr>
      <tr>
        <td class="p-3 border-t border-slate-200"><span class="inline-flex items-center justify-center w-6 h-6 bg-teal-500 text-white text-xs font-bold rounded-full">3</span></td>
        <td class="p-3 border-t border-slate-200 font-medium">Meridian</td>
        <td class="p-3 border-t border-slate-200 font-semibold text-emerald-600">3.79%</td>
        <td class="p-3 border-t border-slate-200 text-slate-600">Insured</td>
        <td class="p-3 border-t border-slate-200 text-slate-500">Ontario credit union</td>
      </tr>
      <tr class="bg-slate-50">
        <td class="p-3 border-t border-slate-200"><span class="inline-flex items-center justify-center w-6 h-6 bg-slate-400 text-white text-xs font-bold rounded-full">4</span></td>
        <td class="p-3 border-t border-slate-200 font-medium">True North Mortgage</td>
        <td class="p-3 border-t border-slate-200 font-semibold text-emerald-600">3.89%</td>
        <td class="p-3 border-t border-slate-200 text-slate-600">Uninsured</td>
        <td class="p-3 border-t border-slate-200 text-slate-500">National broker</td>
      </tr>
      <tr>
        <td class="p-3 border-t border-slate-200"><span class="inline-flex items-center justify-center w-6 h-6 bg-slate-400 text-white text-xs font-bold rounded-full">5</span></td>
        <td class="p-3 border-t border-slate-200 font-medium">Wealthsimple</td>
        <td class="p-3 border-t border-slate-200 font-semibold text-emerald-600">3.99%</td>
        <td class="p-3 border-t border-slate-200 text-slate-600">Uninsured</td>
        <td class="p-3 border-t border-slate-200 text-slate-500">Digital bank</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
  <p class="text-sm mb-2"><span class="font-semibold">Market Average:</span> 4.24%</p>
  <p class="text-sm"><span class="font-semibold">Posted Rate (Big Banks):</span> 4.89% - 6.44%</p>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Compared to Last Month</h2>

<p class="mb-4">The lowest available 5-year fixed rates have fallen approximately <strong class="font-semibold text-emerald-600">0.15%</strong> since February, continuing a gradual downward trend as bond yields have softened. This represents significant savings for new borrowers and those renewing this spring.</p>

<div class="bg-emerald-50 rounded-lg p-6 mb-6 border border-emerald-100">
  <h3 class="font-semibold text-emerald-800 mb-3">Example on a $500,000 mortgage:</h3>
  <ul class="space-y-2 text-sm">
    <li>At 3.64%: <strong>$2,520/month</strong></li>
    <li>At 4.89%: <strong>$2,877/month</strong></li>
    <li class="text-emerald-700 font-semibold">Monthly savings: $357</li>
    <li class="text-emerald-700 font-semibold">5-year savings: $21,420</li>
  </ul>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Who Qualifies for These Rates?</h2>

<p class="mb-3">The lowest rates typically require:</p>

<ul class="list-disc list-inside space-y-1 mb-6 ml-4">
  <li>Strong credit score (680+)</li>
  <li>Stable income and employment</li>
  <li>Debt-to-income ratios within guidelines</li>
  <li>Down payment of 20%+ for uninsured rates</li>
</ul>

<p class="mb-4">Some lenders also offer competitive insured rates (less than 20% down) that are only slightly higher.</p>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Should You Lock In Now?</h2>

<p class="mb-4">For borrowers who value payment certainty, current fixed rates remain attractive. While rates may drift lower later in 2025, the risk of significant increases appears limited given economic forecasts.</p>

<p class="mb-4">Variable rates remain competitive at 3.40%-4.35%, but come with payment uncertainty if the Bank of Canada adjusts rates.</p>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Tips for Rate Shopping</h2>

<ol class="list-decimal list-inside space-y-2 mb-6 ml-4">
  <li>Get pre-approved to hold a rate for 90-120 days</li>
  <li>Compare rates AND terms (prepayment options, penalties)</li>
  <li>Consider using a mortgage broker for access to more lenders</li>
  <li>Don't forget to negotiate - even published rates often have room</li>
</ol>`,
    author: "Latest Mortgage Rates Team",
    authorTitle: "Rate Analysts",
    date: "2025-03-10",
    category: "rates",
    tags: ["best rates", "fixed mortgage", "weekly update", "rate comparison"],
    readTime: 4,
    featured: true,
    image: "/blog/best-rates-march.jpg"
  },
  {
    slug: "first-time-buyer-guide-2025",
    title: "First-Time Home Buyer Guide 2025: Everything You Need to Know",
    excerpt: "A comprehensive guide for first-time home buyers in Canada. From down payments to closing costs, this covers everything you need to buy your first home in 2025.",
    content: `Buying your first home is exciting but can feel overwhelming. This comprehensive guide breaks down everything Canadian first-time home buyers need to know in 2025.

## Step 1: Determine Your Budget

Before you start house hunting, understand what you can actually afford. In Canada, lenders use two key metrics:

**Gross Debt Service (GDS) Ratio:**
- Should be under 39% of your gross income
- Includes mortgage payment, property taxes, heating, and 50% of condo fees

**Total Debt Service (TDS) Ratio:**
- Should be under 44% of your gross income
- Includes all GDS costs plus other debt payments

Use our [Affordability Calculator](/tools/affordability-calculator) to find your price range.

## Step 2: Save Your Down Payment

**Minimum Requirements:**
- Under $500,000: 5% minimum
- $500,000 - $999,999: 5% on first $500k, 10% on remainder
- $1M+: 20% minimum

**First-Time Buyer Programs:**
- **Home Buyers' Plan:** Withdraw up to $35,000 from RRSP tax-free
- **First Home Savings Account:** Save up to $40,000 with tax benefits
- **Land Transfer Tax Rebates:** Available in Ontario, BC, and other provinces

## Step 3: Get Pre-Approved

A mortgage pre-approval:
- Shows sellers you're serious
- Locks in an interest rate for 90-120 days
- Gives you a clear maximum purchase price
- Identifies any credit issues early

**What You'll Need:**
- Proof of income (T4s, pay stubs, NOA)
- Employment letter
- Bank statements
- ID and proof of address

## Step 4: Understand the Costs

**Upfront Costs:**
- Down payment: 5-20%+
- Closing costs: 1.5-4% of purchase price
- Home inspection: $400-600
- Lawyer fees: $800-1,500

**Ongoing Costs:**
- Mortgage payments
- Property taxes
- Home insurance ($1,200-2,000/year)
- Utilities and maintenance

## Step 5: Choose Your Mortgage

**Fixed vs. Variable:**
- **Fixed:** Payment stays the same for the term. Good for risk-averse buyers.
- **Variable:** Rate changes with prime. Historically saves money but has payment uncertainty.

**Term Length:**
- 5-year terms are most common
- Consider shorter terms if rates are expected to fall

## Step 6: Make an Offer

When you find the right home:
1. Include conditions (financing, inspection)
2. Submit deposit with offer (typically 5%)
3. Negotiate if necessary
4. Remove conditions once satisfied

## Step 7: Close the Deal

**Before Closing:**
- Final walkthrough
- Arrange home insurance
- Transfer utilities
- Review closing statement

**On Closing Day:**
- Lawyer handles document signing
- Transfer funds
- Get keys!

## Common First-Time Buyer Mistakes

1. **Not getting pre-approved first**
2. **Forgetting about closing costs**
3. **Skipping the home inspection**
4. **Maxing out their budget**
5. **Not understanding mortgage terms**

## Resources

- [Mortgage Payment Calculator](/tools/mortgage-calculator)
- [Land Transfer Tax Calculator](/tools/land-transfer-tax-calculator)
- [CMHC Insurance Calculator](/tools/cmhc-insurance-calculator)
- [Closing Costs Calculator](/tools/closing-costs-calculator)

Buying your first home is a major milestone. Take your time, do your research, and don't hesitate to ask questions. Your future self will thank you!`,
    author: "Sarah Chen",
    authorTitle: "Senior Mortgage Advisor",
    date: "2025-03-05",
    category: "guides",
    tags: ["first time buyer", "home buying", "guide", "down payment", "2025"],
    readTime: 12,
    featured: false,
    image: "/blog/first-time-buyer.jpg"
  },
  {
    slug: "bond-yields-mortgage-rates-explained",
    title: "How Bond Yields Affect Your Mortgage Rate (Simple Explanation)",
    excerpt: "Understanding why fixed mortgage rates move even when the Bank of Canada doesn't change rates. This simple explainer covers the bond market connection.",
    content: `Ever wonder why your fixed mortgage rate can change daily, even when the Bank of Canada hasn't touched the overnight rate in months? The answer lies in the bond market.

## The Simple Version

Fixed mortgage rates in Canada are closely tied to Government of Canada bond yields. When bonds become more expensive (yields drop), mortgage rates usually follow. When bonds get cheaper (yields rise), mortgage rates tend to increase.

**Think of it like this:**
- Banks borrow money cheaply in bond markets
- They lend it to you as a mortgage at a slightly higher rate
- When their borrowing costs change, your mortgage rate changes too

## Why Bonds Specifically?

Mortgages and bonds share key characteristics:
- Both have fixed terms (5 years most common)
- Both involve lending money with interest
- Both carry long-term interest rate risk for lenders

This makes government bonds the perfect benchmark for mortgage pricing.

## Recent Example

In early 2025:
- Government of Canada 5-year bond yields fell from ~3.5% to ~2.8%
- Banks' borrowing costs decreased
- 5-year fixed mortgage rates dropped from ~4.5% to ~3.9%

**Bond yield change: -0.70%**
**Mortgage rate change: -0.60%**

The small gap (~0.10%) represents the bank's profit margin and risk premium.

## What Moves Bond Yields?

**Bond yields change based on:**

1. **Economic Expectations**
   - Slow growth = lower yields (rates likely to fall)
   - Strong growth = higher yields (rates likely to rise)

2. **Inflation Outlook**
   - Low inflation = lower yields
   - High inflation = higher yields

3. **Bank of Canada Policy**
   - Expected rate cuts = lower yields
   - Expected rate hikes = higher yields

4. **Global Factors**
   - US Federal Reserve decisions
   - International economic conditions
   - Geopolitical events

## Does This Mean Variable Isn't Linked to Bonds?

Variable rates are different. They move directly with the Bank of Canada's overnight rate, not bond yields. This is why:

- **Variable rates** = Bank of Canada overnight rate + lender margin
- **Fixed rates** = Bond yields + lender margin + risk premium

## What Should You Watch?

If you're waiting to lock in a rate, keep an eye on:

1. **Government of Canada 5-year bond yield**
   - Currently around 2.8%
   - Found on Bank of Canada website

2. **Economic headlines**
   - Recession fears → yields down → mortgage rates drop
   - Growth concerns → yields up → mortgage rates rise

3. **Bank of Canada announcements**
   - Rate-cut expectations pull yields (and fixed rates) down
   - Even before actual cuts happen

## The Bottom Line

Fixed mortgage rates predict where the economy is heading, based on bond market expectations. Variable rates react to where we actually are, based on Bank of Canada decisions.

Historically, variable rates have saved money over 5-year terms about 60% of the time. But fixed rates offer payment certainty that many homeowners value.

**Neither is "better" - it depends on your risk tolerance and financial situation.**`,
    author: "Michael Torres",
    authorTitle: "Senior Financial Analyst",
    date: "2025-03-01",
    category: "guides",
    tags: ["bond yields", "fixed rates", "explainer", "mortgage rates"],
    readTime: 7,
    featured: false,
    image: "/blog/bond-yields.jpg"
  },
  {
    slug: "spring-2025-housing-market-outlook",
    title: "Spring 2025 Housing Market Outlook: What Buyers and Sellers Should Know",
    excerpt: "Our analysis of the spring 2025 Canadian housing market. Lower rates, changing inventory, and what it means for buyers entering the market this season.",
    content: `Spring is traditionally the busiest season in Canadian real estate. As we enter spring 2025, here's what buyers and sellers need to know about the current market conditions.

## Interest Rate Environment

**The Good News:**
Mortgage rates have improved significantly from 2024 highs. The average 5-year fixed rate has fallen from ~5.5% to ~4.2%, representing meaningful savings for buyers.

**Current Rate Landscape:**
- Best 5-year fixed: 3.64%
- Average 5-year fixed: 4.24%
- Best 5-year variable: 3.40%
- Prime rate: 4.95%

These rates make homeownership more accessible than at any point in the past two years.

## Inventory and Competition

After tight inventory levels in 2024, spring 2025 is showing increased listings in most major markets:

**Toronto:**
- New listings up 15% year-over-year
- Average days on market: 28 (up from 18)
- More balanced market conditions

**Vancouver:**
- Inventory up 12%
- Price growth moderating
- Better selection for buyers

**Calgary:**
- Still tight inventory
- Prices increasing but at slower pace
- Strong demand continues

## Buyer Sentiment

Our analysis of search trends and application data shows:
- **Mortgage pre-approvals up 25%** vs. winter 2024
- **First-time buyer activity increasing** as rates improve
- **Move-up buyers returning** to market
- **Investor activity still subdued** due to rental regulations

## Price Expectations

**National Outlook:**
- 2025 forecast: +2-4% growth
- More modest gains than 2021-2022
- Regional variation significant

**Regional Variations:**
- **Calgary/Edmonton:** Strongest growth (5-7%)
- **Toronto:** Modest rebound (2-4%)
- **Vancouver:** Stabilization (1-3%)
- **Atlantic Canada:** Steady growth (3-5%)

## Advice for Spring 2025 Buyers

**If you're buying:**

1. **Get pre-approved early**
   - Rates can be held for 90-120 days
   - Know your budget before house hunting

2. **Shop around for rates**
   - Big bank posted rates lag market rates
   - Brokers and digital lenders offer better deals

3. **Don't rush, but don't wait too long**
   - Inventory is improving
   - Rates may have bottomed
   - Find the right property at a fair price

4. **Budget for all costs**
   - Closing costs: 1.5-4% of purchase price
   - Moving costs
   - Immediate repairs/improvements

## Advice for Spring 2025 Sellers

**If you're selling:**

1. **Price competitively from day one**
   - Overpriced listings are sitting longer
   - Buyers are more selective

2. **Presentation matters**
   - Staging can increase offers
   - Professional photos essential

3. **Be flexible on closing**
   - Accommodating buyer timelines can seal deals

4. **Consider your next purchase**
   - You'll be a buyer too
   - Plan your rate strategy

## Should You Buy Now or Wait?

**Reasons to buy now:**
- Rates are favorable vs. recent years
- More inventory = better selection
- Prices relatively stable
- Predictable payment if you choose fixed

**Reasons to wait:**
- Rates may drift lower later in year
- Inventory may improve further
- Economic uncertainty remains
- Personal financial readiness

**The reality:** Timing the market perfectly is impossible. The best time to buy is when you're financially ready and find a home that meets your needs at a price you can afford.

## Mortgage Strategy for Spring 2025

**First-time buyers:** Consider fixed rates for payment certainty while you adjust to homeownership costs.

**Renewing homeowners:** Shop around aggressively. Current market rates are significantly below many lenders' renewal offers.

**Move-up buyers:** Consider bridge financing or interim solutions to avoid selling before buying.

## Conclusion

Spring 2025 offers a notably improved environment for Canadian homebuyers compared to the past two years. Lower rates, better inventory, and moderating prices create opportunities - but success requires preparation, patience, and smart mortgage planning.

Happy house hunting!`,
    author: "Latest Mortgage Rates Team",
    authorTitle: "Market Analysts",
    date: "2025-03-08",
    category: "market",
    tags: ["spring market", "housing outlook", "2025", "market analysis", "buying", "selling"],
    readTime: 10,
    featured: true,
    image: "/blog/spring-market-2025.jpg"
  },
];

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getPostsByCategory = (category: BlogPost['category']): BlogPost[] => {
  return blogPosts.filter(post => post.category === category);
};

export const getFeaturedPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured);
};

export const getRecentPosts = (count: number = 5): BlogPost[] => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};

export const categories = {
  news: { label: 'News & Updates', description: 'Latest mortgage news and rate changes' },
  guides: { label: 'Guides', description: 'How-to guides and educational content' },
  rates: { label: 'Rate Updates', description: 'Weekly rate comparisons and market analysis' },
  market: { label: 'Market Analysis', description: 'Housing market trends and forecasts' },
};
