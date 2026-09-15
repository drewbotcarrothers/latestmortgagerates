import { COMPARISONS, type CompareKind } from "@/content/comparisons";
import { COMPARE_INDEX_HREF, compareHref } from "@/lib/compare";

interface CompareLinksProps {
  currentSlug?: string;
  kind?: CompareKind;
  title?: string;
  description?: string;
  className?: string;
}

export default function CompareLinks({
  currentSlug,
  kind,
  title = "Mortgage comparison guides",
  description = "Fixed vs variable, insured vs uninsured, and lender vs lender — with live rates from the same feed as our hubs.",
  className = "",
}: CompareLinksProps) {
  const pages = COMPARISONS.filter((page) => {
    if (currentSlug && page.slug === currentSlug) return false;
    if (kind && page.kind !== kind) return false;
    return true;
  });

  if (pages.length === 0) return null;

  return (
    <section className={`card-default p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-600 mt-1">{description}</p>
        </div>
        <a href={COMPARE_INDEX_HREF} className="text-sm font-medium text-teal-600 hover:underline">
          All comparisons →
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pages.map((page) => (
          <a
            key={page.slug}
            href={compareHref(page.slug)}
            className="block p-4 rounded-lg bg-slate-50 hover:bg-white hover:shadow-sm border border-slate-200 transition-all group"
          >
            <p className="text-xs uppercase tracking-wide text-teal-700 font-semibold mb-1">
              {page.kind === "lender" ? "Lender vs lender" : "Product"}
            </p>
            <p className="font-medium text-slate-900 group-hover:text-teal-600 transition-colors text-sm">
              {page.left.shortName} vs {page.right.shortName}
            </p>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{page.left.summary}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
