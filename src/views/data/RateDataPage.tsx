import DataArticle from "@/views/data/DataArticle";
import { DATA_LINKS } from "@/lib/dataLinks";
import { formatLongDate, formatPct } from "@/lib/dataFormat";
import { primeFileFacts } from "@/lib/primeData";
import { publishedRates } from "@/lib/publishedRates";

export function rateDataLead(): string {
  const facts = primeFileFacts(publishedRates);
  const asOf = facts.asOf ? formatLongDate(facts.asOf) : "the latest rate file";
  return `The big-bank consensus prime is ${formatPct(facts.prime)} in the ${asOf} rate file. The pages below are built from that file, from rates self-reported by Canadian borrowers online, and from cited Bank of Canada and bank economics sources.`;
}

export default function RateDataPage() {
  const facts = primeFileFacts(publishedRates);
  const asOf = facts.asOf ? formatLongDate(facts.asOf) : "the latest rate file";
  return (
    <DataArticle
      title="Rate data"
      lead={rateDataLead()}
      asOf={asOf}
      currentPath="/rate-data/"
      breadcrumb={[
        { name: "Home", url: "/" },
        { name: "Rate data" },
      ]}
    >
      <section>
        <h2 className="text-2xl font-bold text-slate-900">Pages built from the rate file</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {DATA_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300">
                <span className="font-medium text-slate-900">{link.title}</span>
                <span className="mt-1 block text-sm text-slate-600">{link.description}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </DataArticle>
  );
}
