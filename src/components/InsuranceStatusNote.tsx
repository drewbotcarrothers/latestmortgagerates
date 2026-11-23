import { INSURED_UNINSURED_EXPLANATION } from "@/lib/mortgageTypeCopy";

/** One-time explanation. Place it at the first mention on a page, not on every row. */
export default function InsuranceStatusNote({
  className = "",
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "onDark";
}) {
  const color = tone === "onDark" ? "text-slate-200" : "text-slate-600";
  return <p className={`text-sm leading-relaxed ${color} ${className}`}>{INSURED_UNINSURED_EXPLANATION}</p>;
}
