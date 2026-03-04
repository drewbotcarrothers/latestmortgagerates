"""
CSU (Constellation Software) YouTube Video Script Generator
15-minute educational video format
"""

import json
from pathlib import Path

OUTPUT_DIR = Path('../output/csu_analysis')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("="*70)
print("CSU YOUTUBE VIDEO SCRIPT GENERATOR")
print("="*70)

# CSU Data
csu_data = {
    'name': 'Constellation Software',
    'ticker': 'CSU',
    'price': 2454.25,
    'pe': 55.83,
    'pb': 10.78,
    'market_cap': 53.3,
    'revenue_growth': 18.2,
    'roe': 22.1,
    'eps': 43.96,
    'dividend_yield': 0.23,
    'sector_pe': 23.93,
    'sector': 'Technology Services'
}

print(f"\nGenerating script for {csu_data['name']} ({csu_data['ticker']})")
print(f"Price: ${csu_data['price']:,.0f} | P/E: {csu_data['pe']:.1f}x")

# Video structure (15 minutes total)
slides = [
    {
        'slide_num': 1,
        'section': 'HOOK',
        'time': '0:00',
        'title': 'Hook: The Canadian Compounder',
        'visual': 'CSU Stock Chart showing massive 1,300% 10-year gains',
        'voiceover': f"What if I told you there's a Canadian stock that turned every $10,000 into over $140,000 in the past decade? A company that's made 150 acquisitions since 1995, growing revenue at 18% annually with 22% returns on equity. Sounds amazing, right? Well, here's the catch: Constellation Software currently trades at {csu_data['pe']:.1f} times earnings. That's nearly {csu_data['pe']/csu_data['sector_pe']:.0f}x the tech sector average. The question is: Is this growth stock a buy at these prices, or are we looking at a value trap disguised as a compounder? Let's break it down.",
        'duration_seconds': 30
    },
    {
        'slide_num': 2,
        'section': 'INTRO',
        'time': '0:30',
        'title': 'The Setup',
        'visual': 'CSU Key Metrics Dashboard',
        'voiceover': f"Constellation Software, ticker CSU on the TSX, currently trades at ${csu_data['price']:,.0f} per share with a market cap of ${csu_data['market_cap']:.1f} billion. The stock commands a {csu_data['pe']:.1f}x price-to-earnings multiple, which puts it at a massive premium to the tech sector average of {csu_data['sector_pe']:.1f}x. Revenue is growing at {csu_data['revenue_growth']:.1f}% annually, and the company generates an impressive {csu_data['roe']:.1f}% return on equity. But here's what matters: At these valuations, the market expects perfection. One earnings miss, and this stock could drop 30 to 40 percent overnight.",
        'duration_seconds': 35
    },
    {
        'slide_num': 3,
        'section': 'BUSINESS',
        'time': '1:05',
        'title': 'The Business Model',
        'visual': 'Diagram: Acquisition Strategy',
        'voiceover': "So what exactly does Constellation Software do? Founded in 1995 by Mark Leonard, CSU acquires smaller vertical market software companies. Think of it as a holding company for niche software businesses. These are companies that provide specialized software to specific industries - things like software for bowling alleys, yoga studios, or funeral homes. The beauty of this model? These customers rarely switch vendors. The software becomes embedded in their operations. CSU has completed over 150 acquisitions since inception, and they leave these companies largely autonomous. It's a decentralized operating model that works extremely well.",
        'duration_seconds': 40
    },
    {
        'slide_num': 4,
        'section': 'GROWTH',
        'time': '1:45',
        'title': 'Growth Metrics',
        'visual': 'CSU vs Tech Sector Growth Comparison',
        'voiceover': f"Let's talk numbers. CSU's revenue is growing at {csu_data['revenue_growth']:.1f}% annually. That's more than double the tech sector average of around 8%. The company generates ${csu_data['eps']:.2f} in earnings per share, giving it that {csu_data['pe']:.1f}x P/E multiple. Return on equity is {csu_data['roe']:.1f}%, which is excellent. The dividend yield is just {csu_data['dividend_yield']:.2f}% - this is a growth stock, not an income play. And the price-to-book ratio? {csu_data['pb']:.1f}x. These are premium valuation metrics across the board.",
        'duration_seconds': 35
    },
    {
        'slide_num': 5,
        'section': 'VALUATION',
        'time': '2:20',
        'title': 'Valuation Analysis',
        'visual': 'P/E Premium Analysis Chart',
        'voiceover': f"Now for the valuation reality check. At {csu_data['pe']:.1f}x P/E, CSU trades at a 133% premium to the tech sector average. That's massive. A 133% premium means you're paying more than double the sector multiple for this growth. Is it justified? Well, {csu_data['revenue_growth']:.1f}% revenue growth is impressive, but here's the math problem: To justify a {csu_data['pe']:.0f}x P/E without multiple compression, CSU needs to sustain 25% or higher earnings growth indefinitely. That's a very high bar. Any slowdown, and the multiple compresses - meaning the stock drops even if earnings grow.",
        'duration_seconds': 40
    },
    {
        'slide_num': 6,
        'section': 'MATH',
        'time': '3:00',
        'title': 'The Math: What Growth Is Priced In?',
        'visual': 'Upside/Downside Scenarios Table',
        'voiceover': f"Let's run the numbers. Current EPS is ${csu_data['eps']:.2f}, price is ${csu_data['price']:,.0f}. If earnings grow 10% next year to $48, and the market assigns a more reasonable 40x P/E, the stock would be worth $1,934. That's a 21% decline from here. Even with spectacular 25% earnings growth to $55 per share, at 40x P/E you get $2,198 - still a 10% loss. The market has priced in sustained 30% earnings growth at a maintained {csu_data['pe']:.0f}x multiple. Both of those assumptions need to hold for you to make money from here. That's asking a lot.",
        'duration_seconds': 45
    },
    {
        'slide_num': 7,
        'section': 'BULL_CASE',
        'time': '3:45',
        'title': 'Bull Case: Why It Could Work',
        'visual': '5-Point Bull Case',
        'voiceover': "But it's not all doom and gloom. The bull case is compelling. First, the acquisition pipeline is virtually unlimited. There are thousands of vertical market software companies globally. Second, the decentralized model works. Acquired companies keep their culture and management. Third, recurring revenue provides stability. These customers are sticky. Fourth, Mark Leonard is a proven operator. He's built this for 30 years and is still actively involved. Fifth, international expansion is just starting. European markets are underpenetrated. There's real growth runway here.",
        'duration_seconds': 40
    },
    {
        'slide_num': 8,
        'section': 'BEAR_CASE',
        'time': '4:25',
        'title': 'Bear Case: What Could Go Wrong',
        'visual': '5-Point Bear Case',
        'voiceover': "Now the bear case. First, acquisition exhaustion. Good deals are harder to find as you get bigger, and competition is increasing. Second, multiple compression risk. Any growth disappointment triggers a massive P/E reset. A drop from 55x to 35x is a 36% decline even with flat earnings. Third, the size challenge. At $53 billion market cap, small acquisitions don't move the needle anymore. You need billion-dollar deals for material impact. Fourth, succession risk. Mark Leonard won't run this forever, and the culture could change. Fifth, macro risk. In a recession, growth stock multiples compress regardless of business quality.",
        'duration_seconds': 45
    },
    {
        'slide_num': 9,
        'section': 'COMPARISON',
        'time': '5:10',
        'title': 'Market Position',
        'visual': 'CSU vs Top Tech Peers Comparison',
        'voiceover': "Let's put CSU in context. Among Canadian tech stocks, it's one of the largest by market cap. But look at the peers - most trade at 20-40x earnings, not 55x. CSU's premium reflects its track record, but it also means expectations are sky-high. The company has been one of Canada's best performers for years, but past returns don't predict future results. What matters now is whether they can continue executing at a level that justifies this premium.",
        'duration_seconds': 35
    },
    {
        'slide_num': 10,
        'section': 'RISKS',
        'time': '5:45',
        'title': 'Key Risks Summary',
        'visual': 'Risk Matrix',
        'voiceover': "The key risks are asymmetric. If growth continues at 20% plus, you might make 10 to 15% annually as the multiple compresses slightly but earnings grow. But if growth slows to 10% or less, you could lose 30 to 40% quickly as the multiple resets. That's not a great risk-reward ratio. You're paying a massive premium for execution that has to be perfect, forever. One earnings miss, one bad quarter, and this stock gets hammered.",
        'duration_seconds': 35
    },
    {
        'slide_num': 11,
        'section': 'VERDICT',
        'time': '6:20',
        'title': 'Bottom Line: My Verdict',
        'visual': 'Verdict Graphic',
        'voiceover': "Here's my take. Constellation Software is a great business trading at a dangerous price. The company is high quality. The acquisition model is proven. The returns have been exceptional. But the current valuation leaves almost no room for error. At 56 times earnings, you're paying for perfection, and perfection is hard to maintain. My verdict? This is a stock to watch, not buy. Wait for a 30 to 40% pullback to the $1,500 range, where the risk-reward becomes attractive. Until then, let someone else pay these prices.",
        'duration_seconds': 40
    },
    {
        'slide_num': 12,
        'section': 'WHO',
        'time': '7:00',
        'title': 'Who Should Consider CSU?',
        'visual': 'Investor Type Matrix',
        'voiceover': "Who should consider this stock? Growth investors with a high risk tolerance might find the 18% revenue growth attractive, but there are better opportunities elsewhere. Value investors should stay away - this is the opposite of value investing. Momentum traders? The trend is your friend until it isn't. If you must own it, keep the position small and be prepared for volatility. This is not a core holding at these prices.",
        'duration_seconds': 35
    },
    {
        'slide_num': 13,
        'section': 'PRICE_TARGETS',
        'time': '7:35',
        'title': 'Fair Value Estimates',
        'visual': 'Price Target Chart',
        'voiceover': f"Where should CSU trade? A fair multiple for this business is probably 35 to 40 times earnings, recognizing the quality but accounting for the execution risk. That puts fair value around $1,500 to $1,750 per share versus the current ${csu_data['price']:,.0f}. To get interested, I'd want to see a price below $1,600, preferably closer to $1,400. That gives you a margin of safety and compensates for the risks. At $2,454, you're paying tomorrow's price today.",
        'duration_seconds': 40
    },
    {
        'slide_num': 14,
        'section': 'ALTERNATIVES',
        'time': '8:15',
        'title': 'Better Alternatives?',
        'visual': 'Alternative Investments Comparison',
        'voiceover': "Are there better alternatives? For Canadian exposure, the banks offer 3 to 4% yields at reasonable valuations. Infrastructure like Enbridge provides stable income. Even looking at other tech names, many trade at half CSU's multiple with decent growth. The point isn't that CSU is a bad company - it's not. But there are likely better risk-adjusted opportunities in the market right now. Don't fall in love with past returns.",
        'duration_seconds': 40
    },
    {
        'slide_num': 15,
        'section': 'ACTION',
        'time': '8:55',
        'title': 'Action Items',
        'visual': 'Summary Checklist',
        'voiceover': "Here's what to do if you're interested in CSU. First, add it to your watchlist, not your portfolio. Second, set price alerts for $1,800, $1,600, and $1,400. Third, read the annual letter from Mark Leonard - it's excellent and free education. Fourth, understand that volatility will be high. And fifth, be patient. Good opportunities come to those who wait.",
        'duration_seconds': 35
    },
    {
        'slide_num': 16,
        'section': 'TIMING',
        'time': '9:30',
        'title': 'When to Buy',
        'visual': 'Entry Strategy',
        'voiceover': "Timing matters. If you're committed to buying CSU despite the valuation, consider dollar-cost averaging on pullbacks. Don't buy all at once. Scale in slowly if it drops below $2,000, more aggressively below $1,800, and size up significantly below $1,500. But remember, if it drops that far, it's because something has changed. Make sure you understand what that is before buying.",
        'duration_seconds': 40
    },
    {
        'slide_num': 17,
        'section': 'CATALYSTS',
        'time': '10:10',
        'title': 'Upcoming Catalysts',
        'visual': 'Calendar of Events',
        'voiceover': "What to watch? Quarterly earnings are the big one - any miss on revenue growth or margin compression will hit the stock hard. Major acquisition announcements could be positive or negative depending on price paid. Management commentary on the earnings call about deal pipeline and international expansion. And macro factors like interest rate changes affect growth stock multiples across the board. Stay informed.",
        'duration_seconds': 35
    },
    {
        'slide_num': 18,
        'section': 'LESSONS',
        'time': '10:45',
        'title': 'Key Lessons',
        'visual': '3 Key Takeaways',
        'voiceover': "Three key lessons from this analysis. First, great businesses can be bad investments if you pay too much. Second, past returns don't guarantee future performance, and multiple expansion can reverse quickly. Third, always demand a margin of safety. Even the best companies stumble occasionally, and you want to be protected when they do. CSU is a case study in why price matters.",
        'duration_seconds': 35
    },
    {
        'slide_num': 19,
        'section': 'DISCLAIMER',
        'time': '11:20',
        'title': 'Disclosure',
        'visual': 'Disclaimer Text',
        'voiceover': "Quick disclosure: I don't currently own CSU and have no plans to buy at these prices. This video is for educational purposes only. It's not investment advice. I'm not a financial advisor. Do your own research, consult professionals, and make your own decisions. The numbers are from TradingView as of February 26, 2026.",
        'duration_seconds': 25
    },
    {
        'slide_num': 20,
        'section': 'CTA',
        'time': '11:45',
        'title': 'Call to Action',
        'visual': 'Subscribe / Like / Comment',
        'voiceover': "If you found this analysis helpful, hit the like button and subscribe for more Canadian stock breakdowns. Comment below - what's your take on CSU at these prices? Are you buying, watching, or staying away? Thanks for watching, and I'll see you in the next video.",
        'duration_seconds': 20
    }
]

