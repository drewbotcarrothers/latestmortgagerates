import { communityRates, formatAsOf } from "@/lib/communityRates";

export default function CommunityDisclaimer({ className = "" }: { className?: string }) {
  const window30 = communityRates.windows["30d"];
  return (
    <aside className={`rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 ${className}`}>
      <p className="font-semibold">These rates are not an offer</p>
      <p className="mt-1 leading-relaxed">
        Figures are {communityRates.attribution}. {communityRates.disclaimer} The 30-day window is{" "}
        {window30.from} to {window30.to}, as of {formatAsOf()}. A public cell appears only when N is at least{" "}
        {communityRates.thresholds.publicMinN}. Charts mark a sample of {communityRates.thresholds.chartMinN} to{" "}
        {communityRates.thresholds.publicMinN - 1} as small. Displayed rates are rounded to the nearest 0.05.
        Prime assumed for variable effective rates is {communityRates.prime.toFixed(2)}%.{" "}
        <a href="/methodology/" className="font-semibold text-teal-800 underline">
          Read the methodology
        </a>
        .
      </p>
    </aside>
  );
}
