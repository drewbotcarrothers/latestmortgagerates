import { STRIKING_DISTANCE_LENDER_LINKS } from "@/lib/lenderLinks";

interface StrikingDistanceLenderLinksProps {
  heading?: string;
  intro?: string;
  className?: string;
}

export default function StrikingDistanceLenderLinks({
  heading = "Lender mortgage rates",
  intro = "Open a lender page for today’s fixed and variable quotes. Every figure on those pages comes from our scrape.",
  className = "",
}: StrikingDistanceLenderLinksProps) {
  return (
    <section className={`card-default p-6 ${className}`.trim()}>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{heading}</h2>
      <p className="text-slate-600 mb-4">{intro}</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {STRIKING_DISTANCE_LENDER_LINKS.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="text-teal-700 font-medium hover:underline">
              {link.anchor}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
