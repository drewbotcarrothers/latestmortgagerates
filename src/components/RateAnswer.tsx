import { lenderList, postedSentence, rateSnapshot, type RateSnapshot } from "@/lib/rateSnapshot";

type Focus = "hub" | "fixed" | "variable";

function productSentence(
  label: "5-year fixed" | "5-year variable",
  side: RateSnapshot["fixed"]
): string {
  if (!side.lowest) return `Today's file has no published ${label} rate.`;
  const who = lenderList(side.lowest.lenders);
  const insured =
    side.lowest.mortgageType === "insured" || side.lowest.mortgageType === "uninsured"
      ? ` (${side.lowest.mortgageType})`
      : "";
  return `the lowest published ${label} is ${side.lowest.label} from ${who}${insured}`;
}

function reportedClause(label: string, reported: RateSnapshot["fixed"]["reported"]): string {
  if (!reported) return "";
  return ` The borrower-reported median for ${label} is ${reported.label} (N = ${reported.n}), ${rateSnapshot.attribution}.`;
}

export default function RateAnswer({ focus }: { focus: Focus }) {
  const snap = rateSnapshot;
  let first = "";
  let second = "";

  if (focus === "hub") {
    first = `As of ${snap.asOfLabel}, ${productSentence("5-year fixed", snap.fixed)}, and ${productSentence("5-year variable", snap.variable)}.`;
    const fixedReported = snap.fixed.reported
      ? `${snap.fixed.reported.label} on 5-year fixed (N = ${snap.fixed.reported.n})`
      : "not published for 5-year fixed because the sample is under 10";
    const variableReported = snap.variable.reported
      ? `${snap.variable.reported.label} on 5-year variable (N = ${snap.variable.reported.n})`
      : "not published for 5-year variable because the sample is under 10";
    second = `${postedSentence("5-year fixed", snap.fixed.big5Posted)} ${postedSentence("5-year variable", snap.variable.big5Posted)} Borrower-reported medians, ${snap.attribution}, are ${fixedReported} and ${variableReported}. Those reported medians are a separate file from the published specials above.`;
  } else if (focus === "fixed") {
    first = `As of ${snap.asOfLabel}, ${productSentence("5-year fixed", snap.fixed)}.`;
    second = `${postedSentence("5-year fixed", snap.fixed.big5Posted)}${reportedClause("5-year fixed", snap.fixed.reported)} The reported figure is not an average of the published specials.`;
  } else {
    first = `As of ${snap.asOfLabel}, ${productSentence("5-year variable", snap.variable)}.`;
    second = `${postedSentence("5-year variable", snap.variable.big5Posted)}${reportedClause("5-year variable", snap.variable.reported)} The reported figure is not an average of the published specials.`;
  }

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 mb-8 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-2">Mortgage rates today</h2>
      <p className="text-slate-700 leading-relaxed">{first}</p>
      <p className="text-slate-700 leading-relaxed mt-2">{second}</p>
      <p className="text-sm text-slate-600 mt-3">
        Mortgage rates in B.C. use the same national products. See{" "}
        <a href="/cities/vancouver/" className="text-teal-700 font-medium hover:underline">
          Vancouver mortgage rates
        </a>{" "}
        and{" "}
        <a href="/cities/victoria/" className="text-teal-700 font-medium hover:underline">
          Victoria mortgage rates
        </a>
        .
      </p>
    </section>
  );
}
