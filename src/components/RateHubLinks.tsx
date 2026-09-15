import { RATE_HUBS, TOOLS_INDEX_HREF, filterCurrent, type SiteLink } from "@/lib/siteLinks";

interface RateHubLinksProps {
  currentHref?: string;
  title?: string;
  description?: string;
  variant?: "cards" | "pills";
  showToolsIndex?: boolean;
  className?: string;
}

export default function RateHubLinks({
  currentHref,
  title = "Compare rates by type",
  description = "Jump to today’s 5-year fixed, variable, insured, and uninsured mortgage rates.",
  variant = "cards",
  showToolsIndex = false,
  className = "",
}: RateHubLinksProps) {
  const hubs: SiteLink[] = filterCurrent(RATE_HUBS, currentHref);

  if (variant === "pills") {
    return (
      <nav className={`flex flex-wrap gap-2 ${className}`} aria-label="Rate types and tools">
        {hubs.map((hub) => (
          <a
            key={hub.href}
            href={hub.href}
            className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm text-slate-100 border border-white/10 transition"
          >
            {hub.title}
          </a>
        ))}
        {showToolsIndex && (
          <a
            href={TOOLS_INDEX_HREF}
            className="inline-flex items-center px-3 py-1.5 rounded-full bg-teal-500/30 hover:bg-teal-500/40 text-sm text-white border border-teal-300/30 transition"
          >
            Mortgage calculators
          </a>
        )}
      </nav>
    );
  }

  return (
    <section className={`card-default p-6 ${className}`}>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-600 mb-4">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {hubs.map((hub) => (
          <a
            key={hub.href}
            href={hub.href}
            className="block p-4 rounded-lg bg-slate-50 hover:bg-white hover:shadow-sm border border-slate-200 transition-all group"
          >
            <p className="font-medium text-slate-900 group-hover:text-teal-600 transition-colors text-sm">
              {hub.title}
            </p>
            <p className="text-xs text-slate-500 mt-1">{hub.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
