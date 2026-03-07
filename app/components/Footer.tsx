import Link from "next/link";

interface FooterProps {
  showDisclaimer?: boolean;
}

export default function Footer({ showDisclaimer = true }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Disclaimer */}
        {showDisclaimer && (
          <div className="mb-6 p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <p className="text-sm text-amber-200">
              <strong>Disclaimer:</strong> The information on this website is for educational purposes only and does not constitute financial advice. 
              Rates are subject to change without notice. Always verify current rates with lenders and consult with a qualified 
              mortgage professional before making financial decisions. Calculators provide estimates only.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-white mb-2">LatestMortgageRates.ca</h3>
            <p className="text-sm text-slate-400">
              Compare mortgage rates from Canada&apos;s top lenders. Making home financing transparent and accessible.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/" className="text-slate-400 hover:text-teal-400 transition">Current Rates</Link></li>
              <li><Link href="/tools" className="text-slate-400 hover:text-teal-400 transition">Calculators</Link></li>
              <li><Link href="/blog" className="text-slate-400 hover:text-teal-400 transition">Guides</Link></li>
              <li><Link href="/glossary" className="text-slate-400 hover:text-teal-400 transition">Glossary</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-2">Legal</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/privacy" className="text-slate-400 hover:text-teal-400 transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-teal-400 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center text-sm text-slate-500">
            © 2026 LatestMortgageRates.ca - All rights reserved.
          </p>
          <p className="text-center text-xs text-slate-600">
            Not affiliated with any bank or mortgage lender. Rates are for comparison purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
