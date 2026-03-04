"""
Create CSU WordPress post
"""

import json
import base64
import urllib.request

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

# Chart URLs from WordPress
CHART_URLS = {
    'chart1': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart1_pe_comparison-1.png',
    'chart2': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart2_growth_metrics-1.png',
    'chart3': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart3_dashboard-1.png',
    'chart4': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart4_valuation_analysis-1.png',
    'chart5': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart5_growth_scorecard-1.png',
    'chart6': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart6_historical_performance-1.png',
    'chart7': 'https://stocksummarizer.com/wp-content/uploads/2026/02/chart7_performance_summary-1.png'
}

def create_post(title, content, status="publish"):
    url = f"{WP_URL}/wp-json/wp/v2/posts"
    
    data = {
        "title": title,
        "content": content,
        "status": status
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Basic {base64.b64encode(f'{WP_USER}:{WP_APP_PASSWORD}'.encode()).decode()}"
    }
    
    request = urllib.request.Request(
        url,
        data=json.dumps(data).encode(),
        headers=headers,
        method="POST"
    )
    
    try:
        response = urllib.request.urlopen(request)
        result = json.loads(response.read().decode())
        return result
    except Exception as e:
        print(f"Error: {e}")
        return None

content = f"""<h2>Constellation Software Stock Analysis: Premium Growth or Overvalued? - February 26, 2026</h2>

<p><strong>TL;DR:</strong> Constellation Software (CSU) trades at 55.8x P/E, nearly 2.5x the tech sector average. Revenue growing 18% with 22% ROE. This is a compounder that's priced for perfection. Here's the full analysis.</p>

<hr />

<h3>The Setup: The Canadian Software Compounder</h3>

<p>Constellation Software (TSX: CSU) currently trades at <strong>$2,454 per share with a 55.8x P/E</strong>. To put that in perspective:</p>

<ul>
<li>Tech sector average P/E: 23.9x</li>
<li>CSU P/E: 55.8x (133% premium)</li>
<li>Current market cap: $53.3 billion</li>
</ul>

<p>The core question: <strong>Is 18% revenue growth worth paying 2.5x the sector multiple?</strong></p>

<p><img src="{CHART_URLS['chart1']}" alt="CSU P/E Comparison" /></p>

<hr />

<h3>The Asset: The Acquisition Machine</h3>

<p>Before analyzing the price, let's understand what you actually own:</p>

<ul>
<li><strong>Founded:</strong> 1995 by Mark Leonard (30 years in operation)</li>
<li><strong>Market Cap:</strong> $53.3 billion</li>
<li><strong>Business Model:</strong> Acquires smaller vertical market software (VMS) companies
    \u003cul\u003e
    \u003cli\u003eOver \u003cstrong\u003e150 acquisitions\u003c/strong\u003e since inception\u003c/li\u003e
    \u003cli\u003eFocuses on niche software markets\u003c/li\u003e
    \u003cli\u003eDecentralized operating model\u003c/li\u003e
    \u003cli\u003eRecurring revenue base\u003c/li\u003e
    \u003c/ul\u003e\n\u003c/li\u003e\n\u003cli\u003e\u003cstrong\u003eKey Stats:\u003c/strong\u003e
    \u003cul\u003e
    \u003cli\u003eRevenue: $15.6 billion (TTM)\u003c/li\u003e
    \u003cli\u003eRevenue growth: 18.2%\u003c/li\u003e
    \u003cli\u003eEPS: $43.96\u003c/li\u003e
    \u003cli\u003eROE: 22.1%\u003c/li\u003e
    \u003cli\u003eP/B: 10.78x\u003c/li\u003e
    \u003cli\u003eDividend yield: 0.23% (minimal)\u003c/li\u003e
    \u003c/ul\u003e\n\u003c/li\u003e\n\u003c/ul\u003e\n
\u003cp\u003e\u003cimg src="{CHART_URLS['chart3']}" alt="CSU Key Metrics" /\u003e\u003c/p\u003e\n
\u003chr /\u003e\n
\u003ch3\u003eThe Valuation: Priced for Perfection\u003c/h3\u003e\n
\u003cp\u003eAt 55.8x P/E, CSU is trading at a massive premium:\u003c/p\u003e\n\n\u003cul\u003e\n\u003cli\u003e\u003cstrong\u003eP/E Ratio:\u003c/strong\u003e 55.8x vs sector 23.9x (133% premium)\u003c/li\u003e\n\u003cli\u003e\u003cstrong\u003eP/B Ratio:\u003c/strong\u003e 10.78x vs sector 5.57x (94% premium)\u003c/li\u003e\n\u003cli\u003e\u003cstrong\u003eROE:\u003c/strong\u003e 22.1% vs sector 43.1% (lower than average)\u003c/li\u003e\n\u003cli\u003e\u003cstrong\u003eRevenue Growth:\u003c/strong\u003e 18.2% vs sector 8% (2.3x faster growth)\u003c/li\u003e\n\u003c/ul\u003e\n\n\u003cp\u003eThe premium is justified by growth, but 55x P/E leaves almost no room for disappointment.\u003c/p\u003e\n\n\u003cp\u003e\u003cimg src="{CHART_URLS['chart2']}" alt="CSU Growth Metrics" /\u003e\u003c/p\u003e\n\n\u003chr /\u003e\n\n\u003ch3\u003eHistorical Context: The Compound Returns\u003c/h3\u003e\n
\u003cp\u003eCSU has been one of Canada's best-performing stocks over the past decade:\u003c/p\u003e\n\n\u003cul\u003e\n\u003cli\u003e10-year return: Over 1,300%\u003c/li\u003e\n\u003cli\u003eStock has split multiple times\u003c/li\u003e\n\u003cli\u003eMultiple expansion drove much of the gains\u003c/li\u003e\n\u003cli\u003eOriginal shareholders have life-changing returns\u003c/li\u003e\n\u003c/ul\u003e\n\n\u003cp\u003eThe challenge: Past returns don't guarantee future results.\u003c/p\u003e\n\n\u003cp\u003e\u003cimg src="{CHART_URLS['chart4']}" alt="CSU Valuation Analysis" /\u003e\u003c/p\u003e\n\n\u003chr /\u003e\n\u003ch3\u003eThe Math: Growth Required to Justify Price\u003c/h3\u003e\n
\u003cp\u003eCurrent EPS: $43.96 | Price: $2,454\u003c/p\u003e\n\n\u003ctable\u003e\n\u003cthead\u003e\n\u003ctr\u003e\u003cth\u003eGrowth Rate\u003c/th\u003e\u003cth\u003eFuture EPS\u003c/th\u003e\u003cth\u003eAt 40x P/E\u003c/th\u003e\u003cth\u003eUpside\u003c/th\u003e\u003c/tr\u003e\n\u003c/thead\u003e\n\u003ctbody\u003e\n\u003ctr\u003e\u003ctd\u003e10%\u003c/td\u003e\u003ctd\u003e$48.36\u003c/td\u003e\u003ctd\u003e$1,934\u003c/td\u003e\u003ctd\u003e-21%\u003c/td\u003e\u003c/tr\u003e\n\u003ctr\u003e\u003ctd\u003e15%\u003c/td\u003e\u003ctd\u003e$50.56\u003c/td\u003e\u003ctd\u003e$2,022\u003c/td\u003e\u003ctd\u003e-18%\u003c/td\u003e\u003c/tr\u003e\n\u003ctr\u003e\u003ctd\u003e20%\u003c/td\u003e\u003ctd\u003e$52.75\u003c/td\u003e\u003ctd\u003e$2,110\u003c/td\u003e\u003ctd\u003e-14%\u003c/td\u003e\u003c/tr\u003e\n\u003ctr\u003e\u003ctd\u003e25%\u003c/td\u003e\u003ctd\u003e$54.95\u003c/td\u003e\u003ctd\u003e$2,198\u003c/td\u003e\u003ctd\u003e-10%\u003c/td\u003e\u003c/tr\u003e\n\u003c/tbody\u003e\n\u003c/table\u003e\n\n\u003cp\u003e\u003cstrong\u003eThe Reality:\u003c/strong\u003e Even with 25% EPS growth, multiple compression to 40x P/E would result in -10% downside. The stock is priced for sustained 30%+ EPS growth combined with a maintained 55x multiple.\u003c/p\u003e\n\n\u003cp\u003e\u003cimg src="{CHART_URLS['chart5']}" alt="CSU Growth Scorecard" /\u003e\u003c/p\u003e\n\n\u003chr /\u003e\n\u003ch3\u003eWhy It Could Work (Bull Case)\u003c/h3\u003e\n\n\u003col\u003e\n\u003cli\u003e\u003cstrong\u003eAcquisition Pipeline:\u003c/strong\u003e Thousands of potential VMS acquisition targets exist. CSU's playbook is proven.\u003c/li\u003e\n\u003cli\u003e\u003cstrong\u003eRecurring Revenue:\u003c/strong\u003e Vertical market software customers rarely switch. Stickiness creates predictable cash flows.\u003c/li\u003e\n\u003cli\u003e\u003cstrong\u003eDecentralized Model:\u003c/strong\u003e Minimal central overhead. Acquired companies keep autonomy. Better than typical conglomerate approach.\u003c/li\u003e\n\u003cli\u003e\u003cstrong\u003eMark Leonard:\u003c/strong\u003e Founder-CEO with 30 years of execution. Still actively involved. Proven capital allocator.\u003c/li\u003e\n\u003cli\u003e\u003cstrong\u003eGrowth Runway:\u003c/strong\u003e International expansion just beginning. European markets underpenetrated.\u003c/li\u003e\n\u003c/ol\u003e\n\n\u003chr /\u003e\n\u003ch3\u003eWhat Could Go Wrong (Bear Case)\u003c/h3\u003e\n\n\u003col\u003e\n\u003cli\u003e\u003cstrong\u003eAcquisition Exhaustion:\u003c/strong\u003e Good deals become scarce. Competition for VMS companies increases. Prices paid escalate.\u003c/li\u003e\n\u003cli\u003e\u003cstrong\u003eMultiple Compression:\u003c/strong\u003e Any growth disappointment triggers massive P/E contraction. 55x multiple has 50% downside to 25-30x.\u003c/li\u003e\n\u003cli\u003e\u003cstrong\u003eSize Challenge:\u003c/strong\u003e At $53B market cap, smaller acquisitions barely move needle. Need $5B+ deals for material impact.\u003c/li\u003e\n\u003cli\u003e\u003cstrong\u003eManagement Transition:\u003c/strong\u003e Mark Leonard won't run company forever. Culture could change.\u003c/li\u003e\n\u003cli\u003e\u003cstrong\u003eMacro Risk:\u003c/strong\u003e Recession crushes growth stock multiples regardless of business quality.\u003c/li\u003e\n\u003c/ol\u003e\n\n\u003c!-- SECTION 10: CONCLUSION --\u003e\n\u003ch3\u003eBottom Line: The Verdict\u003c/h3\u003e\n\n\u003cp\u003e\u003cstrong\u003eCSU is a great business trading at a dangerous price.\u003c/strong\u003e\u003c/p\u003e\n\n\u003cp\u003e\u003cstrong\u003eFor Growth Investors:\u003c/strong\u003e The 18% revenue growth is attractive, but 55x P/E requires perfection. Better opportunities likely exist elsewhere.\u003c/p\u003e\n\n\u003cp\u003e\u003cstrong\u003eFor Value Investors:\u003c/strong\u003e Stay away. This is the opposite of value investing. Paying 133% premium to sector for growth already priced in.\u003c/p\u003e\n\n\u003cp\u003e\u003cstrong\u003eFor Momentum Investors:\u003c/strong\u003e The trend is your friend until it isn't. Works until growth slows.\u003c/p\u003e\n\n\u003ch4\u003eMy Take:\u003c/h4\u003e\n\n\u003cp\u003eCSU is a compounder priced as a hypergrowth stock. The business is high quality, but the valuation assumes flawless execution forever. At 55x P/E, one earnings miss could trigger 30-40% decline.\u003c/p\u003e\n\n\u003cp\u003e\u003cstrong\u003eVerdict:\u003c/strong\u003e Wait for a better entry. Worth buying at 30-35x P/E (~$1,300-1,500) after a correction. Until then, the asymmetric risk/reward favors patience.\u003c/p\u003e\n\n\u003cp\u003e\u003cimg src="{CHART_URLS['chart7']}" alt="CSU Performance Summary" /\u003e\u003c/p\u003e\n\n\u003chr /\u003e\n\n\u003ch3\u003eKey Metrics Summary\u003c/h3\u003e\n\n\u003ctable\u003e\n\u003cthead\u003e\n\u003ctr\u003e\u003cth\u003eMetric\u003c/th\u003e\u003cth\u003eValue\u003c/th\u003e\u003cth\u003eContext\u003c/th\u003e\u003c/tr\u003e\n\u003c/thead\u003e\n\u003ctbody\u003e\n\u003ctr\u003e\u003ctd\u003ePrice\u003c/td\u003e\u003ctd\u003e$2,454\u003c/td\u003e\u003ctd\u003eHigh multiple\u003c/td\u003e\u003c/tr\u003e\n\u003ctr\u003e\u003ctd\u003eP/E Ratio\u003c/td\u003e\u003ctd\u003e55.8x\u003c/td\u003e\u003ctd\u003e133% above sector\u003c/td\u003e\u003c/tr\u003e\n\u003ctr\u003e\u003ctd\u003eMarket Cap\u003c/td\u003e\u003ctd\u003e$53.3B\u003c/td\u003e\u003ctd\u003eLarge cap\u003c/td\u003e\u003c/tr\u003e\n\u003ctr\u003e\u003ctd\u003eRevenue Growth\u003c/td\u003e\u003ctd\u003e18.2%\u003c/td\u003e\u003ctd\u003eStrong growth\u003c/td\u003e\u003c/tr\u003e\n\u003ctr\u003e\u003ctd\u003eROE\u003c/td\u003e\u003ctd\u003e22.1%\u003c/td\u003e\u003ctd\u003eQuality returns\u003c/td\u003e\u003c/tr\u003e\n\u003ctr\u003e\u003ctd\u003eEst. Fair Value\u003c/td\u003e\u003ctd\u003e$1,300-1,500\u003c/td\u003e\u003ctd\u003e30-35x P/E\u003c/td\u003e\u003c/tr\u003e\n\u003c/tbody\u003e\n\u003c/table\u003e\n\n\u003chr /\u003e\n\n\u003ch3\u003eImportant Disclosures\u003c/h3\u003e\n\n\u003cp\u003e\u003cem\u003eThis analysis is for informational and educational purposes only. It does not constitute investment advice. Always conduct your own research and consult with a qualified financial advisor before making investment decisions. Data sourced from TradingView and company filings. Analysis date: February 26, 2026.\u003c/em\u003e\u003c/p\u003e\n\n\u003cp\u003e\u003cem\u003eAuthor may hold positions in securities mentioned. Past performance does not guarantee future results. Investing in growth stocks involves risks including potential for significant capital loss.\u003c/em\u003e\u003c/p\u003e\n"""

print("="*70)
print("Publishing CSU Analysis to WordPress")
print("="*70)

title = "Constellation Software (CSU) Analysis: Premium Growth at a Precarious Price"
result = create_post(title, content, status="publish")

if result:
    print("\n" + "="*70)
    print("SUCCESS - CSU Analysis Published!")
    print(f"URL: {result['link']}")
    print("="*70)
else:
    print("\nFailed to publish post")
