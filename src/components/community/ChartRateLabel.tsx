import { useEffect, useState } from "react";
import { rateLabelFontSize, type PlacedRateLabel } from "@/lib/rateChartLabels";

/** Match the label font to the rendered chart width so narrow screens stay readable. */
export function useRateLabelFont(viewBoxWidth: number) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState(13);

  useEffect(() => {
    if (!node) return;
    const apply = () => setFontSize(rateLabelFontSize(node.clientWidth, viewBoxWidth));
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, viewBoxWidth]);

  return { ref: setNode, fontSize };
}

/** Rate text drawn in the series colour with a light halo so it stays readable on the track. */
export default function ChartRateLabel({ label }: { label: PlacedRateLabel }) {
  return (
    <text
      className="rate-point-label"
      data-side={label.side}
      x={label.labelX}
      y={label.labelY}
      textAnchor={label.textAnchor}
      fontSize={label.fontSize}
      fontWeight={600}
      fontFamily="ui-sans-serif, system-ui, sans-serif"
      fill={label.color}
      stroke="#ffffff"
      strokeWidth={Math.max(4, label.fontSize * 0.42)}
      strokeLinejoin="round"
      strokeLinecap="round"
      paintOrder="stroke"
      pointerEvents="none"
      aria-hidden="true"
    >
      {label.text}
    </text>
  );
}
