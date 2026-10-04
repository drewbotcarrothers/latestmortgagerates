import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const BENEFITS = [
  {
    title: "Lowest posted rates",
    body: "The lowest posted fixed and variable rates from Canadian lenders, once a month.",
  },
  {
    title: "What Canadians report getting below posted",
    body: "Rates people report actually getting, next to the posted numbers.",
  },
  {
    title: "Bank of Canada recaps",
    body: "What the latest rate announcement means for payments and renewals.",
  },
];

const NEXT_STEPS = [
  {
    href: "/",
    title: "Today's rates",
    body: "Compare current posted rates from Canadian lenders.",
    cta: "View today's rates",
  },
  {
    href: "/real-mortgage-rates/",
    title: "Real mortgage rates",
    body: "See rates people report getting, next to the posted numbers.",
    cta: "See real mortgage rates",
  },
  {
    href: "/mortgage-guide/",
    title: "Mortgage Guide ebook",
    body: "A practical guide to negotiating a better deal on your next mortgage.",
    cta: "Open the Mortgage Guide",
  },
];

export function SubscribeFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-16">{children}</div>
      <Footer />
    </>
  );
}

export function BenefitList() {
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {BENEFITS.map((item) => (
        <li
          key={item.title}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function InboxTip() {
  return (
    <aside className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/60 dark:bg-amber-950/40">
      <h2 className="text-base font-semibold text-slate-900 dark:text-amber-100">Find the email</h2>
      <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-amber-50/90">
        Add the sender to your contacts so later notes land in your inbox. If the first message is missing, check the Promotions folder and your spam folder.
      </p>
    </aside>
  );
}

export function ExploreLinks() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {NEXT_STEPS.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:border-slate-700 dark:bg-slate-800"
          >
            <span className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</span>
            <span className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</span>
            <span className="mt-4 text-sm font-semibold text-teal-700 dark:text-teal-300">{item.cta} →</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function PrivacyNote() {
  return (
    <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
      We use your email only to send these updates. Read the{" "}
      <a href="/privacy/" className="font-medium text-teal-700 underline decoration-teal-700/30 underline-offset-2 hover:text-teal-800 dark:text-teal-300">
        privacy policy
      </a>
      . You can unsubscribe anytime.
    </p>
  );
}
