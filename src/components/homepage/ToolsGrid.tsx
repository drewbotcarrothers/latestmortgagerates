interface ToolsGridProps {
  onCalculatorClick: () => void;
  onRenewalClick: () => void;
  onHistoryClick: () => void;
  onTrendsClick: () => void;
}

const iconClass = "flex h-9 w-9 items-center justify-center rounded-[9px] bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200";

export default function ToolsGrid({
  onCalculatorClick,
  onRenewalClick,
  onHistoryClick,
  onTrendsClick,
}: ToolsGridProps) {
  const tools = [
    {
      href: "/tools/mortgage-calculator/",
      title: "Mortgage Calculator",
      body: "Monthly payments and amortization at today’s rates.",
      onClick: onCalculatorClick,
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path strokeLinecap="round" d="M8 7h8M8 12h2M12 12h2M16 12h2M8 16h2M12 16h2M16 16h2" />
        </svg>
      ),
    },
    {
      href: "/tools/renewal-offer-checker/",
      title: "Renewal Checker",
      body: "See how a renewal offer stacks up against specials.",
      onClick: onRenewalClick,
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      ),
    },
    {
      href: "/mortgage-rate-history/",
      title: "Rate History",
      body: "Weekly 5-year rates back to late February, plus CSV.",
      onClick: onHistoryClick,
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5M4 19h16" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 15l3-4 3 2 4-6" />
        </svg>
      ),
    },
    {
      href: "/trends/",
      title: "Rate Trends",
      body: "How published specials have moved, week by week.",
      onClick: onTrendsClick,
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l5-5 3 3 8-8" />
          <path strokeLinecap="round" d="M15 6h5v5" />
        </svg>
      ),
    },
    {
      href: "/guides/big-5-bank-mortgages-compared/",
      title: "Big 5 Compared",
      body: "Rates, penalties and holds at the Big Five banks.",
      onClick: undefined,
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" d="M4 19h4V9H4v10zM10 19h4V5h-4v14zM16 19h4v-7h-4v7z" />
        </svg>
      ),
    },
  ];

  return (
    <section aria-labelledby="tools-heading" className="mt-7">
      <h2 id="tools-heading" className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
        Quick tools and guides
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-5 max-lg:[&>:last-child:nth-child(odd)]:col-span-2">
        {tools.map((tool) => (
          <a
            key={tool.href}
            href={tool.href}
            onClick={tool.onClick}
            className="flex min-h-[128px] flex-col gap-2 rounded-[14px] border border-slate-200 bg-white p-4 shadow-sm transition hover:border-cyan-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:border-slate-700 dark:bg-slate-900"
          >
            <span className={iconClass}>{tool.icon}</span>
            <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">{tool.title}</h3>
            <p className="text-xs leading-snug text-slate-500">{tool.body}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
