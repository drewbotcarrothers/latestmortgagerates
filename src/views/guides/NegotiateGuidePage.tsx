import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import GuideCTA from "@/components/GuideCTA";
import FAQSection from "@/components/FAQSection";
import HowToSchema from "@/components/HowToSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import EditorialByline from "@/components/EditorialByline";
import BankGapChart, { bankGapRows, omittedPostedNotes } from "@/components/community/BankGapChart";
import CommunityDisclaimer from "@/components/community/CommunityDisclaimer";
import JsonLd from "@/components/JsonLd";
import { negotiateAnswerLead, negotiateGuide } from "@/content/guides/negotiateMeta";
import {
  NEGOTIATE_RATE_VIDEO,
  NEGOTIATE_SERIES_EARLIER,
  negotiateRateVideoId,
} from "@/content/guides/negotiateVideo";
import { articleJsonLd } from "@/lib/articleSchema";
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
  type ProductCell,
} from "@/lib/communityRates";
import { DISCOUNT_MIN_N, discountRows, withSnapshotPostedRates } from "@/lib/discountByBank";
import { formatPct } from "@/lib/dataFormat";
import { publishedRates } from "@/lib/publishedRates";

const FCAC_RENEW = "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/renew-mortgage.html";
const REPORT_PATH = "/blog/below-the-line-mortgage-rate-report-october-2026/";

const STEPS = [
  {
    name: "Get the offer in writing",
    text: "Ask for the term, fixed or variable, insured status, the date the new rate starts, prepayment terms, and the penalty method before you compare the rate. A renewal statement from a federally regulated lender is due at least 21 days before maturity. It is that lender's offer, not a survey of the market.",
  },
  {
    name: "Place it against reported rates",
    text: "Use the renewal offer checker to see where the offer sits versus rates people report for that term and type. Use the discount table for the gap below that bank's own posted 5-year rate, when at least 10 people have reported it.",
  },
  {
    name: "Get a competing quote",
    text: "Ask a mortgage broker and at least one other lender for the same term, the same insured status, and a similar prepayment privilege. Take the competing number back in writing.",
  },
  {
    name: "Ask the bank to move",
    text: "Request a match to the competing quote, or a written reason the offer sits above the reported median for that product. The posted rate is the shelf. The discount is what you are asking them to put in the contract.",
  },
  {
    name: "Compare the whole contract",
    text: "A lower rate with a harsh break fee or tight prepayment can cost more if you sell or refinance. Price the penalty, and price blend-and-extend against waiting until maturity, before you accept.",
  },
];

function publicCell(termMonths: number, rateType: "fixed" | "variable", insured: string): ProductCell | undefined {
  return communityRates.windows["30d"].products.find(
    (product) =>
      product.termMonths === termMonths &&
      product.rateType === rateType &&
      product.insured === insured &&
      product.n >= communityRates.thresholds.publicMinN,
  );
}

function gapLabel(pointsBelow: number, postedRate: number): string {
  const direction = pointsBelow >= 0 ? "below" : "above";
  return `${Math.abs(pointsBelow).toFixed(2)} percentage points ${direction} ${formatPct(postedRate)}`;
}

