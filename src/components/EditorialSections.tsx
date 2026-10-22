import type { EditorialSection } from "@/content/editorialPages";

export default function EditorialSections({ sections }: { sections: EditorialSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.heading} id={section.id}>
          <h2 className="mb-3 text-2xl font-bold text-slate-900">{section.heading}</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed [&_a]:text-teal-700 [&_a]:hover:underline">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 96)} dangerouslySetInnerHTML={{ __html: paragraph }} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
