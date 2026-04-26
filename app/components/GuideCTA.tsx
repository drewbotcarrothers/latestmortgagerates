import Link from "next/link";

interface GuideCTAProps {
  variant?: "compact" | "full";
  className?: string;
}

export default function GuideCTA({ variant = "full", className = "" }: GuideCTAProps) {
  if (variant === "compact") {
    return (
      <div className={`bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 ${className}`}>
        <div className="flex items-start gap-3">
          <span className="text-3xl">📖</span>
          <div className="flex-1">
            <h4 className="font-bold text-slate-900 mb-1">Mortgage Negotiation Guide</h4>
            <p className="text-sm text-slate-600 mb-3">
              Save $5,000-$25,000 with insider secrets banks don't want you to know.
            </p>
            <Link
              href="/mortgage-guide"
              className="inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              Learn More
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 rounded-xl p-6 text-white ${className}`}>
      <div className="flex items-start gap-4">
        <span className="text-4xl">📖</span>
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">Get the Mortgage Negotiation Guide</h3>
          <p className="text-slate-300 text-sm mb-4">
            Insider secrets to save $5,000-$25,000 on your mortgage. Learn how to negotiate rates, 
            time the market, and avoid costly penalties. 10 chapters of actionable intel.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/mortgage-guide"
              className="inline-flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-lg transition"
            >
              Learn More
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://buy.stripe.com/7sY4gz8ZtbAqg2s8nw9oc00"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition"
            >
              Buy Now — $29
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
