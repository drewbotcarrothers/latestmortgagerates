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
    slug: "first-time-buyer-guide-2026",
    title: "First-Time Home Buyer Guide 2026: Everything You Need to Know",
    excerpt: "A comprehensive guide for first-time home buyers in Canada. From down payments to closing costs, this covers everything you need to buy your first home in 2026.",
    content: `<p class="mb-4">Buying your first home is exciting but can feel overwhelming. This comprehensive guide breaks down everything Canadian first-time home buyers need to know in 2026.</p>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Step 1: Determine Your Budget</h2>

<p class="mb-4">Before you start house hunting, understand what you can actually afford. In Canada, lenders use two key metrics to assess your borrowing power:</p>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div class="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-2xl">📊</span>
      <h3 class="font-semibold text-emerald-800">GDS Ratio</h3>
    </div>
    <p class="text-sm text-slate-600 mb-2"><strong>Gross Debt Service</strong> — Should be under <span class="text-emerald-600 font-bold">39%</span> of gross income</p>
    <ul class="text-sm text-slate-600 space-y-1">
      <li>✓ Mortgage payment</li>
      <li>✓ Property taxes</li>
      <li>✓ Heating costs</li>
      <li>✓ 50% of condo fees</li>
    </ul>
  </div>
  <div class="bg-teal-50 rounded-lg p-5 border border-teal-100">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-2xl">📈</span>
      <h3 class="font-semibold text-teal-800">TDS Ratio</h3>
    </div>
    <p class="text-sm text-slate-600 mb-2"><strong>Total Debt Service</strong> — Should be under <span class="text-teal-600 font-bold">44%</span> of gross income</p>
    <ul class="text-sm text-slate-600 space-y-1">
      <li>✓ All GDS costs</li>
      <li>✓ Car loan payments</li>
      <li>✓ Credit card minimums</li>
      <li>✓ Student loan payments</li>
    </ul>
  </div>
</div>

<div class="bg-slate-100 rounded-lg p-4 mb-6 border border-slate-200">
  <p class="text-sm text-slate-600">💡 <strong>Use our calculator:</strong> <a href="/tools/affordability-calculator" class="text-teal-600 hover:underline font-medium">Affordability Calculator →</a></p>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Step 2: Save Your Down Payment</h2>

<div class="bg-amber-50 rounded-lg p-6 mb-6 border border-amber-100">
  <h3 class="font-semibold text-amber-800 mb-4 flex items-center gap-2">
    <span>💰</span> Minimum Down Payment Requirements
  </h3>
  
  <div class="space-y-3">
    <div class="bg-white rounded-md p-3 border border-amber-200 flex justify-between items-center">
      <span class="text-slate-700 text-sm">Purchase under $500,000</span>
      <span class="font-bold text-amber-700">5%</span>
    </div>
    <div class="bg-white rounded-md p-3 border border-amber-200 flex justify-between items-center">
      <span class="text-slate-700 text-sm">$500,000 – $999,999</span>
      <span class="font-bold text-amber-700">5% + 10%</span>
    </div>
    <div class="bg-white rounded-md p-3 border border-amber-200 flex justify-between items-center">
      <span class="text-slate-700 text-sm">$1M or more</span>
      <span class="font-bold text-amber-700">20%</span>
    </div>
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div class="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
    <h3 class="font-semibold text-emerald-800 mb-3">✓ Home Buyers' Plan</h3>
    <p class="text-sm text-slate-600">Withdraw up to <strong class="text-emerald-700">$35,000</strong> from your RRSP tax-free for your down payment. Must be repaid over 15 years.</p>
  </div>
  
  <div class="bg-teal-50 rounded-lg p-5 border border-teal-100">
    <h3 class="font-semibold text-teal-800 mb-3">✓ First Home Savings Account</h3>
    <p class="text-sm text-slate-600">Save up to <strong class="text-teal-700">$40,000</strong> with tax benefits. Contributions are tax-deductible, withdrawals are tax-free for home purchase.</p>
  </div>
</div>

<p class="mb-4">📍 <strong>Land Transfer Tax Rebates:</strong> First-time buyers may receive rebates in Ontario, BC, and other provinces. See our <a href="/tools/land-transfer-tax-calculator" class="text-teal-600 hover:underline">LTT Calculator</a> for details.</p>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Step 3: Get Pre-Approved</h2>

<p class="mb-4">A mortgage pre-approval is essential before you start house hunting:</p>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div class="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
    <p class="font-semibold text-slate-800 mb-3">🎯 Why Get Pre-Approved?</p>
    <ul class="space-y-2 text-sm text-slate-600">
      <li>Shows sellers you're serious</li>
      <li>Locks in rate for 90-120 days</li>
      <li>Shows clear budget limit</li>
      <li>Identifies credit issues early</li>
    </ul>
  </div>
  <div class="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
    <p class="font-semibold text-slate-800 mb-3">📋 What You'll Need:</p>
    <ul class="space-y-1 text-sm text-slate-600">
      <li>• Proof of income (T4s, pay stubs)</li>
      <li>• Notice of Assessment (NOA)</li>
      <li>• Employment letter</li>
      <li>• Bank statements</li>
      <li>• ID and proof of address</li>
    </ul>
  </div>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Step 4: Understand the Costs</h2>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div class="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
    <h3 class="font-semibold text-emerald-800 mb-4">💳 Upfront Costs</h3>
    <ul class="space-y-2 text-sm">
      <li class="flex justify-between"><span>Down payment</span><span class="font-medium text-emerald-700">5-20%+</span></li>
      <li class="flex justify-between"><span>Closing costs</span><span class="font-medium text-emerald-700">1.5-4%</span></li>
      <li class="flex justify-between"><span>Home inspection</span><span class="font-medium text-emerald-700">$400-600</span></li>
      <li class="flex justify-between"><span>Lawyer fees</span><span class="font-medium text-emerald-700">$800-1,500</span></li>
      <li class="flex justify-between"><span>Land transfer tax</span><span class="font-medium text-emerald-700">Varies</span></li>
    </ul>
  </div>

  <div class="bg-slate-50 rounded-lg p-5 border border-slate-200">
    <h3 class="font-semibold text-slate-800 mb-4">📅 Ongoing Costs</h3>
    <ul class="space-y-2 text-sm">
      <li class="flex justify-between"><span>Mortgage payment</span><span class="font-medium text-slate-600">Monthly</span></li>
      <li class="flex justify-between"><span>Property tax</span><span class="font-medium text-slate-600">Annual</span></li>
      <li class="flex justify-between"><span>Home insurance</span><span class="font-medium text-slate-600">$1,200-2,000/yr</span></li>
      <li class="flex justify-between"><span>Utilities</span><span class="font-medium text-slate-600">Monthly</span></li>
      <li class="flex justify-between"><span>Maintenance%</span><span class="font-medium text-slate-600">1-3%/yr</span></li>
    </ul>
  </div>
</div>

<div class="bg-slate-100 rounded-lg p-4 mb-6 border border-slate-200">
  <p class="text-sm text-slate-600">💡 <strong>Estimate your total:</strong> <a href="/tools/closing-costs-calculator" class="text-teal-600 hover:underline font-medium">Closing Costs Calculator →</a></p>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Step 5: Choose Your Mortgage</h2>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div class="bg-blue-50 rounded-lg p-5 border border-blue-100">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-semibold text-blue-800">🔒 Fixed Rate</h3>
      <span class="bg-blue-200 text-blue-700 text-xs px-2 py-1 rounded">Lower Risk</span>
    </div>
    <p class="text-sm text-slate-600 mb-2">Payment stays the same for the entire term.</p>
    <ul class="space-y-1 text-sm text-slate-600">
      <li class="flex items-center gap-2">
        <span class="text-emerald-500">✓</span> Payment certainty
      </li>
      <li class="flex items-center gap-2">
        <span class="text-emerald-500">✓</span> Easier budgeting
      </li>
      <li class="flex items-center gap-2">
        <span class="text-red-500">✗</span> Higher penalties if rates fall
      </li>
    </ul>
    <p class="text-xs text-slate-500 mt-3">Best for: Risk-averse buyers, first-timers</p>
  </div>

  <div class="bg-teal-50 rounded-lg p-5 border border-teal-100">
    <div class="flex items-center justify-between mb-3">
      <h3 class="font-semibold text-teal-800">📊 Variable Rate</h3>
      <span class="bg-teal-200 text-teal-700 text-xs px-2 py-1 rounded">Historically Saves</span>
    </div>
    <p class="text-sm text-slate-600 mb-2">Rate changes with prime. Historically saves money.</p>
    <ul class="space-y-1 text-sm text-slate-600">
      <li class="flex items-center gap-2">
        <span class="text-emerald-500">✓</span> Historically lower cost
      </li>
      <li class="flex items-center gap-2">
        <span class="text-emerald-500">✓</span> Lower penalties
      </li>
      <li class="flex items-center gap-2">
        <span class="text-amber-500">⚠</span> Payment uncertainty
      </li>
    </ul>
    <p class="text-xs text-slate-500 mt-3">Best for: Risk-tolerant, financially flexible</p>
  </div>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Step 6: Make an Offer</h2>

<p class="mb-4">When you find the right home, follow these steps:</p>

<div class="flex flex-col gap-3 mb-6">
  <div class="flex items-start gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
    <span class="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">1</span>
    <div>
      <p class="font-semibold text-slate-800">Include Conditions</p>
      <p class="text-sm text-slate-600">Protect yourself with financing and inspection conditions.</p>
    </div>
  </div>

  <div class="flex items-start gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
    <span class="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">2</span>
    <div>
      <p class="font-semibold text-slate-800">Submit Deposit</p>
      <p class="text-sm text-slate-600">Typically ~5% with your offer (held in trust).</p>
    </div>
  </div>

  <div class="flex items-start gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
    <span class="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">3</span>
    <div>
      <p class="font-semibold text-slate-800">Negotiate</p>
      <p class="text-sm text-s003c/p>
      <p class="text-sm text-slate-600">Be prepared for counter-offers and negotiations.</p>
    </div>
  </div>

  <div class="flex items-start gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
    <span class="w-8 h-8 bg-slate-400 text-white rounded-full flex items-center justify-center font-bold shrink-0">4</span>
    <div>
      <p class="font-semibold text-slate-800">Firm It Up</p>
      <p class="text-sm text-slate-600">Remove conditions once satisfied (financing, inspection).</p>
    </div>
  </div>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Step 7: Close the Deal</h2>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div class="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
    <h3 class="font-semibold text-emerald-800 mb-3">📝 Before Closing</h3>
    <ul class="space-y-1 text-sm text-slate-600">
      <li>• Complete final walkthrough</li>
      <li>• Arrange home insurance</li>
      <li>• Transfer utilities</li>
      <li>• Review closing statement</li>
      <li>• Get cashier's cheques ready</li>
    </ul>
  </div>

  <div class="bg-teal-50 rounded-lg p-5 border border-teal-100">
    <h3 class="font-semibold text-teal-800 mb-3">🎉 Closing Day</h3>
    <ul class="space-y-1 text-sm text-slate-600">
      <li>• Meet with lawyer</li>
      <li>• Sign mortgage documents</li>
      <li>• Transfer funds</li>
      <li>• Receive keys! 🔑</li>
      <li>• Take possession</li>
    </ul>
  </div>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Common First-Time Buyer Mistakes to Avoid</h2>

<div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
  <div class="bg-red-50 rounded-lg p-4 border border-red-100 flex items-start gap-3">
    <span class="text-xl">❌</span>
    <div>
      <p class="font-semibold text-red-800 text-sm">Not getting pre-approved first</p>
      <p class="text-xs text-red-600">Know your budget before house hunting.</p>
    </div>
  </div>

  <div class="bg-red-50 rounded-lg p-4 border border-red-100 flex items-start gap-3">
    <span class="text-xl">❌</span>
    <div>
      <p class="font-semibold text-red-800 text-sm">Forgetting about closing costs</p>
      <p class="text-xs text-red-600">Budget 1.5-4% beyond the purchase price.</p>
    </div>
  </div>

  <div class="bg-red-50 rounded-lg p-4 border border-red-100 flex items-start gap-3">
    <span class="text-xl">❌</span>
    <div>
      <p class="font-semibold text-red-800 text-sm">Skipping the home inspection</p>
      <p class="text-xs text-red-600">$400-600 could save thousands later.</p>
    </div>
  </div>

  <div class="bg-red-50 rounded-lg p-4 border border-red-100 flex items-start gap-3">
    <span class="text-xl">❌</span>
    <div>
      <p class="font-semibold text-red-800 text-sm">Maxing out their budget</p>
      <p class="text-xs text-red-600">Leave room for unexpected costs.</p>
    </div>
  </div>

  <div class="bg-red-50 rounded-lg p-4 border border-red-100 flex items-start gap-3 md:col-span-2">
    <span class="text-xl">❌</span>
    <div>
      <p class="font-semibold text-red-800 text-sm">Not understanding mortgage terms</p>
      <p class="text-xs text-red-600">Know your prepayment privileges, penalties, and portability options before signing.</p>
    </div>
  </div>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Helpful Calculators &amp; Tools</h2>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <a href="/tools/mortgage-calculator" class="bg-slate-50 hover:bg-slate-100 rounded-lg p-4 border border-slate-200 transition-colors">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-semibold text-slate-800">Mortgage Payment Calculator</p>
        <p class="text-sm text-slate-500">See your monthly payments</p>
      </div>
      <span class="text-teal-600">&rarr;</span>
    </div>
  </a>

  <a href="/tools/affordability-calculator" class="bg-slate-50 hover:bg-slate-100 rounded-lg p-4 border border-slate-200 transition-colors">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-semibold text-slate-800">Affordability Calculator</p>
        <p class="text-sm text-slate-500">Find your maximum budget</p>
      </div>
      <span class="text-teal-600">&rarr;</span>
    </div>
  </a>

  <a href="/tools/land-transfer-tax-calculator" class="bg-slate-50 hover:bg-slate-100 rounded-lg p-4 border border-slate-200 transition-colors">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-semibold text-slate-800">Land Transfer Tax Calculator</p>
        <p class="text-sm text-slate-500">Estimate provincial LTT + rebates</p>
      </div>
      <span class="text-teal-600">&rarr;</span>
    </div>
  </a>

  <a href="/tools/cmhc-insurance-calculator" class="bg-slate-50 hover:bg-slate-100 rounded-lg p-4 border border-slate-200 transition-colors">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-semibold text-slate-800">CMHC Insurance Calculator</p>
        <p class="text-sm text-slate-500">Calculate mortgage default premiums</p>
      </div>
      <span class="text-teal-600">&rarr;</span>
    </div>
  </a>
</div>

<div class="bg-emerald-50 rounded-lg p-6 border border-emerald-100 mb-6">
  <p class="font-semibold text-emerald-800 mb-2">✨ You're Ready!</p>
  <p class="text-slate-700">Buying your first home is a major milestone. Take your time, do your research, and don't hesitate to ask questions along the way. Your future self will thank you for making informed decisions today.</p>
  <p class="text-slate-600 text-sm mt-3 italic">— The Latest Mortgage Rates Team</p>
</div>`,
    author: "Sarah Chen",
    authorTitle: "Senior Mortgage Advisor",
    date: "2026-03-23",
    category: "guides",
    tags: ["first time buyer", "home buying", "guide", "down payment", "2026"],
    readTime: 12,
    featured: false,
    image: "/blog/first-time-buyer-2026.jpg"
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
    slug: "spring-2026-housing-market-outlook",
    title: "Spring 2026 Housing Market Outlook: What Buyers and Sellers Should Know",
    excerpt: "Our analysis of the spring 2026 Canadian housing market. Lower rates, changing inventory, and what it means for buyers entering the market this season.",
    content: `<p class="mb-4">Spring is traditionally the busiest season in Canadian real estate. As we enter spring 2026, here's what buyers and sellers need to know about the current market conditions.</p>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Interest Rate Environment</h2>

<div class="bg-emerald-50 rounded-lg p-6 mb-6 border border-emerald-100">
  <h3 class="font-semibold text-emerald-800 mb-3 flex items-center gap-2">The Good News</h3>
  <p class="mb-3">Mortgage rates have improved significantly from 2025 highs. The average 5-year fixed rate has fallen from <span class="font-semibold">~5.5%</span> to <span class="font-semibold">~4.2%</span>, representing meaningful savings for buyers.</p>
</div>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  <div class="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center">
    <p class="text-sm text-slate-500 mb-1">Best 5-Yr Fixed</p>
    <p class="text-2xl font-bold text-emerald-600">3.64%</p>
  </div>
  <div class="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center">
    <p class="text-sm text-slate-500 mb-1">Avg 5-Yr Fixed</p>
    <p class="text-2xl font-bold text-slate-700">4.24%</p>
  </div>
  <div class="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center">
    <p class="text-sm text-slate-500 mb-1">Best Variable</p>
    <p class="text-2xl font-bold text-teal-600">3.40%</p>
  </div>
  <div class="bg-slate-50 rounded-lg p-4 border border-slate-200 text-center">
    <p class="text-sm text-slate-500 mb-1">Prime Rate</p>
    <p class="text-2xl font-bold text-slate-700">4.95%</p>
  </div>
</div>

<p class="mb-4">These rates make homeownership more accessible than at any point in the past two years.</p>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Inventory and Competition</h2>

<p class="mb-4">After tight inventory levels in 2025, spring 2026 is showing increased listings in most major markets:</p>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div class="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-2xl">🏙️</span>
      <h3 class="font-semibold text-slate-900">Toronto</h3>
    </div>
    <ul class="space-y-2 text-sm">
      <li class="flex items-center gap-2"><span class="text-emerald-500 font-bold">↑</span><span>New listings up <strong>15%</strong></span></li>
      <li class="flex items-center gap-2"><span class="text-amber-500">⏱️</span><span>Days on market: <strong>28</strong> (was 18)</span></li>
      <li class="flex items-center gap-2"><span class="text-blue-500">⚖️</span><span>More balanced conditions</span></li>
    </ul>
  </div>

  <div class="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-2xl">🌲</span>
      <h3 class="font-semibold text-slate-900">Vancouver</h3>
    </div>
    <ul class="space-y-2 text-sm">
      <li class="flex items-center gap-2"><span class="text-emerald-500 font-bold">↑</span><span>Inventory up <strong>12%</strong></span></li>
      <li class="flex items-center gap-2"><span class="text-blue-500">📊</span><span>Growth moderating</span></li>
      <li class="flex items-center gap-2"><span class="text-emerald-500">✓</span><span>Better selection for buyers</span></li>
    </ul>
  </div>

  <div class="bg-white rounded-lg p-5 border border-slate-200 shadow-sm">
    <div class="flex items-center gap-2 mb-3">
      <span class="text-2xl">🏔️</span>
      <h3 class="font-semibold text-slate-900">Calgary</h3>
    </div>
    <ul class="space-y-2 text-sm">
      <li class="flex items-center gap-2"><span class="text-amber-500">🔥</span><span>Still tight inventory</span></li>
      <li class="flex items-center gap-2"><span class="text-emerald-500 font-bold">↑</span><span>Prices rising slower</span></li>
      <li class="flex items-center gap-2"><span class="text-teal-500">💪</span><span>Strong demand</span></li>
    </ul>
  </div>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Buyer Sentiment</h2>

<p class="mb-4">Our analysis of search trends and application data shows:</p>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div class="flex items-center gap-4 bg-emerald-50 rounded-lg p-4 border border-emerald-100">
    <div class="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl">📈</div>
    <div>
      <p class="font-semibold text-emerald-800">+25% Pre-approvals</p>
      <p class="text-sm text-emerald-600">vs. winter 2024</p>
    </div>
  </div>
  <div class="flex items-center gap-4 bg-teal-50 rounded-lg p-4 border border-teal-100">
    <div class="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white text-xl">🏠</div>
    <div>
      <p class="font-semibold text-teal-800">First-time buyers returning</p>
      <p class="text-sm text-teal-600">Activity increasing</p>
    </div>
  </div>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Price Expectations</h2>

<div class="bg-slate-50 rounded-lg p-6 mb-6 border border-slate-200">
  <h3 class="font-semibold text-slate-800 mb-4">National Outlook</h3>
  <div class="mb-4">
    <div class="flex justify-between mb-2">
      <span class="text-slate-600">2026 Forecast</span>
      <span class="font-semibold text-emerald-600">+2-4% growth</span>
    </div>
    <div class="w-full bg-slate-200 rounded-full h-3"><div class="bg-emerald-500 h-3 rounded-full" style="width: 50%"></div></div>
  </div>
  <p class="text-sm text-slate-600">More modest gains than 2021-2022. Regional variation significant.</p>
</div>

<h3 class="text-lg font-semibold text-slate-800 mb-3">Regional Forecasts</h3>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
  <div class="bg-white p-4 rounded-lg border border-slate-200 text-center">
    <p class="text-2xl mb-1">🔥</p>
    <p class="font-semibold text-slate-900 text-sm">Calgary/Edmonton</p>
    <p class="text-emerald-600 font-bold">+5-7%</p>
  </div>
  <div class="bg-white p-4 rounded-lg border border-slate-200 text-center">
    <p class="text-2xl mb-1">🏙️</p>
    <p class="font-semibold text-slate-900 text-sm">Toronto</p>
    <p class="text-emerald-600 font-bold">+2-4%</p>
  </div>
  <div class="bg-white p-4 rounded-lg border border-slate-200 text-center">
    <p class="text-2xl mb-1">🌲</p>
    <p class="font-semibold text-slate-900 text-sm">Vancouver</p>
    <p class="text-teal-600 font-bold">+1-3%</p>
  </div>
  <div class="bg-white p-4 rounded-lg border border-slate-200 text-center">
    <p class="text-2xl mb-1">🌊</p>
    <p class="font-semibold text-slate-900 text-sm">Atlantic Canada</p>
    <p class="text-emerald-600 font-bold">+3-5%</p>
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  <div class="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
    <h3 class="font-semibold text-emerald-800 mb-3 flex items-center gap-2">✓ Advice for Buyers</h3>
    <ul class="space-y-2 text-sm">
      <li><strong>Get pre-approved early</strong> — Rates can be held for 90-120 days</li>
      <li><strong>Shop around for rates</strong> — Big bank rates lag market rates</li>
      <li><strong>Don't rush</strong> — Inventory improving</li>
      <li><strong>Budget for all costs</strong> — Closing costs run 1.5-4%</li>
    </ul>
  </div>

  <div class="bg-amber-50 rounded-lg p-5 border border-amber-100">
    <h3 class="font-semibold text-amber-800 mb-3">⚠️ Advice for Sellers</h3>
    <ul class="space-y-2 text-sm">
      <li><strong>Price competitively</strong> — Overpriced listings sit longer</li>
      <li><strong>Presentation matters</strong> — Staging can increase offers</li>
      <li><strong>Be flexible on closing</strong> — Accommodate buyer timelines</li>
      <li><strong>Plan your next purchase</strong> — You'll be a buyer too</li>
    </ul>
  </div>
</div>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Should You Buy Now or Wait?</h2>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div class="bg-white rounded-lg p-5 border-2 border-emerald-200">
    <h3 class="font-semibold text-emerald-700 mb-3">✓ Buy Now</h3>
    <ul class="space-y-2 text-sm text-slate-600">
      <li>Rates favorable vs. recent years</li>
      <li>More inventory = better selection</li>
      <li>Prices relatively stable</li>
      <li>Predictable payments with fixed rates</li>
    </ul>
  </div>

  <div class="bg-slate-50 rounded-lg p-5 border border-slate-200">
    <h3 class="font-semibold text-slate-700 mb-3">⊙ Wait</h3>
    <ul class="space-y-2 text-sm text-slate-600">
      <li>Rates may drift lower later in year</li>
      <li>Inventory improving further</li>
      <li>Economic uncertainty remains</li>
      <li>Wait for personal financial readiness</li>
    </ul>
  </div>
</div>

<div class="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-6">
  <p class="font-medium text-slate-800 mb-2">The reality:</p>
  <p class="text-slate-600">Timing the market perfectly is impossible. The best time to buy is when you're financially ready and find a home that meets your needs at a price you can afford.</p>
</div>

<p class="mb-4"><span class="font-semibold">Spring 2026</span> offers a notably improved environment for Canadian homebuyers compared to the past two years. Lower rates, better inventory, and moderating prices create opportunities—but success requires preparation, patience, and smart mortgage planning.</p>

<h2 class="text-xl font-semibold mt-8 mb-4 text-slate-900">Data Sources &amp; Methodology</h2>

<div class="bg-slate-50 rounded-lg p-6 border border-slate-200 mb-6">
  <p class="text-sm text-slate-600 mb-4">This analysis is based on the following data sources and methodologies:</p>
  
  <ul class="space-y-3 text-sm text-slate-600">
    <li><strong>Rate Data:</strong> Daily rate monitoring from <a href="/" class="text-teal-600 hover:underline">LatestMortgageRates.ca</a> database covering 34+ direct lenders across Canada.</li>
    <li><strong>Inventory Data:</strong> Monthly MLS sales and listing statistics from the Canadian Real Estate Association (CREA) and regional real estate boards (TRREB, REBGV, CREB).</li>
    <li><strong>Price Trends:</strong> Home Price Index data from CREA and local board reports published March 2026.</li>
    <li><strong>Search Trends:</strong> Aggregated application data from mortgage brokers and digital lending platforms.</li>
    <li><strong>Bank of Canada:</strong> Policy interest rate announcements and Monetary Policy Reports (bankofcanada.ca).</li>
    <li><strong>Economic Forecasts:</strong> Consensus estimates from major Canadian banks and economic research firms.</li>
  </ul>
  
  <p class="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-200">Data current as of March 23, 2026. Past performance does not guarantee future results. Local market conditions may vary significantly from national trends.</p>
</div>

<p class="text-slate-600 italic">Happy house hunting! 🏠</p>`,
    author: "Latest Mortgage Rates Team",
    authorTitle: "Market Analysts",
    date: "2026-03-23",
    category: "market",
    tags: ["spring market", "housing outlook", "2026", "market analysis", "buying", "selling"],
    readTime: 10,
    featured: true,
    image: "/blog/spring-market-2026.jpg"
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
