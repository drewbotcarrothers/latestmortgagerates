"use client";

import { useMemo, useState } from "react";
import GuideCTA from "@/components/GuideCTA";
import {
  BIG5_SLUGS,
  communityRates,
  formatAsOf,
  formatRate,
  formatSpread,
  lenderName,
  negotiationTips,
  productLabel,
  scoreOffer,
  termLabel,
  type RateType,
  type ScoreResult,
} from "@/lib/communityRates";

const TERMS = [12, 24, 36, 48, 60];

type InsuredChoice = "insured" | "uninsured" | "all";

const VERDICT_STYLE: Record<ScoreResult["verdict"], { label: string; className: string }> = {
  great: { label: "Great offer", className: "bg-emerald-100 text-emerald-900 border-emerald-200" },
  fair: { label: "Fair offer", className: "bg-teal-100 text-teal-900 border-teal-200" },
  negotiate: { label: "Negotiate", className: "bg-amber-100 text-amber-950 border-amber-200" },
  insufficient: { label: "Not enough reports", className: "bg-slate-100 text-slate-800 border-slate-200" },
};

export default function RenewalOfferChecker() {
  const [lenderSlug, setLenderSlug] = useState<string>("td");
  const [termMonths, setTermMonths] = useState(60);
  const [rateType, setRateType] = useState<RateType>("fixed");
  const [insured, setInsured] = useState<InsuredChoice>("uninsured");
  const [rateText, setRateText] = useState("");

  const offerRate = Number(rateText);
  const ready = rateText.trim() !== "" && Number.isFinite(offerRate) && offerRate > 0 && offerRate < 20;
  const input = {
    lenderSlug: lenderSlug || null,
    termMonths,
    rateType,
    insured,
    offerRate,
  };
  const score = useMemo(() => (ready ? scoreOffer(input) : null), [ready, lenderSlug, termMonths, rateType, insured, offerRate]);
  const tips = score ? negotiationTips(score, input) : [];
  const window30 = communityRates.windows["30d"];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <form className="card-default space-y-4 p-5" onSubmit={(event) => event.preventDefault()}>
        <div>
          <label htmlFor="offer-bank" className="mb-1 block text-sm font-medium text-slate-800">Bank</label>
          <select
            id="offer-bank"
            value={lenderSlug}
            onChange={(event) => setLenderSlug(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {BIG5_SLUGS.map((slug) => (
              <option key={slug} value={slug}>{lenderName(slug)}</option>
            ))}
            <option value="">Any lender / not sure</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="offer-term" className="mb-1 block text-sm font-medium text-slate-800">Term</label>
            <select
              id="offer-term"
              value={termMonths}
              onChange={(event) => setTermMonths(Number(event.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {TERMS.map((months) => (
                <option key={months} value={months}>{termLabel(months)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="offer-type" className="mb-1 block text-sm font-medium text-slate-800">Type</label>
            <select
              id="offer-type"
              value={rateType}
              onChange={(event) => setRateType(event.target.value as RateType)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="fixed">Fixed</option>
              <option value="variable">Variable</option>
            </select>
          </div>
        </div>
        <fieldset>
          <legend className="mb-1 text-sm font-medium text-slate-800">Insured status</legend>
          <div className="space-y-1 text-sm text-slate-700">
            <label className="flex items-center gap-2">
              <input type="radio" name="insured" checked={insured === "uninsured"} onChange={() => setInsured("uninsured")} />
              Uninsured (20% or more down)
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="insured" checked={insured === "insured"} onChange={() => setInsured("insured")} />
              Insured (less than 20% down)
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="insured" checked={insured === "all"} onChange={() => setInsured("all")} />
              Not sure
            </label>
          </div>
        </fieldset>
        <div>
          <label htmlFor="offer-rate" className="mb-1 block text-sm font-medium text-slate-800">Offered rate (%)</label>
          <input
            id="offer-rate"
            inputMode="decimal"
            value={rateText}
            onChange={(event) => setRateText(event.target.value)}
            placeholder="4.29"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <p className="text-xs leading-relaxed text-slate-500">
          Compared with rates {communityRates.attribution} from {window30.from} to {window30.to}. As of {formatAsOf()}. Nothing you type leaves this browser.
        </p>
      </form>

      <div className="space-y-4" aria-live="polite">
        {!score && (
          <div className="card-default p-6 text-slate-600">
            Enter the rate you were offered. The checker places it against reports for that term and type, and against the posted rate in today&apos;s snapshot.
          </div>
        )}
        {score && (
          <Result score={score} offerRate={offerRate} lenderSlug={lenderSlug || null} termMonths={termMonths} rateType={rateType} insured={insured} tips={tips} />
        )}
        <GuideCTA variant="compact" />
      </div>
    </div>
  );
}

function Result({
  score,
  offerRate,
  lenderSlug,
  termMonths,
  rateType,
  insured,
  tips,
}: {
  score: ScoreResult;
  offerRate: number;
  lenderSlug: string | null;
  termMonths: number;
  rateType: RateType;
  insured: InsuredChoice;
  tips: string[];
}) {
  const style = VERDICT_STYLE[score.verdict];
  const label = productLabel({ termMonths, rateType, insured });
  const sampleNote = score.sample === "bank" && lenderSlug
    ? `Scored against rates people report from ${lenderName(lenderSlug)} for this term and type (all insured statuses, N = ${score.n}).`
    : score.sample === "all-statuses"
      ? `The exact insured cell has fewer than 10 reports, so this uses every insured status for ${termLabel(termMonths)} ${rateType} (N = ${score.n}).`
      : score.sample === "exact"
        ? `Scored against ${label} (N = ${score.n}).`
        : `Fewer than 10 reports match this product, so there is no percentile.`;

  return (
    <div className="card-default p-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className={`rounded-full border px-3 py-1 text-sm font-semibold ${style.className}`}>{style.label}</p>
        <p className="text-sm text-slate-500">Your offer {formatRate(offerRate)} · as of {formatAsOf()}</p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{sampleNote}</p>
      {score.verdict !== "insufficient" && score.percentile != null && score.percentBeating != null && score.median != null && (
        <>
          <p className="mt-4 text-2xl font-bold text-slate-900">
            Lower than {Math.round(score.percentBeating)}% of these reports
          </p>
          <p className="mt-1 text-sm text-slate-600">
            That is about the {Math.round(score.percentile)}th percentile. A lower percentile is a lower rate. The median in this comparison is {formatRate(score.median)}
            {score.p25 != null ? ` and the 25th percentile is ${formatRate(score.p25)}` : ""}.
            Your offer is {formatSpread(score.median - offerRate)} that median.
          </p>
        </>
      )}
      <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Stat label="Vs this median" value={score.vsMedianPts == null ? "—" : formatSpread(-(score.vsMedianPts))} />
        <Stat label={lenderSlug ? `Vs ${lenderName(lenderSlug)} posted` : "Vs bank posted"} value={score.bankPosted == null ? "No posted rate in snapshot" : `${formatRate(score.bankPosted)} · offer is ${formatSpread(score.bankPosted - offerRate)} it`} />
        <Stat label="Vs Big-5 posted median" value={score.big5PostedMedian == null ? "—" : `${formatRate(score.big5PostedMedian)} · offer is ${formatSpread(score.big5PostedMedian - offerRate)} it`} />
        <Stat label="Vs lowest posted" value={score.lowestPosted == null ? "—" : `${formatRate(score.lowestPosted)} (${lenderName(score.lowestPostedLender)})`} />
      </dl>
      {score.marketMedian != null && score.sample === "bank" && (
        <p className="mt-3 text-sm text-slate-600">
          Across all lenders, the market median for the insured-status comparison is {formatRate(score.marketMedian)} (N = {score.marketN}).
        </p>
      )}
      <h3 className="mt-5 text-sm font-semibold text-slate-900">What to do next</h3>
      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap gap-3 text-sm font-semibold">
        <a href="/" className="rounded-lg bg-teal-700 px-4 py-2 text-white hover:bg-teal-800">Compare lender rates</a>
        <a href="/guides/negotiate-mortgage-rate/" className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:border-teal-600">Negotiation steps</a>
        <a href="/real-mortgage-rates/" className="rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:border-teal-600">Full rate report</a>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
