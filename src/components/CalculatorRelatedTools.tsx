import RateHubLinks from "@/components/RateHubLinks";
import { TOOL_LINKS, filterCurrent } from "@/lib/siteLinks";

interface CalculatorRelatedToolsProps {
  currentTool?: string;
  title?: string;
  showRateHubs?: boolean;
}

export default function CalculatorRelatedTools({
  currentTool,
  title = "Explore More Calculators",
  showRateHubs = true,
}: CalculatorRelatedToolsProps) {
  const tools = filterCurrent(TOOL_LINKS, currentTool).slice(0, 6);

  return (
    <div className="mt-8 space-y-6">
      <div className="card-default p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-600 mb-4">
          Try these other free Canadian mortgage tools to plan your home purchase.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((tool) => (
            <a
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
            </a>
          ))}
        </div>
        <p className="mt-4 text-sm">
          <a href="/tools/" className="text-teal-600 hover:underline font-medium">
            Browse all mortgage calculators →
          </a>
        </p>
      </div>
      {showRateHubs && (
        <RateHubLinks currentHref={currentTool} />
      )}
    </div>
  );
}
