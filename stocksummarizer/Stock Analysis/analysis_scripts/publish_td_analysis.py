"""
Upload TD charts to WordPress and create post
"""

import json
import base64
import urllib.request
import urllib.error
import mimetypes
from pathlib import Path

WP_URL = "https://stocksummarizer.com"
WP_USER = "DrewBot"
WP_APP_PASSWORD = "jMUk E2he V14t YEsw KUc3 jwOh"

OUTPUT_DIR = Path("../output/td_analysis")

def upload_media(filepath):
    url = f"{WP_URL}/wp-json/wp/v2/media"
    mime_type, _ = mimetypes.guess_type(str(filepath))
    if not mime_type:
        mime_type = "image/png"
    
    boundary = "----WordPressUploadBoundary"
    
    with open(filepath, 'rb') as f:
        file_content = f.read()
    
    body = []
    body.append(f'------{boundary}'.encode())
    body.append(f'Content-Disposition: form-data; name="file"; filename="{filepath.name}"'.encode())
    body.append(f'Content-Type: {mime_type}'.encode())
    body.append(b'')
    body.append(file_content)
    body.append(f'------{boundary}--'.encode())
    
    body = b'\r\n'.join(body)
    
    headers = {
        "Content-Type": f"multipart/form-data; boundary=----{boundary}",
        "Authorization": f"Basic {base64.b64encode(f'{WP_USER}:{WP_APP_PASSWORD}'.encode()).decode()}",
        "Content-Length": str(len(body))
    }
    
    request = urllib.request.Request(url, data=body, headers=headers, method="POST")
    
    try:
        response = urllib.request.urlopen(request)
        result = json.loads(response.read().decode())
        print(f"  {filepath.name} -> {result['source_url']}")
        return result['source_url']
    except Exception as e:
        print(f"  ERROR {filepath.name}: {e}")
        return None

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
        print(f"Error creating post: {e}")
        return None

