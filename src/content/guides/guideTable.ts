/** HTML table rendered outside a paragraph by EditorialSections. */
export function guideTable(headers: string[], rows: string[][]): string {
  const head = headers
    .map((header) => `<th class="py-2 pr-3 text-left font-semibold text-slate-900">${header}</th>`)
    .join("");
  const body = rows
    .map(
      (row) =>
        `<tr class="border-b border-slate-200">${row
          .map((cell) => `<td class="py-2 pr-3 align-top">${cell}</td>`)
          .join("")}</tr>`,
    )
    .join("");
  return `<table class="w-full border-collapse text-sm"><thead><tr class="border-b border-slate-300">${head}</tr></thead><tbody>${body}</tbody></table>`;
}