# Generate script
script_content = []
script_content.append("# CSU (Constellation Software) YouTube Video Script")
script_content.append("=" * 70)
script_content.append(f"Stock: {csu_data['name']} (Ticker: {csu_data['ticker']})")
script_content.append(f"Current Price: ${csu_data['price']:,.0f}")
script_content.append(f"P/E Ratio: {csu_data['pe']:.1f}x")
script_content.append(f"Analysis Date: February 26, 2026")
script_content.append("=" * 70)
script_content.append("")
script_content.append("## VIDEO FORMAT: PowerPoint Slide Presentation with Voiceover")
script_content.append("## TOTAL RUNTIME: Approximately 12 minutes")
script_content.append("")

# Generate captions with timestamps
captions = []
total_seconds = 0

for slide in slides:
    script_content.append(f"\n{'='*70}")
    script_content.append(f"SLIDE {slide['slide_num']} | {slide['section']}")
    script_content.append(f"Time: {slide['time']}")
    script_content.append(f"Section: {slide['title']}")
    script_content.append("")
    script_content.append("VISUAL:")
    script_content.append(f"  {slide['visual']}")
    script_content.append("")
    script_content.append("VOICEOVER:")
    script_content.append(f"  {slide['voiceover']}")
    script_content.append("")
    
    # Add to captions
    start_time = total_seconds
    end_time = total_seconds + slide['duration_seconds']
    
    captions.append({
        'slide': slide['slide_num'],
        'start': start_time,
        'end': end_time,
        'text': slide['voiceover']
    })
    
    total_seconds = end_time

