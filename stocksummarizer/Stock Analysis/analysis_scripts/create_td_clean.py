"""
Create clean TD post without BCE references
"""

import json
import base64
import urllib.request

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

CHART_URLS = {
    'chart1': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart1_pe_comparison-3.png',
    'chart2': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart2_dividend_yield-3.png',
    'chart3': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart3_dashboard-3.png',
    'chart4': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart4_valuation_metrics-2.png',
    'chart5': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart5_valuation_scorecard-2.png',
    'chart6': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart6_historical_performance-2.png',
    'chart7': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart7_performance_summary-2.png'
}

content = f"""<h2>TD Bank Stock Analysis: Premium Quality at Fair Value - February 25, 2026</h2>

<p><strong>TL;DR:</strong> Toronto-Dominion Bank (TSX: TD) trades at 11.2x P/E with a solid 3.3% dividend yield. This is one of Canada's premier banks with 170 years of history, significant U.S. operations, and steady returns. Here's the complete analysis:</p>

<hr />

<h3>The Setup: Canada's Second Largest Bank</h3>

<p>Toronto-Dominion Bank currently trades at <strong>11.2x P/E</strong>. To put that in perspective:</p>

<ul>
<li>Sector average P/E: 11.7x (modest 4% discount to sector)</li>
<li>TD P/B: 1.88x (reflects premium franchise quality)</li>
<li>Dividend yield: 3.32% with conservative 36% payout ratio</li>
<li>ROE: 16.9% demonstrating solid profitability</li>
</ul>

<p>TD is not a deep value play trading at distressed multiples, but it offers <strong>quality at fair price</strong> with solid dividend income and potential for modest multiple expansion.</p>

<p><img src="{CHART_URLS['chart1']}" alt="TD P/E Comparison" /></p>

<hr />

<h3>The Asset: Canada's Premier Retail Banking Franchise</h3>

<p>Before analyzing the price, let's understand what you actually own:</p>

<ul>
<li><strong>Founded:</strong> 1855 (170 years of operation)</li>
<li><strong>Market Cap:</strong> $215 billion (Canada's 2nd largest bank)</li>
<li><strong>Business Model:</strong> Three key segments:
    <ul>
    <li><strong>Canadian Retail Banking:</strong> Largest branch network in Canada, dominant market position</li>
    <li><strong>U.S. Retail Banking:</strong> Top 10 U.S. bank by deposits, key growth engine</li>
    <li><strong>Wholesale Banking:</strong> Capital markets, corporate banking, advisory services</li>
    </ul>
</li>
</ul>

<p><strong>Key Stats:</strong> Price: $129.16 | P/E: 11.2x | P/B: 1.88x | Dividend: 3.32% | ROE: 16.9% | Market Cap: $215B</p>

<p><strong>Key Insight:</strong> TD is a high-quality bank with exposure to both Canadian stability and U.S. growth. The U.S. division differentiates TD from pure Canadian banks and provides a growth engine that peers lack.</p>

<p><img src="{CHART_URLS['chart3']}" alt="TD Key Metrics" /></p>

<hr />

<h3>The Valuation: Fair Price for Quality</h3>

<p>TD is trading at roughly fair value with these considerations:</p>

<ul>
<li><strong>P/E Ratio:</strong> 11.2x vs sector 11.7x—modest discount despite quality</li>
<li><strong>P/B Ratio:</strong> 1.88x reflects premium franchise value</li>
<li><strong>Dividend Yield:</strong> 3.32% vs sector 4.62%—lower but safer</li>
<li><strong>ROE:</strong> 16.9% shows quality earnings generation</li>
</ul>

<p>The market prices TD as a quality bank worth a slight premium to book value.</p>

<p><img src="{CHART_URLS['chart4']}" alt="TD Valuation Metrics" /></p>

<hr />

<h3>Historical Context: Multiple Expansion Potential</h3>

<p>Canadian banks have historically traded at 12-15x P/E in normal markets. TD at 11.2x leaves room for upside:</p>

<ul>
<li>Historical Canadian bank average: 12-13x P/E</li>
<li>Current TD multiple: 11.2x</li>
<li>Potential for 7% multiple expansion (11.2x → 12x)</li>
</ul>

<p>This is fair valuation with modest upside potential rather than deep value.</p>

<p><img src="{CHART_URLS['chart6']}" alt="TD Historical Performance" /></p>

<hr />

<h3>The Math: Fair Value Scenarios</h3>

<p>Current price: $129.16 | EPS: $11.53</p>

<table>
<thead>
<tr><th>Scenario</th><th>P/E Multiple</th><th>Target Price</th><th>Upside</th></tr>
</thead>
<tbody>
<tr><td>Downside</td><td>9x</td><td>$104</td><td>-19%</td></tr>
<tr><td><strong>Current</strong></td><td><strong>11.2x</strong></td><td><strong>$129</strong></td><td><strong>-/-</strong></td></tr>
<tr><td>Fair Value</td><td>12x</td><td>$138</td><td>+7%</td></tr>
<tr><td>Historical</td><td>13x</td><td>$150</td><td>+16%</td></tr>
</tbody>
</table>

<p><strong>Downside Risk:</strong> If Canadian housing market crashes or recession hits, banks could trade down to 9x P/E (-19%).</p>

<p><strong>Upside:</strong> Multiple expansion to 12-13x offers 7-16% capital appreciation plus 3.3% dividend yield = 10-20% total return potential.</p>

<p><img src="{CHART_URLS['chart5']}" alt="TD Valuation Scorecard" /></p>

<hr />

<h3>The Dividend: Reliable Income</h3>

<p>TD offers a solid dividend with growth potential:</p>

<ul>
<li><strong>Annual Dividend:</strong> $4.20/share</li>
<li><strong>Yield:</strong> 3.32%</li>
<li><strong>Consecutive Years:</strong> 20+ years of dividend increases</li>
<li><strong>Payout Ratio:</strong> ~36% (safe and sustainable)</li>
</ul>

<p>While the 3.32% yield is modest versus some peers, the conservative payout ratio means the dividend is very safe and has room to grow.</p>

<p><img src="{CHART_URLS['chart2']}" alt="TD Dividend Yield" /></p>

<hr />

<h3>Why TD Could Outperform</h3>

<ol>
<li><strong>U.S. Growth Differentiator:</strong> TD's U.S. retail banking provides growth that pure Canadian banks lack. While Canadian market is mature, TD has optionality south of the border.</li>
<li><strong>Rate Cuts Tailwind:</strong> Lower interest rates reduce provisions for credit losses and improve mortgage affordability. Benefits TD's massive residential mortgage portfolio.</li>
<li><strong>Multiple Expansion:</strong> If investor sentiment toward Canadian banks improves, TD's P/E could expand from 11x toward 12-13x historical average.</li>
<li><strong>Conservative Management:</strong> TD is known for prudent risk management. In any downturn, quality banks with strong balance sheets outperform.</li>
<li><strong>Dividend Growth:</strong> With only 36% payout ratio, TD has significant room to keep raising dividends even if earnings growth moderates.</li>
</ol>

<hr />

<h3>What Could Go Wrong (Bear Case)</h3>

<ol>
<li><strong>Canadian Housing Crash:</strong> TD has significant exposure to Canadian residential mortgages. A severe housing correction would hurt earnings and book value.</li>
<li><strong>Economic Recession:</strong> Higher unemployment leads to loan defaults, higher provisions for credit losses, and compressed net interest margins.</li>
<li><strong>U.S. Operations Challenges:</strong> Regulatory issues or economic weakness in the U.S. could hurt TD's growth engine.</li>
<li><strong>Multiple Compression:</strong> If investors permanently re-rate Canadian banks lower due to macro concerns, TD stays at 11x forever with no capital appreciation.</li>
</ol>

<hr />

<h3>Bottom Line: The Verdict</h3>

<p><strong>TD is fundamentally different from deep value plays trading at distressed multiples.</strong> It is a quality company trading at fair value with modest upside potential.</p>

<p><strong>For Income Investors:</strong> TD offers a 3.3% yield with growth potential. The dividend is safer than higher-yielding but riskier alternatives. Total return potential of 8-12% annually.</p>

<p><strong>For Growth Investors:</strong> Modest 7-16% upside from multiple expansion, plus dividend = 10-20% total return potential. Not exciting, but reliable.</p>

<p><strong>For Value Investors:</strong> TD is fairly priced, not cheap. The margin of safety is in the quality of the franchise, not the valuation discount.</p>

<h4>My Take:</h4>

<p>TD is a <strong>buy-and-hold forever stock</strong> for conservative investors. You're not getting a bargain basement price, but you're getting one of Canada's highest-quality banks at a reasonable price with solid income and modest growth potential.</p>

<p><strong>Verdict:</strong> Suitable for dividend-growth portfolios and conservative investors seeking sleep-well-at-night quality. Not a speculative play—it's a core holding for long-term wealth building.</p>

<p><img src="{CHART_URLS['chart7']}" alt="TD Performance Summary" /></p>

<hr />

<h3>Key Metrics Summary</h3>

<table>
<thead>
<tr><th>Metric</th><th>Value</th><th>Context</th></tr>
</thead>
<tbody>
<tr><td>Price</td><td>$129.16</td><td>Near fair value</td></tr>
<tr><td>P/E Ratio</td><td>11.2x</td><td>4% below sector</td></tr>
<tr><td>P/B Ratio</td><td>1.88x</td><td>Reflects premium quality</td></tr>
<tr><td>Dividend Yield</td><td>3.32%</td><td>Conservative payout</td></tr>
<tr><td>Market Cap</td><td>$215B</td><td>Canada's 2nd largest</td></tr>
<tr><td>ROE</td><td>16.9%</td><td>Solid profitability</td></tr>
<tr><td>Est. Upside</td><td>$138-150</td><td>+7% to +16%</td></tr>
</tbody>
</table>

<hr />

<h3>Important Disclosures</h3>

<p><em>This analysis is for informational and educational purposes only. It does not constitute investment advice. Always conduct your own research and consult with a qualified financial advisor before making investment decisions. Data sourced from TradingView and company filings. Analysis date: February 25, 2026.</em></p>

<p><em>Author may hold positions in securities mentioned. Past performance does not guarantee future results. Investing in bank stocks involves risks including potential for capital loss.</em></p>
"""

# Write to file for reference
with open('td_post_clean.txt', 'w') as f:
    f.write(content)

print("Clean TD post content saved to td_post_clean.txt")
print("No BCE references included")
