import {
  BenefitList,
  ExploreLinks,
  InboxTip,
  PrivacyNote,
  SubscribeFrame,
} from "@/components/SubscribeStatus";

export default function ConfirmedPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <SubscribeFrame>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            Email list
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            You&apos;re subscribed!
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Thanks for confirming. You&apos;re on the Latest Mortgage Rates Canada list for Canadian mortgage rate updates.
          </p>
        </div>

        <section className="mt-10" aria-labelledby="subscribe-benefits">
          <h2 id="subscribe-benefits" className="text-xl font-bold text-slate-900 dark:text-white">
            What you&apos;ll get
          </h2>
          <div className="mt-4">
            <BenefitList />
          </div>
        </section>

        <section className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2" aria-labelledby="subscribe-cadence">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 id="subscribe-cadence" className="text-xl font-bold text-slate-900 dark:text-white">
              How often
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
              Weekly. One email a week covers the rate roundup, Bank of Canada decision recaps, and rate-drop alerts.
            </p>
          </div>
          <InboxTip />
        </section>

        <section className="mt-10" aria-labelledby="subscribe-next">
          <h2 id="subscribe-next" className="text-xl font-bold text-slate-900 dark:text-white">
            Keep exploring
          </h2>
          <div className="mt-4">
            <ExploreLinks />
          </div>
        </section>

        <p className="mt-10 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Still waiting on the confirmation email?{" "}
          <a
            href="/subscribe/thank-you/"
            className="font-semibold text-teal-700 underline decoration-teal-700/30 underline-offset-2 hover:text-teal-800 dark:text-teal-300"
          >
            Check your inbox to confirm
          </a>
          .
        </p>
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
          <PrivacyNote />
        </div>
      </SubscribeFrame>
    </main>
  );
}
