import Image from "next/image";
import Link from "next/link";

interface FooterProps {
  showDisclaimer?: boolean;
}

// Inline SVG icons
const HomeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BookOpenIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const LibraryIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const CalculatorIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default function Footer({ showDisclaimer = true }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  const navItems = [
    { href: "/", label: "Rates", icon: HomeIcon },
    { href: "/blog", label: "Guides", icon: BookOpenIcon },
    { href: "/glossary", label: "Glossary", icon: LibraryIcon },
    { href: "/tools", label: "Tools", icon: CalculatorIcon },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Trust Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-slate-400">30+ Lenders Compared</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-500"></div>
              <span className="text-slate-400">Updated Twice Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span className="text-slate-400">100% Free & Independent</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Disclaimer */}
        {showDisclaimer && (
          <div className="mb-10 p-5 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-amber-500/20 rounded-lg mt-0.5">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-amber-200 mb-1">Important Disclaimer</h4>
                <p className="text-sm text-amber-200/80 leading-relaxed">
                  The information on this website is for educational purposes only and does not constitute financial advice. 
                  Rates are subject to change without notice. Always verify current rates with lenders and consult with a qualified 
                  mortgage professional before making financial decisions.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Latest Mortgage Rates Canada"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div>
                <h3 className="font-bold text-white text-lg">LatestMortgageRates.ca</h3>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Compare mortgage rates from Canada's top lenders. Making home financing transparent and accessible since 2025.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                <MapPinIcon />
                Canada
              </span>
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="group flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-all duration-200 text-sm"
                  >
                    <span className="text-slate-500 group-hover:text-teal-400 transition-colors"><item.icon /></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/blog", label: "Mortgage Guides" },
                { href: "/glossary", label: "Rate Glossary" },
                { href: "/tools", label: "Calculators" },
                { href: "/", label: "Compare Rates" },
              ].map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  href="/unsubscribe" 
                  className="text-slate-400 hover:text-teal-400 transition-colors text-sm"
                >
                  Unsubscribe
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-center text-sm text-slate-500">
              © {currentYear} LatestMortgageRates.ca - All rights reserved.
            </p>
            <p className="text-center text-xs text-slate-600">
              Not affiliated with any bank or mortgage lender. Rates are for comparison purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
