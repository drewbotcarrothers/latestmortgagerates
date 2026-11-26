import { big5GapLabel, type RangeBarModel } from "@/lib/homepageRates";
import { communityRates } from "@/lib/communityRates";

interface BorrowerRangeBarsProps {
  bars: RangeBarModel[];
  onRenewalClick: () => void;
}

export default function BorrowerRangeBars({ bars, onRenewalClick }: BorrowerRangeBarsProps) {
  return (
    <section
      aria-labelledby="getting-heading"
      className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-7 gap-y-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">What Canadians are actually getting</p>
          <h2 id="getting-heading" className="mt-1.5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Published specials versus borrower-reported medians
          </h2>
          <p className="mt-1.5 text-[0.8125rem] text-slate-500">
            Last 30 days · aggregates {communityRates.attribution}
          </p>
        </div>
        <a
          href="/tools/renewal-offer-checker/"
          onClick={onRenewalClick}
          className="max-w-sm text-sm font-semibold leading-snug text-cyan-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:text-cyan-300"
        >
          Got a renewal offer? Check if it beats what Canadians are getting →
        </a>
      </div>

      <div className="mt-4 grid gap-5">
        {bars.map((bar) => {
          const gap = big5GapLabel(bar.gap);
          return (
            <article key={bar.rateType} aria-label={`${bar.title} range`}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <h3 className="text-[0.9375rem] font-bold tracking-tight text-slate-900 dark:text-white">{bar.title}</h3>
                {gap ? <p className="text-right text-[0.8125rem] font-bold text-emerald-700 dark:text-emerald-300">{gap}</p> : null}
              </div>
              {bar.reported ? (
                <p className="mb-2.5 flex flex-wrap items-baseline gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 self-center rounded-full bg-cyan-600 shadow-[0_0_0_3px_white,0_0_0_5px_#0891b2] dark:shadow-[0_0_0_3px_#0f172a,0_0_0_5px_#0891b2]"
                    aria-hidden="true"
                  />
                  <strong className="text-xl font-extrabold tabular-nums tracking-tight text-cyan-800 dark:text-cyan-300">
                    {bar.reported.label}
                  </strong>
                  <span className="text-[0.8125rem] font-medium text-slate-600 dark:text-slate-300">
                    Borrower-reported median (n={bar.reported.n}
                    {bar.reported.smallSample ? ", small sample" : ""})
                  </span>
                </p>
              ) : (
                <p className="mb-2.5 text-sm text-slate-500">Not enough 30-day reports to publish a median.</p>
              )}
              <div className="relative">
                <div className="h-2.5 rounded-full bg-gradient-to-r from-emerald-300 via-slate-200 to-red-300" />
                {bar.markerPercent != null ? (
                  <div
                    className="absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-cyan-600 shadow-[0_0_0_2px_#0891b2,0_2px_6px_rgba(15,23,42,0.18)]"
                    style={{ left: `${bar.markerPercent}%` }}
                    title={`${bar.reported?.label ?? ""} borrower-reported median`}
                  />
                ) : null}
              </div>
              <div className="mt-2.5 flex justify-between gap-4 text-xs leading-snug text-slate-500">
                <div>
                  <strong className="block text-[0.9375rem] font-extrabold tabular-nums tracking-tight text-slate-900 dark:text-white">
                    {bar.lowestLabel ?? "—"}
                  </strong>
                  Lowest published special
                </div>
                <div className="text-right">
                  <strong className="block text-[0.9375rem] font-extrabold tabular-nums tracking-tight text-slate-900 dark:text-white">
                    {bar.big5Label ?? "—"}
                  </strong>
                  Big Five posted median
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
