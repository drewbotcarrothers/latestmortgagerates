import { DISCOVERY_LINKS } from "@/lib/discoveryLinks";

export default function DiscoveryLinks({ className = "" }: { className?: string }) {
  const [heloc, nesto, cmls, scotia, simplii] = DISCOVERY_LINKS;
  return (
    <p className={`text-slate-600 leading-relaxed ${className}`.trim()}>
      Home-equity lines are in the <a href={heloc.href} className="text-teal-700 font-medium hover:underline">{heloc.label}</a>.
      Lender pages for <a href={nesto.href} className="text-teal-700 font-medium hover:underline">{nesto.label}</a>,{" "}
      <a href={cmls.href} className="text-teal-700 font-medium hover:underline">{cmls.label}</a>,{" "}
      <a href={scotia.href} className="text-teal-700 font-medium hover:underline">{scotia.label}</a>, and{" "}
      <a href={simplii.href} className="text-teal-700 font-medium hover:underline">{simplii.label}</a>{" "}
      are listed on the <a href="/lenders/" className="text-teal-700 font-medium hover:underline">lender index</a>.
    </p>
  );
}
