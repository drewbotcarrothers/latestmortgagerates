import type { GuideSection } from "@/content/calculatorGuides";

export default function CalculatorGuide({ sections }: { sections: GuideSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.heading} className="card-default p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 80)}
              className="text-slate-600 mb-4 last:mb-0"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />
          ))}
        </section>
      ))}
    </>
  );
}
