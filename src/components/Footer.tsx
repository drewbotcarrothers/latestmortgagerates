import { lenderCountLabel } from "@/lib/lenderCount";

interface FooterProps {
  showDisclaimer?: boolean;
}

interface FooterLink {
  href: string;
  label: string;
}

const MapPinIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 00.5 6.2 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.8 3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.8zM9.75 15.57V8.43L15.84 12l-6.09 3.57z" />
  </svg>
);

/** Sibling portfolio sites. This site is omitted so the footer does not link to itself. */
const portfolioSites = [
  { href: "https://canadianoptimizer.com/", label: "Canadian Optimizer" },
  { href: "https://canadiancreditcardfinder.com/", label: "Canadian Credit Card Finder" },
  { href: "https://canadiandatainsights.com/", label: "Canadian Data Insights" },
  { href: "https://makemoneyoptimizer.com/", label: "Make Money Optimizer" },
  { href: "https://savingoptimizer.com/", label: "Saving Optimizer" },
  { href: "https://aitoolsoptimizer.com/", label: "AI Tools Optimizer" },
  { href: "https://stocksummarizer.com/", label: "Stock Summarizer" },
] as const;

const youtubeChannel = {
  href: "https://www.youtube.com/@LatestMortgageRates",
  label: "YouTube",
} as const;

const toolkitHref =
  "/mortgage-guide/?utm_source=site&utm_medium=footer&utm_campaign=mortgage_guide&utm_content=footer";

const rateLinks: FooterLink[] = [
  { href: "/", label: "Current rates" },
  { href: "/real-mortgage-rates/", label: "Real mortgage rates" },
  { href: "/rate-data/", label: "Rate data" },
  { href: "/trends/", label: "Rate trends" },
  { href: "/rates/5-year-fixed/", label: "5-year fixed" },
  { href: "/rates/variable/", label: "Variable rates" },
  { href: "/rates/insured/", label: "Insured rates" },
  { href: "/rates/uninsured/", label: "Uninsured rates" },
];

const guideLinks: FooterLink[] = [
  { href: "/compare/", label: "Compare mortgages" },
  { href: "/compare/fixed-vs-variable/", label: "Fixed vs variable" },
  { href: "/tools/", label: "Calculators" },
  { href: "/tools/renewal-offer-checker/", label: "Renewal offer checker" },
  { href: "/tools/stress-test-qualifier/", label: "Stress test" },
  { href: "/guides/", label: "Guides" },
  { href: "/guides/negotiate-mortgage-rate/", label: "Negotiate your rate" },
  { href: "/glossary/", label: "Glossary" },
  { href: "/blog/", label: "Blog" },
  { href: "/methodology/", label: "Rate methodology" },
];

const lenderLinks: FooterLink[] = [
  { href: "/lenders/rbc/", label: "RBC Royal Bank" },
  { href: "/lenders/td/", label: "TD Bank" },
  { href: "/lenders/scotiabank/", label: "Scotiabank" },
  { href: "/lenders/bmo/", label: "BMO" },
  { href: "/lenders/cibc/", label: "CIBC" },
  { href: "/lenders/nesto/", label: "nesto" },
  { href: "/lenders/wealthsimple/", label: "Wealthsimple" },
  { href: "/lenders/truenorth/", label: "True North Mortgage" },
];

const textLinkClass = "text-sm text-slate-400 transition-colors hover:text-teal-400";

function LinkColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="mb-3 font-semibold text-white">{title}</h4>
      <ul className="space-y-2">
        {links.map((item) => (
          <li key={item.href}>
            <a href={item.href} className={textLinkClass}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ showDisclaimer = true }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="border-b border-slate-800 bg-gradient-to-r from-slate-800 to-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-slate-400">{lenderCountLabel} Lenders Compared</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-teal-500"></div>
              <span className="text-slate-400">Updated Twice Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              <span className="text-slate-400">100% Free & Independent</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Latest Mortgage Rates Canada"
                width={48}
                height={48}
                loading="lazy"
                className="h-12 w-12 rounded-lg"
              />
              <h3 className="text-lg font-bold text-white">LatestMortgageRates.ca</h3>
            </div>
            <p className="max-w-xl text-sm text-slate-400">
              Compare mortgage rates from Canada's top lenders. Making home financing transparent and accessible since 2025.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <MapPinIcon />
                Canada
              </span>
              <a
                href={youtubeChannel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-teal-400"
              >
                <YouTubeIcon />
                {youtubeChannel.label}
              </a>
            </div>
          </div>
          <a
            href={toolkitHref}
            className="inline-flex w-full shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 sm:w-auto"
          >
            Mortgage Toolkit ($29)
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <LinkColumn title="Rates" links={rateLinks} />
          <LinkColumn title="Guides & tools" links={guideLinks} />
          <LinkColumn title="Lenders" links={lenderLinks} />
        </div>

        <section className="mt-8 border-t border-slate-800 pt-6" aria-labelledby="footer-portfolio">
          <h4 id="footer-portfolio" className="mb-3 font-semibold text-white">
            More Canadian tools
          </h4>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {portfolioSites.map((site) => (
              <li key={site.href}>
                <a
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={textLinkClass}
                >
                  {site.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 space-y-4 border-t border-slate-800 pt-6">
          {showDisclaimer && (
            <div className="max-w-3xl">
              <h4 className="text-sm font-semibold text-amber-200">Important disclaimer</h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Educational information only, not financial advice. Rates can change without notice. Verify current
                rates with the lender and consult a qualified mortgage professional before you decide.
              </p>
            </div>
          )}
          <nav aria-label="Site information" className="flex flex-wrap gap-x-4 gap-y-2">
            <a href="/about/" className={textLinkClass}>
              About
            </a>
            <a href="/editorial-policy/" className={textLinkClass}>
              Editorial policy
            </a>
            <a href="/contact/" className={textLinkClass}>
              Contact
            </a>
            <a href="/disclaimer/" className={textLinkClass}>
              Disclaimer
            </a>
            <a href="/privacy/" className={textLinkClass}>
              Privacy
            </a>
            <a href="/terms/" className={textLinkClass}>
              Terms
            </a>
            <a href="/unsubscribed/" className={textLinkClass}>
              Unsubscribe
            </a>
          </nav>
          <p className="text-sm text-slate-500">
            © {currentYear} LatestMortgageRates.ca - All rights reserved.
          </p>
          <p className="max-w-3xl text-xs leading-relaxed text-slate-600">
            Not affiliated with any bank or mortgage lender. Rates are for comparison purposes only. Lender names and
            logos are trademarks of their respective owners, used for identification only. No endorsement is implied.
          </p>
        </div>
      </div>
    </footer>
  );
}
