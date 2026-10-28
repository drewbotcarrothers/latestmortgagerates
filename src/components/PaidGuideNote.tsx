import { buildGuidePageUrl, guideHasInlineTeaser, SCRIPT_TEASER_LINE } from "@/lib/guide";

export function GuideInlineTeaser({ slug }: { slug: string }) {
  if (!guideHasInlineTeaser(slug)) return null;
  const href = buildGuidePageUrl({ medium: "inline", content: slug });
  return (
    <aside className="rounded-xl border border-amber-200 bg-amber-50 p-5">
      <p className="leading-relaxed text-slate-800">
        <strong>Want the exact words?</strong> The paid toolkit has 7 word-for-word scripts, like this opener:{" "}
        <em>&ldquo;{SCRIPT_TEASER_LINE}&rdquo;</em>{" "}
        <a href={href} className="font-semibold text-teal-700 hover:underline">
          Get the Toolkit — $29
        </a>
      </p>
    </aside>
  );
}

export function PaidGuideNote() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900">The explanations stay free</h2>
      <p className="mt-3 leading-relaxed text-slate-700">
        The explanations on this page are free and stay free. The $29 Mortgage Guide + Renewal Toolkit adds what isn&apos;t on the site: word-for-word scripts, printable worksheets, a 180-day checklist and a 50-page Renewal Playbook.{" "}
        <a href="/mortgage-guide/" className="font-semibold text-teal-700 hover:underline">
          See what&apos;s inside
        </a>
      </p>
    </section>
  );
}
