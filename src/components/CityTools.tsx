import RateHubLinks from "@/components/RateHubLinks";
import GuideCTA from "@/components/GuideCTA";
import AdUnit from "@/components/AdUnit";
import { TOOLS_INDEX_HREF } from "@/lib/siteLinks";

interface CityToolsProps {
  cityName: string;
  province: string;
}

export default function CityTools({ cityName, province }: CityToolsProps) {
  const isOntario = province === "Ontario";
  const isQuebec = province === "Quebec";
  const isBC = province === "British Columbia";
  const place = cityName.trim() || "your city";

  const tools = [
    { href: "/tools/affordability-calculator/", icon: "🏠", title: "Affordability Calculator", desc: `How much home can you afford in ${place}?` },
    { href: "/tools/mortgage-calculator/", icon: "🧮", title: "Payment Calculator", desc: `Monthly payments for ${place} home prices` },
  ];

  if (isOntario || isBC || isQuebec) {
    tools.push({ href: "/tools/land-transfer-tax-calculator/", icon: "📋", title: "Land Transfer Tax", desc: `${province} transfer taxes & rebates` });
  }

  tools.push(
    { href: "/tools/closing-costs-calculator/", icon: "💰", title: "Closing Costs", desc: `Total fees to buy in ${place}` },
    { href: "/tools/cmhc-insurance-calculator/", icon: "🛡️", title: "CMHC Calculator", desc: "Insurance for under 20% down" },
    { href: "/tools/stress-test-qualifier/", icon: "✅", title: "Stress Test", desc: `Check if you qualify in ${place}` },
    { href: "/tools/rent-vs-buy-calculator/", icon: "⚖️", title: "Rent vs Buy", desc: `Should you rent or buy in ${place}?` }
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12 space-y-6">
      <section className="card-default p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Tools for {place} Home Buyers</h2>
        <p className="text-slate-600 mb-6">
          Free calculators to help you plan your {place} home purchase.
          Calculate affordability, payments, taxes, and total costs.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 hover:bg-white hover:shadow-sm border border-slate-200 transition-all group"
            >
              <span className="text-2xl flex-shrink-0">{tool.icon}</span>
              <div>
                <p className="font-medium text-slate-900 group-hover:text-teal-600 transition-colors">
                  {tool.title}
                </p>
                <p className="text-sm text-slate-500">{tool.desc}</p>
              </div>
            </a>
          ))}
        </div>
        <p className="mt-4 text-sm">
          <a href={TOOLS_INDEX_HREF} className="text-teal-600 hover:underline font-medium">
            See all mortgage calculators →
          </a>
        </p>
      </section>
      <AdUnit format="display" />
      <RateHubLinks
        title={`Compare ${place} mortgage rates`}
        description={`National rate hubs for shoppers in ${place} — then compare lenders on each page.`}
      />
      <GuideCTA variant="compact" />
    </div>
  );
}
