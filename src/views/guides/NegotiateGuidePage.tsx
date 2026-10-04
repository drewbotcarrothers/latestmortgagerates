import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import GuideCTA from "@/components/GuideCTA";
import FAQSection from "@/components/FAQSection";
import HowToSchema from "@/components/HowToSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import BankGapChart, { bankGapRows, omittedPostedNotes } from "@/components/community/BankGapChart";
import CommunityDisclaimer from "@/components/community/CommunityDisclaimer";
import {
  BIG5_SLUGS,
  communityRates,
  formatAsOf,
  formatRate,
  formatSpread,
  illustrativeMonthlySavings,
  lenderName,
  publicLenderProducts,
  termLabel,
} from "@/lib/communityRates";

const STEPS = [
  {
    name: "Get the offer in writing",
    text: "Ask for the term, fixed or variable, insured status, prepayment terms, and the penalty method before you compare the rate.",
  },
  {
    name: "Place it against reported rates",
    text: "Use the renewal offer checker to see where the offer sits versus rates people report for that term and type, and versus the bank's posted rate.",
  },
  {
    name: "Get a competing quote",
    text: "Ask a mortgage broker and at least one other lender for the same term. Take the competing number back to your current bank.",
  },
  {
    name: "Ask the bank to move",
    text: "Request a match to the reported median for that product, or a written reason the offer sits above it. Mention you are comparing posted rates from other lenders.",
  },
  {
    name: "Compare the whole contract",
    text: "A lower rate with a harsh break fee or tight prepayment can cost more if you sell or refinance. Price the penalty before you accept.",
  },
];