# Format total runtime
minutes = total_seconds // 60
seconds = total_seconds % 60
script_content.append(f"\n{'='*70}")
script_content.append(f"TOTAL RUNTIME: {minutes}:{seconds:02d}")
script_content.append("=" * 70)

# Save script
script_file = OUTPUT_DIR / 'csu_youtube_script.md'
with open(script_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(script_content))

print(f"\nScript saved to: {script_file}")

# Generate captions file
captions_data = {
    'video_title': f"{csu_data['name']} (CSU) Stock Analysis: Worth the Premium?",
    'stock_ticker': csu_data['ticker'],
    'total_duration_seconds': total_seconds,
    'slides': slides
}

captions_file = OUTPUT_DIR / 'csu_captions.json'
with open(captions_file, 'w', encoding='utf-8') as f:
    json.dump(captions_data, f, indent=2, ensure_ascii=False)

print(f"Captions saved to: {captions_file}")

# Generate simple captions for YouTube upload
yt_captions = []
for cap in captions:
    start_min = cap['start'] // 60
    start_sec = cap['start'] % 60
    end_min = cap['end'] // 60
    end_sec = cap['end'] % 60
    
    start_time = f"{start_min}:{start_sec:02d}.000"
    end_time = f"{end_min}:{end_sec:02d}.000"
    
    yt_captions.append(f"{start_time} --> {end_time}")
    yt_captions.append(cap['text'])
    yt_captions.append("")

yt_captions_file = OUTPUT_DIR / 'csu_captions_youtube.vtt'
with open(yt_captions_file, 'w', encoding='utf-8') as f:
    f.write("WEBVTT\n\n")
    f.write('\n'.join(yt_captions))

print(f"YouTube VTT captions saved to: {yt_captions_file}")

# Summary
print("\n" + "="*70)
print("YOUTUBE SCRIPT GENERATION COMPLETE")
print("="*70)
print(f"\nOutput files:")
print(f"  1. Script (Markdown): {script_file}")
print(f"  2. Captions (JSON): {captions_file}")
print(f"  3. Captions (VTT): {yt_captions_file}")
print(f"\nTotal Runtime: {minutes}:{seconds:02d}")
print(f"Number of Slides: {len(slides)}")
print("="*70)
print("\nKEY SLIDES SUMMARY:")
for slide in slides:
    print(f"  Slide {slide['slide_num']:2d}: {slide['title'][:45]:<45} ({slide['time']})")
