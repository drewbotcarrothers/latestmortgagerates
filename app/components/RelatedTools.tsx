"use client";

import Link from "next/link";

interface ToolLink {
  href: string;
  icon: string;
  title: string;
  description: string;
}

interface RelatedToolsProps {
  tools: ToolLink[];
  title?: string;
}

export default function RelatedTools({ tools, title = "Related Tools" }: RelatedToolsProps) {
  return (
    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all group"
          >
            <span className="text-2xl flex-shrink-0">{tool.icon}</span>
            <div>
              <p className="font-medium text-slate-900 group-hover:text-teal-600 transition-colors">
                {tool.title}
              </p>
              <p className="text-sm text-slate-500">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
