import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FAQSection from "@/components/FAQSection";
import {
  buildGuideBuyUrl,
  CORE_GUIDE_TITLE,
  GUIDE_AUDIENCES,
  GUIDE_BENEFITS,
  GUIDE_TRUST,
  GUIDE_VARIANT,
  PAID_COMPARE_ROWS,
  SALES_EYEBROW,
  SALES_FAQS,
  SALES_FINAL_H2,
  SALES_FINAL_MICRO,
  SALES_H1,
  SALES_INSIDE_CTA,
  SALES_INSIDE_HEADING,
  SALES_MICROCOPY,
  SALES_MID_CTA,
  SALES_ONLY_HEADING,
  SALES_PRIMARY_CTA,
  SALES_SUBHEAD,
  SCRIPT_1_PREVIEW,
  WHATS_INSIDE,
} from "@/lib/guide";

const buyClass =
  "inline-flex items-center justify-center rounded-lg bg-teal-600 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2";

function SalesBuyLink({
  content,
  children,
  className = buyClass,
}: {
  content: "sales_hero" | "sales_mid" | "sales_inside" | "sales_final";
  children: string;
  className?: string;
}) {
  return (
    <a href={buildGuideBuyUrl({ medium: "sales_page", content })} className={className}>
      {children}
    </a>
  );
}

