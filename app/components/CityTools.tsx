import Link from "next/link";

interface CityToolsProps {
  cityName: string;
  province: string;
}

export default function CityTools({ cityName, province }: CityToolsProps) {
  const isOntario = province === "Ontario";
  const isQuebec = province === "Quebec";
  const isBC = province === "British Columbia";
  
  const tools = [
    { href: "/tools/affordability-calculator", icon: "🏠", title: "Affordability Calculator", desc: `How much home can you afford in ${cityName}?` },
    { href: "/tools/mortgage-calculator", icon: "🧮", title: "Payment Calculator", desc: `Monthly payments for ${cityName} home prices` },
  ];

  // Province-specific tools
  if (isOntario || isBC || isQuebec) {
    tools.push({ href: "/tools/land-transfer-tax-calculator", icon: "📋", title: "Land Transfer Tax", desc: `${province} transfer taxes & rebates` });
  }
  
  tools.push(
    { href: "/tools/closing-costs-calculator", icon: "💰", title: "Closing Costs", desc: `Total fees to buy in ${cityName}` },
    { href: "/tools/cmhc-insurance-calculator", icon: "🛡️", title: "CMHC Calculator", desc: "Insurance for under 20% down" },
    { href: "/tools/rent-vs-buy-calculator", icon: "⚖️", title: "Rent vs Buy", desc: `Should you rent or buy in ${cityName}?` }
  );

  return (
    <section className="mt-8 card-default p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Tools for {cityName} Home Buyers</h2>
      <p className="text-slate-600 mb-6">
        Free calculators to help you plan your {cityName} home purchase. 
        Calculate affordability, payments, taxes, and total costs.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <Link
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
          </Link>
        ))}
      </div>
    </section>
  );
}
