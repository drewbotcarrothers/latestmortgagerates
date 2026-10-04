import { communityRates, distributionFor, formatAsOf, formatRate } from "@/lib/communityRates";

export default function CommunityCallout({ className = "" }: { className?: string }) {
  const fixed = distributionFor(60, "fixed", "all");
  const variable = distributionFor(60, "variable", "all");
  if (!fixed || !variable) return null;

  return (
    <section className={`card-default p-6 ${className}`}>
      <h2 className="text-xl font-bold text-slate-900">What mortgage rate are people getting?</h2>
      <p className="mt-2 text-slate-600">
        Posted shelves and the rates {communityRates.attribution} are different numbers. As of {formatAsOf()}, the median 5-year fixed report is{" "}
        <strong className="text-slate-900">{formatRate(fixed.median)}</strong> (N = {fixed.n}) and the median 5-year variable report is{" "}
        <strong className="text-slate-900">{formatRate(variable.median)}</strong> (N = {variable.n}), all insured statuses.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
        <a href="/real-mortgage-rates/" className="rounded-lg bg-teal-700 px-4 py-2 text-white hover:bg-teal-800">
          Real mortgage rates
        </a>
        <a href="/tools/renewal-offer-checker/" className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:border-teal-600">
          Check a renewal offer
        </a>
        <a href="/guides/negotiate-mortgage-rate/" className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:border-teal-600">
          Negotiate below posted
        </a>
      </div>
    </section>
  );
}
