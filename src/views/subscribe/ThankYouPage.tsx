import { ExploreLinks, InboxTip, PrivacyNote, SubscribeFrame } from "@/components/SubscribeStatus";

const STEPS = [
  "Open the confirmation email from Latest Mortgage Rates.",
  "Click Confirm your email in that message.",
  "You're subscribed. The monthly mortgage rate report starts after that.",
];

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <SubscribeFrame>
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            Email list
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Check your inbox to confirm
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            One more step. We sent a confirmation email so we know this address is yours. You won&apos;t be subscribed until you click the button in that email.
          </p>
        </div>

        <section className="mt-10" aria-labelledby="confirm-steps">
          <h2 id="confirm-steps" className="text-xl font-bold text-slate-900 dark:text-white">
            Confirm your email
          </h2>
          <ol className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <li
                key={step}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-8 text-base leading-7 text-slate-700 dark:text-slate-200">
          Already confirmed?{" "}
          <a
            href="/subscribe/confirmed/"
            className="font-semibold text-teal-700 underline decoration-teal-700/30 underline-offset-2 hover:text-teal-800 dark:text-teal-300"
          >
            You&apos;re subscribed — see what you&apos;ll get
          </a>
          .
        </p>

        <div className="mt-8">
          <InboxTip />
        </div>

        <section className="mt-10" aria-labelledby="while-you-wait">
          <h2 id="while-you-wait" className="text-xl font-bold text-slate-900 dark:text-white">
            While you wait
          </h2>
          <div className="mt-4">
            <ExploreLinks />
          </div>
        </section>

        <div className="mt-10 border-t border-slate-200 pt-4 dark:border-slate-700">
          <PrivacyNote />
        </div>
      </SubscribeFrame>
    </main>
  );
}
