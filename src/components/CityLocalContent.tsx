import FAQSection from "@/components/FAQSection";
import { cityPath } from "@/lib/cities";
import { getCityContent } from "@/lib/cityContent";

interface CityLocalContentProps {
  slug: string;
}

export default function CityLocalContent({ slug }: CityLocalContentProps) {
  const content = getCityContent(slug);
  const lttTone = content.lttHasProvincialTax
    ? "border-amber-200 bg-amber-50"
    : "border-emerald-200 bg-emerald-50";

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Buying or renewing in {content.name}
        </h2>
        <p className="text-slate-700 mb-4">{content.intro}</p>
        {content.marketNotes.length > 0 && (
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            {content.marketNotes.map((note) => (
              <li key={note.slice(0, 48)}>{note}</li>
            ))}
          </ul>
        )}
      </section>

      <section className={`rounded-lg border p-6 ${lttTone}`}>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{content.lttHeadline}</h2>
        <p className="text-slate-700 mb-4">{content.lttBody}</p>
        <p className="text-sm text-slate-600 mb-3">
          Tax rules change. Confirm with your lawyer or notary before you go firm. Figures here match
          provincial/municipal programs we cite in the pull request notes—not an invented {content.name}{" "}
          average price.
        </p>
        <a
          href={content.lttToolHref}
          className="inline-flex items-center font-medium text-teal-700 hover:underline"
        >
          {content.lttToolLabel} →
        </a>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          First-time buyers in {content.name}
        </h2>
        <p className="text-slate-700 mb-4">{content.firstTimeBuyer.intro}</p>
        <div className="space-y-4">
          {content.firstTimeBuyer.points.map((point) => (
            <div key={point.heading} className="border-l-4 border-teal-500 pl-4">
              <h3 className="font-semibold text-slate-900">{point.heading}</h3>
              <p className="text-slate-700">{point.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Renewing a mortgage in {content.name}
        </h2>
        <p className="text-slate-700 mb-4">{content.renewal.intro}</p>
        <div className="space-y-4">
          {content.renewal.points.map((point) => (
            <div key={point.heading} className="border-l-4 border-slate-400 pl-4">
              <h3 className="font-semibold text-slate-900">{point.heading}</h3>
              <p className="text-slate-700">{point.body}</p>
            </div>
          ))}
        </div>
      </section>

      {content.localLenders.length > 0 && (
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            Lenders {content.name} buyers often compare
          </h2>
          <ul className="space-y-3">
            {content.localLenders.map((lender) => (
              <li key={lender.href}>
                <a href={lender.href} className="font-medium text-teal-700 hover:underline">
                  {lender.label}
                </a>
                <p className="text-sm text-slate-600">{lender.note}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <FAQSection faqs={content.faqs} title={`${content.name} mortgage FAQs`} />

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-3">Compare nearby cities</h2>
        <ul className="flex flex-wrap gap-2">
          {content.nearby.map((city) => (
            <li key={city.slug}>
              <a
                href={cityPath(city.slug)}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-teal-700 hover:border-teal-300 hover:bg-white"
              >
                {city.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <a href="/cities/" className="text-teal-600 hover:underline font-medium">
            All city mortgage rate pages →
          </a>
        </p>
      </section>
    </div>
  );
}
