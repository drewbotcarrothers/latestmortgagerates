import type { EditorialSection } from "@/content/editorialPages";

export default function EditorialSections({ sections }: { sections: EditorialSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.heading} id={section.id}>
          <h2 className="mb-3 text-2xl font-bold text-slate-900">{section.heading}</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed [&_a]:text-teal-700 [&_a]:hover:underline">
            {section.paragraphs.map((paragraph, index) => (
              <div key={paragraph.slice(0, 80)}>
                <p dangerouslySetInnerHTML={{ __html: paragraph }} />
                {section.listAfter === index && section.items && section.items.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    {section.items.map((item) => (
                      <li key={item.slice(0, 80)} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
