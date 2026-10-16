import { formatBuildDateLong } from "@/lib/buildDate";

export const LENDER_SOURCES =
  "Sources: the lender’s public rate pages, collected into the table on this page. Confirm the contract rate, fees, and eligibility with the lender before you apply.";

export const CITY_SOURCES =
  "Sources: national posted rates from the lenders we track, plus the provincial or municipal tax rules described on this page. Confirm any rate with the lender.";

export const RATE_HUB_SOURCES =
  "Sources: posted rates from each lender’s public rate page, shown in the table. Verify the rate and conditions with the lender.";

interface EditorialBylineProps {
  reviewedIso: string;
  sources: string;
  /** Dark heroes need light text. */
  tone?: "default" | "onDark";
}

export default function EditorialByline({
  reviewedIso,
  sources,
  tone = "default",
}: EditorialBylineProps) {
  const reviewed = formatBuildDateLong(new Date(reviewedIso));
  const name = tone === "onDark" ? "font-medium text-white" : "font-medium text-slate-700";
  const meta = tone === "onDark" ? "mt-3 text-sm text-slate-300" : "mt-3 text-sm text-slate-500";

  return (
    <p className={meta}>
      <span className={name}>By Andrew</span>
      {" · "}
      <time dateTime={reviewedIso.slice(0, 10)}>Last reviewed {reviewed}</time>
      <span className="mt-1 block">{sources}</span>
    </p>
  );
}
