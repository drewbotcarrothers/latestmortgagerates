import type { EditorialSection } from "@/content/editorialPages";

export default function EditorialSections({ sections }: { sections: EditorialSection[] }) {
  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.heading} id={section.id}>
          <h2 className="mb-3 text-2xl font-bold text-slate-900">{section.heading}</h2>
          <div className="space-y-3 text-slate-700 leading-relaxed [&_a]:text-teal-700 [&_a]:hover:underline">
            {section.paragraphs.map((paragraph, index) => (
              <div key={`${section.heading}-${index}`}>
                {/^\s*<(table|div)\b/.test(paragraph) ? (
                  <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: paragraph }} />
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: paragraph }} />
                )}
                {section.listAfter === index && section.items && section.items.length > 0 ? (
                  <ul className="mt-3 list-disc space-y-2 pl-5">
                    {section.items.map((item) => (
                      <li key={item.slice(0, 80)} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                ) : null}
                {section.table && index === section.paragraphs.length - 1 ? (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <caption className="mb-2 text-left font-medium text-slate-800">{section.table.caption}</caption>
                      <thead>
                        <tr>
                          {section.table.headers.map((header) => (
                            <th key={header} className="border border-slate-200 bg-slate-50 px-2 py-2 text-left font-semibold text-slate-900">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, rowIndex) => (
                          <tr key={`${rowIndex}-${row[0]}`}>
                            {row.map((cell, cellIndex) => (
                              <td
                                key={`${rowIndex}-${cellIndex}`}
                                className="border border-slate-200 px-2 py-2 align-top text-slate-700"
                                dangerouslySetInnerHTML={{ __html: cell }}
                              />
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
