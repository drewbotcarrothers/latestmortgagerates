import type { PaymentHookModel } from "@/lib/homepageRates";
import { formatCad } from "@/lib/homepageRates";

interface PaymentHookProps {
  hook: PaymentHookModel;
  onCalculatorClick: (source: "payment_hook" | "hero") => void;
}

export default function PaymentHook({ hook, onCalculatorClick }: PaymentHookProps) {
  return (
    <aside
      aria-label="Sample monthly payment"
      className="relative z-10 -mt-8 flex flex-col items-stretch justify-between gap-4 rounded-[14px] border border-slate-200 bg-white p-4 shadow-md sm:flex-row sm:items-center sm:p-5 dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex min-w-0 items-start gap-3.5">
        <div
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] bg-cyan-50 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-200"
          aria-hidden="true"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 4l9 6.5M5 10v9h14v-9M9 19v-5h6v5" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-[1.0625rem] font-semibold leading-snug tracking-tight text-slate-900 dark:text-white">
            On a {formatCad(hook.principal)} mortgage <span className="whitespace-nowrap">(25-yr amort.)</span>,{" "}
            <a
              href="/tools/mortgage-calculator/"
              onClick={() => onCalculatorClick("hero")}
              className="rounded-sm font-extrabold text-cyan-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:text-cyan-300"
            >
              {hook.rateLabel}
            </a>{" "}
            is ~
            <strong className="whitespace-nowrap font-extrabold text-cyan-800 dark:text-cyan-300">
              {hook.monthlyLabel}/mo
            </strong>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Lowest published 5-year fixed from {hook.lenderName}, {hook.mortgageTypeLabel}. Canadian semi-annual
            compounding. Estimate only.
          </p>
        </div>
      </div>
      <a
        href="/tools/mortgage-calculator/"
        onClick={() => onCalculatorClick("payment_hook")}
        className="btn-primary w-full shrink-0 sm:w-auto"
      >
        Calculate your payment →
      </a>
    </aside>
  );
}
