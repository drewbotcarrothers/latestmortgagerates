import { useEffect, useRef } from "react";
import {
  ADSENSE_CLIENT,
  isConfiguredSlot,
  pushAdSense,
  slotForFormat,
  type AdFormat,
} from "@/lib/adsense";

interface AdUnitProps {
  format?: AdFormat;
  /** Override slot ID. Prefer ADSENSE_SLOTS in src/lib/adsense.ts. */
  slot?: string;
  className?: string;
}

/**
 * Manual AdSense unit. The publisher script is loaded once in BaseLayout.
 * Push runs after mount so React hydration is not fighting a filled iframe.
 * Reserved min-height reduces CLS while the creative loads.
 */
export default function AdUnit({ format = "display", slot, className = "" }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const resolvedSlot = slot ?? slotForFormat(format);
  const minHeight = format === "sidebar" ? "min-h-[250px]" : "min-h-[280px]";

  useEffect(() => {
    const el = insRef.current;
    if (!el || pushed.current) return;
    if (el.getAttribute("data-adsbygoogle-status")) return;
    pushed.current = true;
    try {
      pushAdSense();
    } catch {
      // Script blocked, missing, or already processed this slot.
    }
  }, []);

  const insProps: Record<string, string> = {
    className: "adsbygoogle",
    "data-ad-client": ADSENSE_CLIENT,
    "data-full-width-responsive": "true",
  };

  if (format === "inArticle") {
    insProps["data-ad-format"] = "fluid";
    insProps["data-ad-layout"] = "in-article";
  } else {
    insProps["data-ad-format"] = "auto";
  }

  if (isConfiguredSlot(resolvedSlot)) {
    insProps["data-ad-slot"] = resolvedSlot;
  }

  return (
    <aside
      className={`ad-unit ${className}`.trim()}
      aria-label="Advertisement"
      data-ad-format={format}
    >
      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
        Advertisement
      </p>
      <div
        className={`${minHeight} overflow-hidden rounded-lg border border-slate-200/80 bg-slate-100/70`}
      >
        <ins
          ref={insRef}
          style={{ display: "block", minHeight: format === "sidebar" ? 250 : 280 }}
          {...insProps}
        />
      </div>
    </aside>
  );
}
