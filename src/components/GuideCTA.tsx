import {
  buildGuideBuyUrl,
  buildGuidePageUrl,
  GUIDE_BUY_LABEL_COMPACT,
  GUIDE_BUY_LABEL_FULL,
  GUIDE_CONTEXTS,
  GUIDE_FULL_BODY,
  GUIDE_FULL_HEADING,
  GUIDE_MICROCOPY,
  type GuideContext,
} from "@/lib/guide";

interface GuideCTAProps {
  variant?: "compact" | "full";
  className?: string;
  lenderName?: string;
  context?: GuideContext;
  utmMedium?: string;
  utmContent?: string;
}

const buyButtonClass =
  "inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2";

export default function GuideCTA({
  variant = "full",
  className = "",
  lenderName,
  context,
  utmMedium,
  utmContent,
}: GuideCTAProps) {
  const medium = utmMedium ?? (variant === "compact" ? "cta_compact" : "cta_full");
  const content = utmContent ?? (variant === "compact" ? "compact" : "full");
  const buyUrl = buildGuideBuyUrl({ medium, content });
  const insideUrl = buildGuidePageUrl({ medium, content });
  const contextual = context ? GUIDE_CONTEXTS[context] : null;

  let heading = GUIDE_FULL_HEADING;
  let body = GUIDE_FULL_BODY;
  if (contextual) {
    heading = contextual.heading;
    body = contextual.body;
  } else if (variant === "compact") {
    heading = lenderName ? `Renewing with ${lenderName}?` : "Renewing or switching?";
    body = lenderName
      ? `Word-for-word scripts and worksheets to ask ${lenderName} for a better rate.`
      : "Word-for-word scripts and worksheets to ask for a better rate.";
  }

  const buyLabel = variant === "full" && !contextual ? GUIDE_BUY_LABEL_FULL : GUIDE_BUY_LABEL_COMPACT;

  if (variant === "compact") {
    return (
      <div className={`rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 ${className}`}>
        <h2 className="text-base font-bold text-slate-900">{heading}</h2>
        <p className="mt-1 text-sm text-slate-600">{body}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <a href={buyUrl} className={buyButtonClass}>
            {buyLabel}
          </a>
          <a href={insideUrl} className="text-sm font-semibold text-amber-800 hover:text-amber-950">
            What's inside →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 p-6 text-white ${className}`}>
      <h2 className="text-lg font-bold">{heading}</h2>
      <p className="mt-2 text-sm text-slate-300">{body}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a href={buyUrl} className={buyButtonClass}>
          {buyLabel}
        </a>
        <a
          href={insideUrl}
          className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
        >
          See what's inside
        </a>
      </div>
      <p className="mt-3 text-xs text-slate-400">{GUIDE_MICROCOPY}</p>
    </div>
  );
}
