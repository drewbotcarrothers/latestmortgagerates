import { DATA_HUB, DATA_LINKS } from "@/lib/dataLinks";

export default function DataLinks({ current }: { current?: string }) {
  const links = DATA_LINKS.filter((link) => link.href !== current);
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-slate-900">More rate data</h2>
      <p className="mt-2 text-slate-600">
        These pages are built from the rate file, the reported-rate file, and cited official sources.{" "}
        <a href={DATA_HUB.href} className="text-teal-700 hover:underline">
          {DATA_HUB.title}
        </a>{" "}
        lists all of them.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-teal-300">
              <span className="font-medium text-slate-900">{link.title}</span>
              <span className="mt-1 block text-sm text-slate-600">{link.description}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
