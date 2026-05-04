import Link from "next/link";

interface ToolLink {
  href: string;
  icon: string;
  title: string;
  description: string;
}

const allTools: ToolLink[] = [
  { href: "/tools/mortgage-calculator", icon: "🧮", title: "Payment Calculator", description: "Calculate monthly payments" },
  { href: "/tools/affordability-calculator", icon: "🏠", title: "Affordability Calculator", description: "How much can you afford?" },
  { href: "/tools/land-transfer-tax-calculator", icon: "📋", title: "Land Transfer Tax", description: "Provincial & municipal taxes" },
  { href: "/tools/cmhc-insurance-calculator", icon: "🛡️", title: "CMHC Calculator", description: "Insurance premiums" },
  { href: "/tools/closing-costs-calculator", icon: "💰", title: "Closing Costs", description: "Total fees to close" },
  { href: "/tools/rent-vs-buy-calculator", icon: "⚖️", title: "Rent vs Buy", description: "Which saves more?" },
  { href: "/tools/mortgage-penalty-calculator", icon: "📉", title: "Penalty Calculator", description: "Break fee estimate" },
  { href: "/tools/mortgage-renewal-calculator", icon: "🔄", title: "Renewal Calculator", description: "Compare renewal options" },
  { href: "/tools/refinance-calculator", icon: "💡", title: "Refinance Calculator", description: "Break-even analysis" },
  { href: "/tools/stress-test-qualifier", icon: "✅", title: "Stress Test", description: "Do you qualify?" },
];

interface CalculatorRelatedToolsProps {
  currentTool?: string;
  title?: string;
}

export default function CalculatorRelatedTools({ currentTool, title = "Explore More Calculators" }: CalculatorRelatedToolsProps) {
  const tools = allTools.filter((t) => t.href !== currentTool).slice(0, 6);

  return (
    <div className="mt-8 card-default p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-600 mb-4">Try these other free Canadian mortgage tools to plan your home purchase.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-white hover:shadow-sm border border-slate-200 transition-all group"
          >
            <span className="text-xl flex-shrink-0">{tool.icon}</span>
            <div>
              <p className="font-medium text-slate-900 group-hover:text-teal-600 transition-colors text-sm">
                {tool.title}
              </p>
              <p className="text-xs text-slate-500">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
