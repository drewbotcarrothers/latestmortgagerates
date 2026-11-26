import type { HeroCardModel } from "@/lib/homepageRates";
import type { PublishedRate } from "@/lib/publishedRates";

interface HeroRateCardsProps {
  cards: HeroCardModel[];
  onLenderClick: (rate: PublishedRate) => void;
}

function Rank({
  rate,
  place,
  onClick,
}: {
  rate: PublishedRate;
  place: number;
  onClick: () => void;
}) {
  const leader = place === 1;
  return (
    <a
      href={`/lenders/${rate.lender_slug}/`}
      onClick={onClick}
      className={`${leader ? "flex" : "mt-2 hidden sm:flex"} items-center justify-between gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300`}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
            leader ? "bg-emerald-500 text-white" : "bg-white/15 text-slate-300"
          }`}
        >
          {place}
        </span>
        <span className="truncate text-sm text-slate-100">{rate.lender_name}</span>
      </span>
      <span
        className={`shrink-0 font-bold tabular-nums ${leader ? "text-lg tracking-tight text-emerald-300" : "text-slate-200"}`}
      >
        {rate.rate.toFixed(2)}%
      </span>
    </a>
  );
}

export default function HeroRateCards({ cards, onLenderClick }: HeroRateCardsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const [first, second, third] = card.rows;
        const median = card.reported;
        return (
          <article key={card.key} className="rounded-[14px] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
            <div className="mb-3.5 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-1.5 whitespace-nowrap text-[0.8125rem] font-semibold text-teal-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                <a
                  href={card.href}
                  className="rounded-sm hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300"
                >
                  {card.title}
                </a>
              </h2>
              <a
                href={card.seeAllHref}
                className={`rounded-full border px-1.5 py-0.5 text-[10px] font-semibold leading-tight ${
                  card.mortgageType === "insured"
                    ? "border-amber-200/30 bg-amber-400/15 text-amber-100"
                    : "border-slate-200/20 bg-slate-400/15 text-slate-200"
                }`}
              >
                {card.badge}
              </a>
            </div>
            {first ? (
              <>
                <Rank rate={first} place={1} onClick={() => onLenderClick(first)} />
                {median ? (
                  <p className="mt-2 rounded-lg bg-black/20 px-2 py-1.5 text-[11px] leading-snug text-teal-200">
                    30-day reported median{" "}
                    <strong className="font-bold tabular-nums text-emerald-50">{median.label}</strong> (n={median.n}
                    {median.sample === "all-statuses" ? ", all down payments" : median.smallSample ? ", small sample" : ""})
                  </p>
                ) : null}
                {second ? <Rank rate={second} place={2} onClick={() => onLenderClick(second)} /> : null}
                {third ? <Rank rate={third} place={3} onClick={() => onLenderClick(third)} /> : null}
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-xs text-slate-400">
                  <span>{card.lenderCount} lenders</span>
                  <a href={card.seeAllHref} className="font-semibold text-teal-200 hover:text-white">
                    See all →
                  </a>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-300">No rates available</p>
            )}
          </article>
        );
      })}
    </div>
  );
}