export default function NegotiateGuidePage() {
  const rows = bankGapRows();
  const widest = rows
    .filter((row) => row.product.n >= communityRates.thresholds.publicMinN && row.product.spreadVsPosted != null && row.product.postedRate != null)
    .sort((a, b) => (b.product.spreadVsPosted ?? 0) - (a.product.spreadVsPosted ?? 0))[0];
  const savings = widest
    ? illustrativeMonthlySavings(widest.product.postedRate as number, widest.product.reportedMedian)
    : null;
  const omitted = omittedPostedNotes();

  const faqs = [
    {
      question: "How much below posted can you negotiate on a Canadian mortgage?",
      answer: widest
        ? `It depends on the bank and the product. The widest gap we publish (N at least ${communityRates.thresholds.publicMinN}) is ${lenderName(widest.lenderSlug)} ${termLabel(widest.product.termMonths)} ${widest.product.rateType}: posted ${formatRate(widest.product.postedRate)} versus a reported median of ${formatRate(widest.product.reportedMedian)} (N = ${widest.product.n}), ${formatSpread(widest.product.spreadVsPosted)} that posted rate. As of ${formatAsOf()}.`
        : `We publish a gap only when at least ${communityRates.thresholds.publicMinN} people report a rate from that bank and the snapshot has a posted rate.`,
    },
    {
      question: "Should I use a broker or negotiate with the bank?",
      answer: "Do both. A bank discount usually appears after you ask, especially at renewal. A broker can shop lenders whose posted rates are already near the bottom of the market, and that quote is leverage with your current bank. Neither path is an offer from this site.",
    },
    {
      question: "Is a rate people report the rate I will be offered?",
      answer: `${communityRates.disclaimer} Reports are ${communityRates.attribution}. Your credit, equity, insured status, and the day you apply all change the rate. Use the median as a reference point for the conversation, then confirm the rate with the lender.`,
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Negotiate your mortgage rate" },
        ]}
      />
      <HowToSchema
        name="How to negotiate a Canadian mortgage rate below posted"
        description="Compare a renewal offer with rates Canadian borrowers report and with the bank's posted rate, then ask for a better number."
        totalTime="PT30M"
        steps={STEPS}
      />
      <main className="min-h-screen bg-slate-50">
        <Header currentPage="negotiate" />
        <article>
          <section className="hero-gradient text-white">
            <div className="mx-auto max-w-7xl px-4 py-12">
              <nav className="mb-4 text-sm text-teal-200" aria-label="Breadcrumb">
                <a href="/" className="hover:text-white">Home</a>
                <span className="mx-2">/</span>
                <span>Negotiate</span>
              </nav>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight">How much below posted can you negotiate?</h1>
              <p className="mt-4 max-w-3xl text-lg text-slate-200">
                Big-bank posted rates are a shelf price. The rates {communityRates.attribution} show how far under that shelf recent approvals and renewals have landed. As of {formatAsOf()}.
              </p>
            </div>
          </section>

          <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
            <CommunityDisclaimer />

            <section>
              <h2 className="text-2xl font-bold text-slate-900">Posted vs what people at that bank report</h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Each row is one bank and one term. The navy dot is the bank&apos;s uninsured posted rate in today&apos;s snapshot. The teal dot is the median rate people report receiving from that bank over the last 30 days. A public discussion of the gap uses rows with N of at least {communityRates.thresholds.publicMinN}. Smaller rows stay on the chart only with a small-sample label.
              </p>
              <div className="mt-6">
                <BankGapChart rows={rows} />
              </div>
              {omitted.length > 0 && (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {omitted.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              )}
              {widest && savings != null && (
                <p className="mt-4 rounded-xl bg-white p-4 text-sm leading-relaxed text-slate-700 border border-slate-200">
                  Illustration, not a quote. On a $500,000 mortgage amortized over 25 years, the gap between {lenderName(widest.lenderSlug)}&apos;s posted {formatRate(widest.product.postedRate)} and the reported median of {formatRate(widest.product.reportedMedian)} (N = {widest.product.n}) is about ${Math.round(savings).toLocaleString("en-CA")} a month. Both rates are rounded to the nearest 0.05. Your balance, amortization, and payment frequency will differ.
                </p>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">Rates we can publish, by bank</h2>
              <div className="mt-4 space-y-4">
                {BIG5_SLUGS.map((slug) => {
                  const lender = communityRates.lenders.find((item) => item.slug === slug);
                  const products = lender ? publicLenderProducts(lender) : [];
                  return (
                    <div key={slug} className="rounded-xl border border-slate-200 bg-white p-4">
                      <h3 className="font-semibold text-slate-900">
                        <a href={`/lenders/${slug}/`} className="text-teal-700 hover:underline">{lenderName(slug)}</a>
                      </h3>
                      {products.length === 0 ? (
                        <p className="mt-2 text-sm text-slate-600">
                          No {lenderName(slug)} product currently has both N of at least {communityRates.thresholds.publicMinN} and a posted rate in the snapshot.
                        </p>
                      ) : (
                        <ul className="mt-2 space-y-1 text-sm text-slate-700">
                          {products.map((product) => (
                            <li key={`${product.termMonths}-${product.rateType}`}>
                              {termLabel(product.termMonths)} {product.rateType}: reported {formatRate(product.reportedMedian)} vs posted {formatRate(product.postedRate)} (N = {product.n}), {formatSpread(product.spreadVsPosted)} posted.
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">A renewal conversation, step by step</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-700">
                {STEPS.map((step) => (
                  <li key={step.name}>
                    <span className="font-semibold text-slate-900">{step.name}. </span>
                    {step.text}
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-slate-700">
                Start with the{" "}
                <a href="/tools/renewal-offer-checker/" className="font-medium text-teal-700 hover:underline">renewal offer checker</a>
                {" "}and the{" "}
                <a href="/real-mortgage-rates/" className="font-medium text-teal-700 hover:underline">real mortgage rates</a>
                {" "}table, then read the live posted rates on the{" "}
                <a href="/" className="font-medium text-teal-700 hover:underline">rate comparison</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">Broker vs bank</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="font-semibold text-slate-900">At the bank</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    The posted rate is the number on the shelf. Retention desks often move when a customer has another approval in hand, especially in the four months before renewal. The gaps above are the room other customers have already found, not a promise that the same discount is open today.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="font-semibold text-slate-900">With a broker</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    A broker can quote lenders that do not keep a branch posted rate at all. Those quotes are often already close to the lowest posted rate on our comparison. Use one as the competing number in step 3, then decide whether switching costs beat the payment difference. The{" "}
                    <a href="/tools/mortgage-renewal-calculator/" className="font-medium text-teal-700 hover:underline">renewal calculator</a>{" "}
                    prices that tradeoff.
                  </p>
                </div>
              </div>
            </section>

            <GuideCTA />
            <AdUnit format="display" />
            <FAQSection faqs={faqs} title="Negotiation questions" />
          </div>
        </article>
        <Footer />
      </main>
    </>
  );
}
