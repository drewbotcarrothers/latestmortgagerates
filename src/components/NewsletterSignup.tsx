import { useEffect, useId, useRef, useState } from "react";

/**
 * Hostinger Reach inline form (double opt-in, thank-you redirect set in Reach).
 * The form template already renders an h1 and the same subtext inside its iframe,
 * so this wrapper stays visual and does not add another heading.
 */
const FORM_ID = "0aff7137-20b2-444f-a443-b8bd0887758a";
const EMBED_SRC = "https://cdn-reach.hostinger.com/js/embed.js";
const HEADING = "Get the monthly mortgage rate report";
const SUBTEXT =
  "Lowest posted rates plus what Canadians actually got below posted. One email a month. Unsubscribe anytime.";

type NewsletterSignupProps = {
  /** Full-width navy band (homepage) or an in-page card. */
  variant?: "band" | "card";
  /** Set on the homepage so the rate banner can scroll here. Omit elsewhere. */
  anchorId?: string;
};

let embedPromise: Promise<void> | null = null;

function loadEmbedScript(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${EMBED_SRC}"]`);
  if (existing?.dataset.loaded === "true") return Promise.resolve();
  if (embedPromise) return embedPromise;

  embedPromise = new Promise((resolve, reject) => {
    const script = existing ?? document.createElement("script");
    const finish = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    const fail = () => {
      embedPromise = null;
      script.remove();
      reject(new Error("Reach embed failed to load"));
    };
    script.addEventListener("load", finish, { once: true });
    script.addEventListener("error", fail, { once: true });
    if (!existing) {
      script.src = EMBED_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return embedPromise;
}

export default function NewsletterSignup({ variant = "card", anchorId }: NewsletterSignupProps) {
  const rootRef = useRef<HTMLElement>(null);
  const fallbackId = useId();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cancelled = false;
    let timer = 0;

    const start = () => {
      timer = window.setTimeout(() => {
        if (!cancelled && !root.querySelector("iframe")) setFailed(true);
      }, 12000);

      loadEmbedScript()
        .then(() => {
          window.clearTimeout(timer);
          if (cancelled) return;
          const mounted = Boolean(root.querySelector("iframe"));
          setReady(mounted);
          setFailed(!mounted);
        })
        .catch(() => {
          window.clearTimeout(timer);
          if (!cancelled) setFailed(true);
        });
    };

    if (!("IntersectionObserver" in window)) {
      start();
      return () => {
        cancelled = true;
        window.clearTimeout(timer);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          start();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [attempt]);

  const shell =
    variant === "band"
      ? "bg-slate-900 py-12 text-white md:py-16"
      : "rounded-xl bg-slate-900 p-6 text-white shadow-sm md:p-8";

  return (
    <section ref={rootRef} id={anchorId} aria-label="Email newsletter" className={shell}>
      <div className={variant === "band" ? "mx-auto max-w-xl px-4" : "mx-auto max-w-xl"}>
        {!ready && !failed && (
          <p className="mb-3 text-center text-sm text-slate-300">Loading the signup form…</p>
        )}
        <div
          className={`overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-teal-600/30 ${failed ? "hidden" : ""}`}
        >
          <div data-reach-form={FORM_ID} className="min-h-[28rem] [&_iframe]:min-h-[28rem] [&_iframe]:w-full" />
        </div>

        {failed && (
          <div id={fallbackId} className="rounded-xl bg-white p-6 text-slate-800 shadow-lg ring-1 ring-teal-600/30">
            <h2 className="text-2xl font-bold text-slate-900">{HEADING}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{SUBTEXT}</p>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              The signup form didn&apos;t load.{" "}
              <button
                type="button"
                className="font-semibold text-teal-700 underline decoration-teal-700/30 underline-offset-2 hover:text-teal-800"
                onClick={() => {
                  setFailed(false);
                  setAttempt((value) => value + 1);
                }}
              >
                Try again
              </button>{" "}
              or{" "}
              <a
                className="font-semibold text-teal-700 underline decoration-teal-700/30 underline-offset-2 hover:text-teal-800"
                href="mailto:privacy@latestmortgagerates.ca?subject=Monthly%20mortgage%20rate%20report"
              >
                email us to join the monthly report
              </a>
              .
            </p>
          </div>
        )}

        <noscript>
          <div className="rounded-xl bg-white p-6 text-slate-800 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900">{HEADING}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{SUBTEXT}</p>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              JavaScript is required to show the signup form.{" "}
              <a
                className="font-semibold text-teal-700 underline"
                href="mailto:privacy@latestmortgagerates.ca?subject=Monthly%20mortgage%20rate%20report"
              >
                Email us to join the monthly report
              </a>
              .
            </p>
          </div>
        </noscript>
      </div>
    </section>
  );
}
