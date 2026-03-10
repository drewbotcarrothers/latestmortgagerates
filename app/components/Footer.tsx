import Link from "next/link";
import { Home, BookOpen, Library, Calculator, Mail, MapPin, Phone } from "lucide-react";

interface FooterProps {
  showDisclaimer?: boolean;
}

export default function Footer({ showDisclaimer = true }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  const navItems = [
    { href: "/", label: "Rates", icon: Home },
    { href: "/blog", label: "Guides", icon: BookOpen },
    { href: "/glossary", label: "Glossary", icon: Library },
    { href: "/tools", label: "Tools", icon: Calculator },
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
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">LatestMortgageRates.ca</h3>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Compare mortgage rates from Canada's top lenders. Making home financing transparent and accessible since 2025.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Canada", icon: MapPin },
              ].map((item) => (
                <span key={item.label} className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          
          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <Link 
                    href={item.href} 
                    className="group flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-all duration-200 text-sm"
                  >
                    <item.icon className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
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
