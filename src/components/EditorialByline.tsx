import { formatBuildDateLong } from "@/lib/buildDate";

export const LENDER_SOURCES =
  "Sources: the lender’s public rate pages, collected into the table on this page. Confirm the contract rate, fees, and eligibility with the lender before you apply.";

export const CITY_SOURCES =
  "Sources: national posted rates from the lenders we track, plus the provincial or municipal tax rules described on this page. Confirm any rate with the lender.";

export const RATE_HUB_SOURCES =
  "Sources: posted rates from each lender’s public rate page, shown in the table. Verify the rate and conditions with the lender.";

interface EditorialBylineProps {
  reviewedIso: string;
  /** When set, a visible "Updated <date>" line is shown next to the byline. */
  updatedIso?: string;
  sources: string;
  /** Dark heroes need light text. */
  tone?: "default" | "onDark";
}

/** Noon UTC keeps a date-only value on the same calendar day in Toronto. */
function dateForDisplay(iso: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return new Date(`${iso}T12:00:00Z`);
  return new Date(iso);
}

export default function EditorialByline({
  reviewedIso,
  updatedIso,
  sources,
  tone = "default",
}: EditorialBylineProps) {
  const reviewed = formatBuildDateLong(dateForDisplay(reviewedIso));
  const name = tone === "onDark" ? "font-medium text-white" : "font-medium text-slate-700";
  const meta = tone === "onDark" ? "mt-3 text-sm text-slate-300" : "mt-3 text-sm text-slate-500";

  return (
    <p className={meta}>
      <span className={name}>
        By <a href="/author/andrew/" className="hover:underline">Andrew</a>
      </span>
      {" · "}
      <time dateTime={reviewedIso.slice(0, 10)}>Last reviewed {reviewed}</time>
      {updatedIso ? (
        <span className="mt-1 block">
          <time dateTime={updatedIso.slice(0, 10)}>{`Updated ${formatBuildDateLong(dateForDisplay(updatedIso))}`}</time>
        </span>
      ) : null}
      <span className="mt-1 block">{sources}</span>
    </p>
  );
}