export default function EbookLandingPage() {
  return (
    <main className="min-h-screen bg-slate-50" data-guide-variant={GUIDE_VARIANT}>
      <Header currentPage="ebook" />

      <section className="hero-gradient text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-200">{SALES_EYEBROW}</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{SALES_H1}</h1>
            <p className="mt-5 max-w-2xl text-lg text-slate-200">{SALES_SUBHEAD}</p>
            <div className="mt-8">
              <SalesBuyLink content="sales_hero">{SALES_PRIMARY_CTA}</SalesBuyLink>
              <p className="mt-3 max-w-xl text-sm text-slate-300">{SALES_MICROCOPY}</p>
              <a href="#inside" className="mt-4 inline-flex text-sm font-semibold text-teal-200 hover:text-white">
                See what&apos;s inside ↓
              </a>
            </div>
          </div>
          <img
            src="/images/mortgage-guide/covers-stack.png"
            alt={`Covers of ${CORE_GUIDE_TITLE}, Start Here, the script pack, the worksheet pack, the renewal checklist and the Renewal Playbook 2027`}
            className="w-full rounded-2xl bg-white/95 p-3 shadow-2xl"
            width={1172}
            height={590}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900">Who it&apos;s for</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {GUIDE_AUDIENCES.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-slate-900">What you can do with it</h2>
          <ul className="mt-8 space-y-5">
            {GUIDE_BENEFITS.map((item) => (
              <li key={item.title} className="border-l-4 border-teal-600 pl-4">
                <p className="font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-slate-600">{item.body}</p>
                {"illustration" in item && item.illustration ? (
                  <p className="mt-1 text-sm italic text-slate-500">Illustration: {item.illustration}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900">{SALES_ONLY_HEADING}</h2>
        <p className="mt-3 text-slate-600">
          Everything on our free guides pages stays free. Here&apos;s what isn&apos;t on the site anywhere:
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">On the free site</th>
                <th scope="col" className="px-4 py-3 font-semibold">Only in the paid guide</th>
              </tr>
            </thead>
            <tbody>
              {PAID_COMPARE_ROWS.map((row) => (
                <tr key={row.paid} className="border-t border-slate-200 bg-white">
                  <td className="px-4 py-3 align-top text-slate-600">{row.free}</td>
                  <th scope="row" className="px-4 py-3 align-top font-semibold text-slate-900">{row.paid}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Prefer free? Start with the{" "}
          <a href="/guides/2026-mortgage-renewal-playbook/" className="font-medium text-teal-700 hover:underline">renewal playbook</a>
          {" "}and the{" "}
          <a href="/guides/negotiate-mortgage-rate/" className="font-medium text-teal-700 hover:underline">negotiation guide</a>.
          {" "}Buy the toolkit when you&apos;re ready to make the calls.
        </p>
        <div className="mt-8">
          <SalesBuyLink content="sales_mid" className={`${buyClass} text-base`}>
            {SALES_MID_CTA}
          </SalesBuyLink>
        </div>
      </section>

      <section id="inside" className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-slate-900">{SALES_INSIDE_HEADING}</h2>
          <ol className="mt-8 space-y-6">
            {WHATS_INSIDE.map((file) => (
              <li key={file.title} className="rounded-xl border border-slate-200 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{file.note}</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{file.title}</h3>
                {file.body ? <p className="mt-2 text-slate-600">{file.body}</p> : null}
                {file.chapters ? (
                  <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-slate-700">
                    {file.chapters.map((chapter) => (
                      <li key={chapter}>{chapter}</li>
                    ))}
                  </ol>
                ) : null}
              </li>
            ))}
          </ol>
          <div className="mt-8">
            <SalesBuyLink content="sales_inside">{SALES_INSIDE_CTA}</SalesBuyLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900">Look inside before you buy</h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          Here&apos;s Script 1, word for word. The full pack has six more, plus replies for when the lender pushes back.
        </p>
        <blockquote className="mt-6 max-w-3xl border-l-4 border-teal-600 bg-white p-5 text-slate-800">
          <p>&ldquo;{SCRIPT_1_PREVIEW}&rdquo;</p>
        </blockquote>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img
              src="/images/mortgage-guide/thumb-scripts.png"
              alt="First page of the Negotiation Script Pack"
              className="h-auto w-full"
              width={1200}
              height={1558}
            />
            <figcaption className="px-3 py-2 text-sm text-slate-600">Negotiation Script Pack</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img
              src="/images/mortgage-guide/thumb-quote-worksheet.png"
              alt="Worksheet 3, a blank quote comparison table"
              className="h-auto w-full"
              width={1200}
              height={1550}
            />
            <figcaption className="px-3 py-2 text-sm text-slate-600">Worksheet 3: quote comparison</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <img
              src="/images/mortgage-guide/thumb-checklist.png"
              alt="First page of the Mortgage Renewal Checklist"
              className="h-auto w-full"
              width={1200}
              height={1263}
            />
            <figcaption className="px-3 py-2 text-sm text-slate-600">Mortgage Renewal Checklist</figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDE_TRUST.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-3xl font-bold text-slate-900">About the author</h2>
        <p className="mt-4 leading-relaxed text-slate-700">
          <a href="/author/andrew/" className="font-semibold text-teal-700 hover:underline">Andrew</a>
          {" "}writes Latest Mortgage Rates, which tracks posted rates from Canadian lenders daily alongside rates self-reported by borrowers. He&apos;s based in Toronto. The guide is educational and isn&apos;t financial advice.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <FAQSection faqs={SALES_FAQS} title="Questions" />
      </section>

      <section className="bg-slate-900 py-16 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{SALES_FINAL_H2}</h2>
          <div className="mt-8">
            <SalesBuyLink content="sales_final">{SALES_PRIMARY_CTA}</SalesBuyLink>
          </div>
          <p className="mt-3 text-sm text-slate-300">{SALES_FINAL_MICRO}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-bold text-slate-900">A free tool, if you want it</h2>
        <a
          href="/tools/stress-test-qualifier/"
          className="mt-4 block max-w-md rounded-xl border border-slate-200 bg-white p-6 hover:border-teal-300"
        >
          <h3 className="font-bold text-slate-900">Stress Test Qualifier</h3>
          <p className="mt-2 text-sm text-slate-600">See if you pass Canada&apos;s mortgage stress test before you negotiate.</p>
        </a>
      </section>

      <Footer />
    </main>
  );
}