if __name__ == "__main__":
    print("="*70)
    print("TD Bank Analysis - Upload to WordPress")
    print("="*70)
    
    # Upload all charts
    print("\nUploading charts...")
    chart_files = sorted(OUTPUT_DIR.glob("chart*.png"))
    chart_urls = {}
    
    for chart_file in chart_files:
        url = upload_media(chart_file)
        if url:
            chart_urls[chart_file.stem] = url
    
    if len(chart_urls) < 7:
        print(f"\nWARNING: Only {len(chart_urls)}/7 charts uploaded")
    
    print(f"\n{len(chart_urls)} charts uploaded successfully")
    
    # Create post content
    print("\nCreating WordPress post...")
    
    content = f"""\u003ch2\u003eTD Bank Stock Analysis: Premium Quality at Fair Value\u003c/h2\u003e

\u003cp\u003e\u003cstrong\u003eTL;DR:\u003c/strong\u003e Toronto-Dominion Bank (TD) trades at 11.2x P/E—slightly below sector average despite superior ROE and a growing dividend. This is one of Canada's "Big Six" banks with 170 years of history. Here's the complete analysis:\u003c/p\u003e

\u003chr /\u003e

\u003ch3\u003eThe Setup: Canada's Second Largest Bank\u003c/h3\u003e

\u003cp\u003eToronto-Dominion Bank (TSX: TD), commonly known as TD Bank, currently trades at \u003cstrong\u003e11.2x P/E\u003c/strong\u003e. To put that in perspective:\u003c/p\u003e

\u003cul\u003e
\u003cli\u003eSector average P/E: 11.7x (modest 4% discount)\u003c/li\u003e
\u003cli\u003eTD P/B: 1.88x vs sector 1.35x (trading at premium)\u003c/li\u003e
\u003cli\u003eTD ROE: 16.9% vs sector 19.5%\u003c/li\u003e
\u003c/ul\u003e

\u003cp\u003eTD is not dramatically undervalued like BCE, but it offers \u003cstrong\u003equal quality at fair price\u003c/strong\u003e with solid dividend income and potential for modest multiple expansion.\u003c/p\u003e

\u003cp\u003e\u003cimg src="{chart_urls.get('chart1_pe_comparison', '')}" alt="TD P/E Comparison" /\u003e\u003c/p\u003e

\u003chr /\u003e

\u003ch3\u003eThe Asset: Canada's Premier Retail Banking Franchise\u003c/h3\u003e

\u003cp\u003eBefore analyzing the price, let's understand what you actually own:\u003c/p\u003e

\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eFounded:\u003c/strong\u003e 1855 (170 years of operation)\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eMarket Cap:\u003e $215 billion (Canada's 2nd largest bank)\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eBusiness Model:\u003c/strong\u003e Three key segments:
    \u003cul\u003e
    \u003cli\u003e\u003cstrong\u003eCanadian Retail Banking:\u003c/strong\u003e Largest branch network in Canada, dominant market position\u003c/li\u003e
    \u003cli\u003e\u003cstrong\u003eU.S. Retail Banking:\u003c/strong\u003e Top 10 U.S. bank by deposits, growth engine\u003c/li\u003e
    \u003cli\u003e\u003cstrong\u003eWholesale Banking:\u003c/strong\u003e Capital markets, corporate banking, advisory\u003c/li\u003e
    \u003c/ul\u003e
\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eKey Stats:\u003c/strong\u003e
    \u003cul\u003e
    \u003cli\u003eBook Value: $68.78/share\u003c/li\u003e
    \u003cli\u003eEPS (TTM): $11.53\u003c/li\u003e
    \u003cli\u003eROE: 16.9% (strong profitability)\u003c/li\u003e
    \u003cli\u003eDebt/Equity: 2.19x\u003c/li\u003e
    \u003c/ul\u003e
\u003c/li\u003e
\u003c/ul\u003e

\u003cp\u003e\u003cstrong\u003eKey Insight:\u003c/strong\u003e TD is a high-quality bank with exposure to both Canadian stability and U.S. growth. The U.S. division has been growing significantly, making TD more than just a Canadian play.\u003c/p\u003e

\u003cp\u003e\u003cimg src="{chart_urls.get('chart3_dashboard', '')}" alt="TD Key Metrics" /\u003e\u003c/p\u003e

\u003chr /\u003e

\u003ch3\u003eThe Valuation: Fair Price for Quality\u003c/h3\u003e

\u003cp\u003eTD is not a "deep value" play like BCE. It's trading at roughly fair value with these considerations:\u003c/p\u003e

\u003col\u003e
\u003cli\u003e\u003cstrong\u003eP/E Ratio:\u003c/strong\u003e 11.2x vs sector 11.7x—slight discount\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eP/B Ratio:\u003c/strong\u003e 1.88x vs sector 1.35x—trading at premium to book\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eDividend Yield:\u003c/strong\u003e 3.32% vs sector 4.62%—lower yield than peers\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eROE:\u003c/strong\u003e 16.9% vs sector 19.5%—solid but not sector-leading\u003c/li\u003e
\u003c/ol\u003e

\u003cp\u003eThe market is pricing TD as a quality bank that's worth a slight premium—and that seems fair.\u003c/p\u003e

\u003ch4\u003eWhy the P/B Premium?\u003c/h4\u003e
\u003cp\u003eTD trades at higher price-to-book because investors value its:\u003c/p\u003e\n\u003cul\u003e
\u003cli\u003eLargest branch network in Canada\u003c/li\u003e
\u003cli\u003eGrowing U.S. presence (differentiation from pure Canadian banks)\u003c/li\u003e
\u003cli\u003eStrong brand and customer loyalty\u003c/li\u003e
\u003cli\u003eConservative risk management history\u003c/li\u003e
\u003c/ul\u003e

\u003cp\u003e\u003cimg src="{chart_urls.get('chart4_valuation_metrics', '')}" alt="TD Valuation Metrics" /\u003e\u003c/p\u003e

\u003chr /\u003e

\u003ch3\u003eHistorical Context: Multiple Expansion Potential\u003c/h3\u003e

\u003cp\u003eCanadian banks have historically traded at 12-15x P/E in normal markets. TD at 11.2x leaves room for upside:&lt;/p\u003e

\u003cul\u003e
\u003cli\u003eHistorical Canadian bank average: 12x P/E\u003c/li\u003e
\u003cli\u003eCurrent TD multiple: 11.2x\u003c/li\u003e
\u003cli\u003ePotential for 7% multiple expansion (11.2x → 12x)\u003c/li\u003e
\u003c/ul\u003e

\u003cp\u003eThis isn't compression like BCE—it's \u003cstrong\u003efair valuation with modest upside\u003c/strong\u003e.\u003c/p\u003e

\u003cp\u003e\u003cimg src="{chart_urls.get('chart6_historical_performance', '')}" alt="TD Historical Performance" /\u003e\u003c/p\u003e

\u003chr /\u003e

\u003ch3\u003eThe Math: Fair Value Scenarios\u003c/h3\u003e

\u003cp\u003eCurrent price: $129.16 | EPS: $11.53\u003c/p\u003e

\u003ctable\u003e
\u003cthead\u003e
\u003ctr\u003e\u003cth\u003eScenario\u003c/th\u003e\u003cth\u003eP/E Multiple\u003c/th\u003e\u003cth\u003eTarget Price\u003c/th\u003e\u003cth\u003eUpside\u003c/th\u003e\u003c/tr\u003e
\u003c/thead\u003e
\u003ctbody\u003e
\u003ctr\u003e\u003ctd\u003eDownside\u003c/td\u003e\u003ctd\u003e9x\u003c/td\u003e\u003ctd\u003e$104\u003c/td\u003e\u003ctd\u003e-19%\u003c/td\u003e\u003c/tr\u003e
\u003ctr\u003e\u003ctd\u003e\u003cstrong\u003eCurrent\u003c/strong\u003e\u003c/td\u003e\u003ctd\u003e\u003cstrong\u003e11.2x\u003c/strong\u003e\u003c/td\u003e\u003ctd\u003e\u003cstrong\u003e$129\u003c/strong\u003e\u003c/td\u003e\u003ctd\u003e\u003cstrong\u003e-\\/\\-\u003c/strong\u003e\u003c/td\u003e\u003c/tr\u003e
\u003ctr\u003e\u003ctd\u003eFair Value\u003c/td\u003e\u003ctd\u003e12x\u003c/td\u003e\u003ctd\u003e$138\u003c/td\u003e\u003ctd\u003e+7%\u003c/td\u003e\u003c/tr\u003e
\u003ctr\u003e\u003ctd\u003eHistorical\u003c/td\u003e\u003ctd\u003e13x\u003c/td\u003e\u003ctd\u003e$150\u003c/td\u003e\u003ctd\u003e+16%\u003c/td\u003e\u003c/tr\u003e
\u003c/tbody\u003e
\u003c/table\u003e

\u003cp\u003e\u003cstrong\u003eDownside Risk:\u003c/strong\u003e If Canadian housing market crashes or credit losses spike, banks could trade down to 9x P/E (-19%).\u003c/p\u003e

\u003cp\u003e\u003cstrong\u003eUpside:\u003c/strong\u003e Multiple expansion to 12-13x P/E offers 7-16% capital appreciation PLUS 3.3% dividend = 10-20% total return potential.\u003c/p\u003e

\u003cp\u003e\u003cimg src="{chart_urls.get('chart5_valuation_scorecard', '')}" alt="TD Valuation Scorecard" /\u003e\u003c/p\u003e

\u003chr /\u003e

\u003ch3\u003eThe Dividend: Reliable Income\u003c/h3\u003e

\u003cp\u003eTD offers a solid dividend that has grown consistently:\u003c/p\u003e

\u003cul\u003e
\u003cli\u003e\u003cstrong\u003eAnnual Dividend:\u003c/strong\u003e $4.20/share\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eYield:\u003c/strong\u003e 3.32%\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eConsecutive Years:\u003c/strong\u003e 20+ years of dividend increases\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003ePayout Ratio:\u003c/strong\u003e ~36% (safe and sustainable)\u003c/li\u003e
\u003c/ul\u003e

\u003cp\u003eWhile the 3.32% yield is lower than some peers, the payout ratio is conservative—meaning the dividend is very safe and has room to grow.\u003c/p\u003e

\u003cp\u003e\u003cimg src="{chart_urls.get('chart2_dividend_yield', '')}" alt="TD Dividend Yield" /\u003e\u003c/p\u003e

\u003chr /\u003e

\u003ch3\u003eWhy TD Could Outperform\u003c/h3\u003e

\u003col\u003e
\u003cli\u003e\u003cstrong\u003eU.S. Growth:\u003c/strong\u003e TD's U.S. retail banking is a differentiator. While pure Canadian banks face a mature market, TD has growth optionality south of the border.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eRate Cuts:\u003c/strong\u003e Lower rates reduce provisions for credit losses and improve mortgage affordability. This benefits TD's massive Canadian residential mortgage portfolio.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eMultiple Expansion:\u003c/strong\u003e If investor sentiment toward Canadian banks improves, TD could see its P/E expand from 11x toward 12-13x historical norm.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eConservative Management:\u003c/strong\u003e TD is known for prudent risk management. In a downturn, quality banks outperform.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eDividend Growth:\u003c/strong\u003e With only 36% payout ratio, TD has room to keep raising dividends even if earnings growth slows.\u003c/li\u003e
\u003c/ol\u003e

\u003chr /\u003e

\u003ch3\u003eWhat Could Go Wrong\u003c/h3\u003e

\u003col\u003e
\u003cli\u003e\u003cstrong\u003eCanadian Housing Crash:\u003c/strong\u003e TD has significant exposure to Canadian residential mortgages. A severe housing correction would hurt.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eRecession:\u003c/strong\u003e Higher unemployment leads to loan defaults and higher provisions for credit losses.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eU.S. Operations:\u003c/strong\u003e Regulatory issues or economic weakness in the U.S. could hurt TD's growth engine.\u003c/li\u003e
\u003cli\u003e\u003cstrong\u003eMultiple Compression:\u003c/strong\u003e If investors permanently re-rate Canadian banks lower, TD stays at 11x forever (no capital appreciation).\u003c/li\u003e
\u003c/ol\u003e

\u003chr /\u003e

\u003ch3\u003eBottom Line: The Verdict\u003c/h3\u003e

\u003cp\u003e\u003cstrong\u003eTD is not a deep value play like BCE.\u003c/strong\u003e It's a quality company trading at fair value with modest upside potential.\u003c/p\u003e

\u003ctable\u003e
\u003cthead\u003e
\u003ctr\u003e\u003cth\u003eStock\u003c/th\u003e\u003cth\u003eP/E\u003c/th\u003e\u003cth\u003eUpside to Fair\u003c/th\u003e\u003cth\u003eThesis\u003c/th\u003e\u003c/tr\u003e
\u003c/thead\u003e
\u003ctbody\u003e
\u003ctr\u003e\u003ctd\u003eBCE\u003c/td\u003e\u003ctd\u003e5.3x\u003c/td\u003e\u003ctd\u003e+88%\u003c/td\u003e\u003ctd\u003eDeep Value\u003c/td\u003e\u003c/tr\u003e
\u003ctr\u003e\u003ctd\u003eTD\u003c/td\u003e\u003ctd\u003e11.2x\u003c/td\u003e\u003ctd\u003e+7-16%\u003c/td\u003e\u003ctd\u003eQuality at Fair Price\u003c/td\u003e
\u003c/tbody\u003e
\u003c/table\u003e

\u003cp\u003e\u003cstrong\u003eFor Income Investors:\u003c/strong\u003e TD offers a 3.3% yield with growth potential. The dividend is safer than higher-yielding but riskier alternatives.\u003c/p\u003e

\u003cp\u003e\u003cstrong\u003eFor Growth Investors:\u003c/strong\u003e Modest 7-16% upside from multiple expansion, plus dividend = 10-20% total return. Not exciting, but reliable.\u003c/p\u003e

\u003cp\u003e\u003cstrong\u003eFor Value Investors:\u003c/strong\u003e TD is fairly priced, not cheap. If you want deep value, look elsewhere (like BCE at 5.3x P/E).\u003c/p\u003e

\u003ch4\u003eMy Take:\u003c/h4\u003e

\u003cp\u003eTD is a \u003cstrong\u003ebuy-and-hold forever stock\u003c/strong\u003e for conservative investors. You're not getting a bargain, but you're getting quality at a fair price with solid income and modest growth.\u003c/p\u003e

\u003cp\u003e\u003cstrong\u003eVerdict:\u003c/strong\u003e Suitable for dividend-growth portfolios and conservative investors. Not a speculative play—it's a sleep-well-at-night bank stock.\u003c/p\u003e

\u003cp\u003e\u003cimg src="{chart_urls.get('chart7_performance_summary', '')}" alt="TD Performance Summary" /\u003e\u003c/p\u003e

\u003chr /\u003e

\u003ch3\u003eKey Metrics Summary\u003c/h3\u003e

\u003ctable\u003e
\u003cthead\u003e
\u003ctr\u003e\u003cth\u003eMetric\u003c/th\u003e\u003cth\u003eValue\u003c/th\u003e\u003cth\u003eContext\u003c/th\u003e\u003c/tr\u003e
\u003c/thead\u003e
\u003ctbody\u003e
\u003ctr\u003e\u003ctd\u003ePrice\u003c/td\u003e\u003ctd\u003e$129.16\u003c/td\u003e\u003ctd\u003eNear fair value\u003c/td\u003e\u003c/tr\u003e
\u003ctr\u003e\u003ctd\u003eP/E Ratio\u003c/td\u003e\u003ctd\u003e11.2x\u003c/td\u003e\u003ctd\u003e4% below sector\u003c/td\u003e\u003c/tr\u003e
\u003ctr\u003e\u003ctd\u003eP/B Ratio\u003c/td\u003e\u003ctd\u003e1.88x\u003c/td\u003e\u003ctd\u003ePremium to sector\u003c/td\u003e\u003c/tr\u003e
\u003ctr\u003e\u003ctd\u003eDividend Yield\u003c/td\u003e\u003ctd\u003e3.32%\u003c/td\u003e\u003ctd\u003eLower than peers\u003c/td\u003e\u003c/tr\u003e
\u003ctr\u003e\u003ctd\u003eMarket Cap\u003c/td\u003e\u003ctd\u003e$215B\u003c/td\u003e\u003ctd\u003eCanada's 2nd largest\u003c/td\u003e\u003c/tr\u003e
\u003ctr\u003e\u003ctd\u003eROE\u003c/td\u003e\u003ctd\u003e16.9%\u003c/td\u003e\u003ctd\u003eStrong profitability\u003c/td\u003e\u003c/tr\u003e
\u003ctr\u003e\u003ctd\u003eEst. Upside\u003c/td\u003e\u003ctd\u003e$138-150\u003c/td\u003e\u003ctd\u003e+7% to +16%\u003c/td\u003e\u003c/tr\u003e
\u003c/tbody\u003e
\u003c/table\u003e

\u003chr /\u003e

\u003ch3\u003eImportant Disclosures\u003c/h3\u003e

\u003cp\u003e\u003cem\u003eThis analysis is for informational and educational purposes only. It does not constitute investment advice. Always conduct your own research and consult with a qualified financial advisor before making investment decisions. Data sourced from TradingView and company filings. Analysis date: February 25, 2026.\u003c/em\u003e\u003c/p\u003e

\u003cp\u003e\u003cem\u003eAuthor may hold positions in securities mentioned. Past performance does not guarantee future results. Investing in bank stocks involves risks including potential for capital loss.\u003c/em\u003e\u003c/p\u003e
"""
    
    # Create post
    print("Publishing post...")
    title = "TD Bank Stock Analysis: Premium Quality at Fair Value"
    result = create_post(title, content, status="publish")
    
    if result:
        print("\n" + "="*70)
        print("SUCCESS - TD Analysis Published!")
        print(f"URL: {result['link']}")
        print("="*70)
    else:
        print("\nFailed to create post")