export default function NegotiateGuidePage({ children }: { children?: ReactNode }) {
  const lead = negotiateAnswerLead();
  const shelfLenders = withSnapshotPostedRates(communityRates.lenders, publishedRates);
  const discountTable = discountRows(shelfLenders, communityRates.lenderNames);
  const publishedDiscount = discountTable.filter((row) => row.fixed || row.variable);
  const fixedPublished = publishedDiscount.some((row) => row.fixed);
  const rows = bankGapRows();
  const widest = rows
    .filter((row) => row.product.n >= communityRates.thresholds.publicMinN && row.product.spreadVsPosted != null && row.product.postedRate != null)
    .sort((a, b) => (b.product.spreadVsPosted ?? 0) - (a.product.spreadVsPosted ?? 0))[0];
  const savings = widest
    ? illustrativeMonthlySavings(widest.product.postedRate as number, widest.product.reportedMedian)
    : null;
  const omitted = omittedPostedNotes();
  const window30 = communityRates.windows["30d"];
  const fixedUninsured = publicCell(60, "fixed", "uninsured");
  const variableUnknown = publicCell(60, "variable", "unknown");
  const videoId = negotiateRateVideoId();

  const faqs = [
    {
      question: "How much below posted can you negotiate on a Canadian mortgage?",
      answer: `${lead.first} ${lead.second} ${
        widest
          ? `The widest bank-and-term gap we publish (N at least ${communityRates.thresholds.publicMinN}) is ${lenderName(widest.lenderSlug)} ${termLabel(widest.product.termMonths)} ${widest.product.rateType}: posted ${formatRate(widest.product.postedRate)} versus a reported median of ${formatRate(widest.product.reportedMedian)} (N = ${widest.product.n}), ${formatSpread(widest.product.spreadVsPosted)} that posted rate.`
          : `We publish a bank gap only when at least ${communityRates.thresholds.publicMinN} people report a rate from that bank and the snapshot has a posted rate.`
      }`,
    },
    {
      question: "Why is a bank missing from the 5-year discount table?",
      answer: `A cell is published only when at least ${DISCOUNT_MIN_N} people report that 5-year product from that bank and the file has the bank's own posted rate. ${
        fixedPublished
          ? "Fixed cells that clear the bar are in the table."
          : "No lender currently clears that bar on 5-year fixed, so the fixed column is empty."
      } The same rule is on the discount-by-bank report. A blank cell is a missing sample, not a promise that the bank does not discount.`,
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
      <JsonLd
        data={articleJsonLd({
          headline: negotiateGuide.headline,
          description: negotiateGuide.description,
          datePublished: negotiateGuide.publishedIso,
          dateModified: negotiateGuide.updatedDate,
          url: `https://latestmortgagerates.ca${negotiateGuide.path}`,
        })}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Guides", url: "/guides/" },
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
                <a href="/guides/" className="hover:text-white">Guides</a>
                <span className="mx-2">/</span>
                <span>Negotiate</span>
              </nav>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight">How much below posted can you negotiate?</h1>
              <EditorialByline
                reviewedIso={negotiateGuide.reviewedIso}
                updatedIso={negotiateGuide.updatedDate}
                sources={negotiateGuide.sourcesLine}
                tone="onDark"
              />
              <p className="mt-4 max-w-3xl text-lg text-slate-200">{lead.first} {lead.second}</p>
            </div>
          </section>

          <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
            <CommunityDisclaimer />

            <section>
              <h2 className="text-2xl font-bold text-slate-900">What that median is for</h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                The 5-year fixed median in the lead is one cell: a term of 60 months, fixed, insured status not stated, in the 30-day window from {formatAsOf(window30.from)} to {formatAsOf(window30.to)} ({window30.usableRecords.toLocaleString("en-CA")} usable reports). It is not an average of the specials on the <a href="/" className="font-medium text-teal-700 hover:underline">homepage</a>, and it is not the rate on your renewal letter. Take it into the call as a reference. Your credit, equity, province, and insured status still move the number.
              </p>
              <p className="mt-3 text-slate-700 leading-relaxed">
                {fixedUninsured
                  ? `Where people stated that the mortgage was uninsured, the 5-year fixed median is ${formatRate(fixedUninsured.median)} (N = ${fixedUninsured.n}). `
                  : ""}
                {variableUnknown && variableUnknown.big5PostedMedian != null
                  ? `The 5-year variable median in the same window, insured status not stated, is ${formatRate(variableUnknown.median)} (N = ${variableUnknown.n}), against a Big Five posted median of ${formatRate(variableUnknown.big5PostedMedian)}. `
                  : ""}
                Posted rates and reported rates stay in separate files. Do not average them. The distribution is on <a href="/real-mortgage-rates/" className="font-medium text-teal-700 hover:underline">real mortgage rates</a>. The written month is the <a href={REPORT_PATH} className="font-medium text-teal-700 hover:underline">October 2026 below-the-line report</a>.
              </p>
              <p className="mt-3 text-slate-700 leading-relaxed">
                The gap to ask a specific bank about is that bank&apos;s own posted rate minus the median people report receiving from that bank. The table below is that gap for 5-year fixed and 5-year variable. A posted rate is the shelf. A special is the lower number in the advertisement. A contract rate can sit below the special. The <a href="/guides/posted-vs-discounted-mortgage-rates/" className="font-medium text-teal-700 hover:underline">posted versus discounted guide</a> separates those three. Subtracting the advertised discount and this reported gap, and calling the result your offer, counts the same room twice.
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-4">
              <h2 className="text-2xl font-bold text-slate-900">Discount below each bank&apos;s posted rate</h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Rates here are {communityRates.attribution}. They are unverified and not a mortgage offer.
                A cell is published only when N is at least {DISCOUNT_MIN_N} and the file has that lender&apos;s own posted rate for the same 5-year product.
                Where the rate snapshot has an uninsured posted shelf, that shelf is the posted rate. The gap is the posted rate minus the reported median, rounded to the nearest 0.05. A positive number means the reported median is below posted.
                This is the same table as the <a href="/reports/discount-by-bank/" className="font-medium text-teal-700 hover:underline">discount-by-bank report</a>.
              </p>
              {fixedPublished ? (
                <p className="mt-3 text-slate-700 leading-relaxed">Five-year fixed gaps are published only for lenders that clear the same count.</p>
              ) : (
                <p className="mt-3 text-slate-700 leading-relaxed">
                  No lender has {DISCOUNT_MIN_N} or more self-reported 5-year fixed rates with a posted rate in the file, so no 5-year fixed gap is published.
                </p>
              )}
              {publishedDiscount.length === 0 ? (
                <p className="mt-4 text-slate-700">No lender currently has both N of at least {DISCOUNT_MIN_N} and a posted 5-year rate, so the table is empty.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2 pr-4 font-medium">Lender</th>
                        <th className="py-2 pr-4 font-medium">5-year fixed</th>
                        <th className="py-2 pr-4 font-medium">N</th>
                        <th className="py-2 pr-4 font-medium">5-year variable</th>
                        <th className="py-2 font-medium">N</th>
                      </tr>
                    </thead>
                    <tbody>
                      {publishedDiscount.map((row) => (
                        <tr key={row.slug} className="border-b border-slate-100">
                          <td className="py-2 pr-4 font-medium text-slate-900">
                            <a href={`/lenders/${row.slug}/`} className="text-teal-700 hover:underline">{row.name}</a>
                          </td>
                          <td className="py-2 pr-4 text-slate-700">{row.fixed ? gapLabel(row.fixed.pointsBelow, row.fixed.postedRate) : "—"}</td>
                          <td className="py-2 pr-4 text-slate-700">{row.fixed ? row.fixed.n : "—"}</td>
                          <td className="py-2 pr-4 text-slate-700">{row.variable ? gapLabel(row.variable.pointsBelow, row.variable.postedRate) : "—"}</td>
                          <td className="py-2 text-slate-700">{row.variable ? row.variable.n : "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="mt-3 text-sm text-slate-600">
                {communityRates.disclaimer} Read the rows next to <a href="/real-mortgage-rates/" className="font-medium text-teal-700 hover:underline">real mortgage rates</a> and the <a href="/methodology/" className="font-medium text-teal-700 hover:underline">methodology</a>.
              </p>
              {discountTable.some((row) => row.omitted.length > 0) ? (
                <div className="mt-4">
                  <h3 className="font-semibold text-slate-900">Counted, but not published as a gap</h3>
                  <p className="mt-2 text-sm text-slate-700">
                    These products have at least {DISCOUNT_MIN_N} reports and no posted rate in the file. The count is shown. The gap is not, because there is no posted shelf to subtract from.
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {discountTable.flatMap((row) =>
                      row.omitted.map((item) => (
                        <li key={`${row.slug}-${item.rateType}`}>{row.name}, 5-year {item.rateType}: N = {item.n}</li>
                      )),
                    )}
                  </ul>
                </div>
              ) : null}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">Posted vs what people at that bank report</h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                Each row is one bank and one term. The table above is 5-year only. This chart includes shorter terms that clear the smaller sample label. On a 5-year row, the navy dot is the uninsured posted shelf from the rate snapshot when that shelf exists. On a shorter term, it is the posted figure stored in the reported-rate file, which for some banks is the advertised special rather than the shelf. Ask the lender which number a penalty clause uses. A public discussion of the gap uses rows with N of at least {communityRates.thresholds.publicMinN}. Smaller rows stay on the chart only with a small-sample label.
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
              <p className="mt-3 text-slate-700 leading-relaxed">
                A product is listed when N is at least {communityRates.thresholds.publicMinN} and a posted rate is available. Five-year posted rates use the uninsured shelf from the rate snapshot when that shelf exists.
              </p>
              <div className="mt-4 space-y-4">
                {BIG5_SLUGS.map((slug) => {
                  const lender = shelfLenders.find((item) => item.slug === slug);
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
              <p className="mt-3 text-slate-700 leading-relaxed">
                <a href={FCAC_RENEW} className="font-medium text-teal-700 hover:underline">FCAC</a> says a federally regulated lender has to send the renewal statement at least 21 days before the term ends. Start earlier than that letter. About four months out, you still have time to get a second quote and to read what the new contract will cost if you leave.
              </p>
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

            <div data-negotiate-video className="space-y-3">
              {videoId && children ? children : (
                <section className="card-default p-6" aria-labelledby="negotiate-video-heading">
                  <h2 id="negotiate-video-heading" className="text-2xl font-bold text-slate-900 mb-2">{NEGOTIATE_RATE_VIDEO.heading}</h2>
                  <p className="text-slate-600">{NEGOTIATE_RATE_VIDEO.caption}</p>
                  <p className="mt-3 text-slate-700 leading-relaxed">
                    The walkthrough of these steps is the long video scheduled for {NEGOTIATE_RATE_VIDEO.scheduledLabel}. The player loads in this slot once that video is published.
                  </p>
                  <p className="mt-3 text-sm">
                    <a className="link-default" href="https://www.youtube.com/@latestmortgagerates">Latest Mortgage Rates on YouTube</a>
                  </p>
                </section>
              )}
              <p className="text-sm text-slate-600">
                Earlier long videos in this Thursday series:{" "}
                {NEGOTIATE_SERIES_EARLIER.map((video, index) => (
                  <span key={video.id}>
                    {index > 0 ? " and " : null}
                    <a href={video.href} className="font-medium text-teal-700 hover:underline">{video.label}</a>
                    {" "}({video.date})
                  </span>
                ))}
                .
              </p>
            </div>

            <AdUnit format="display" />

            <section>
              <h2 className="text-2xl font-bold text-slate-900">Broker vs bank</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="font-semibold text-slate-900">At the bank</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    The posted rate is the number on the shelf. Retention desks often move when a customer has another approval in hand, especially in the four months before renewal. The gaps above are the room other customers have already found, not a promise that the same discount is open today. The <a href="/guides/2026-mortgage-renewal-playbook/" className="font-medium text-teal-700 hover:underline">renewal playbook</a> is the timeline for that conversation.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <h3 className="font-semibold text-slate-900">With a broker</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">
                    A broker can quote lenders that do not keep a branch posted rate at all. Those quotes are often already close to the lowest posted rate on our comparison. Use one as the competing number in step 3, then decide whether switching costs beat the payment difference. The{" "}
                    <a href="/tools/mortgage-renewal-calculator/" className="font-medium text-teal-700 hover:underline">renewal calculator</a>{" "}
                    prices that tradeoff. The <a href="/guides/switching-mortgage-lenders-at-renewal/" className="font-medium text-teal-700 hover:underline">switch guide</a> is what happens if the bank will not move.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">The rest of the renewal file</h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                A lower rate is one line. The contract around it decides whether you should take it. Read these before you sign the letter.
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
                <li>
                  The <a href="/guides/2026-mortgage-renewal-playbook/" className="font-medium text-teal-700 hover:underline">2026 renewal playbook</a> is the timeline, including why the remaining months at an old rate are worth keeping.
                </li>
                <li>
                  <a href="/guides/switching-mortgage-lenders-at-renewal/" className="font-medium text-teal-700 hover:underline">Switching lenders at renewal</a> is the alternative if the bank will not move. At maturity the penalty is usually zero. A straight switch is a different stress-test question from a refinance.
                </li>
                <li>
                  <a href="/guides/mortgage-prepayment-penalties/" className="font-medium text-teal-700 hover:underline">Prepayment penalties</a> are what you agree to pay if you leave before the new term ends. A tenth of a point is a poor trade for a harsh interest rate differential.
                </li>
                <li>
                  <a href="/guides/blend-and-extend-mortgage/" className="font-medium text-teal-700 hover:underline">Blend and extend</a> starts the new rate early and blends it with the months you have left. Price it against waiting until maturity.
                </li>
                <li>
                  <a href="/guides/mortgage-rate-hold-canada/" className="font-medium text-teal-700 hover:underline">Rate holds</a> cover a purchase more often than a renewal. A renewal statement is a different promise from a 120-day hold. Read the expiry.
                </li>
                <li>
                  The distribution behind the median is on <a href="/real-mortgage-rates/" className="font-medium text-teal-700 hover:underline">real mortgage rates</a>. The written month is the <a href={REPORT_PATH} className="font-medium text-teal-700 hover:underline">October 2026 below-the-line report</a>.
                </li>
              </ul>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">The free steps and the paid guide</h2>
              <p className="mt-3 text-slate-700">
                The renewal steps on this page are free. The $29 PDF is a separate guide we write and sell. You can compare rates and use the calculators without buying it.
              </p>
            </section>
            <GuideCTA />
            <FAQSection faqs={faqs} title="Negotiation questions" />
          </div>
        </article>
        <Footer />
      </main>
    </>
  );
}
