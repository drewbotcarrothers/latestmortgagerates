interface LenderLogoProps {
  lenderSlug: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

const lenderStyles: Record<string, { bg: string; text: string; abbr: string }> = {
  nesto: { bg: "bg-emerald-500", text: "text-white", abbr: "N" },
  tangerine: { bg: "bg-orange-500", text: "text-white", abbr: "T" },
  cibc: { bg: "bg-red-600", text: "text-white", abbr: "C" },
  rbc: { bg: "bg-blue-700", text: "text-yellow-400", abbr: "R" },
  bmo: { bg: "bg-red-700", text: "text-white", abbr: "B" },
  td: { bg: "bg-green-600", text: "text-white", abbr: "TD" },
  scotiabank: { bg: "bg-red-500", text: "text-white", abbr: "S" },
};

export default function LenderLogo({ lenderSlug, size = "md" }: LenderLogoProps) {
  const style = lenderStyles[lenderSlug.toLowerCase()] || { bg: "bg-gray-400", text: "text-white", abbr: "?" };
  
  return (
    <div className={`${sizeClasses[size]} ${style.bg} ${style.text} rounded-lg flex items-center justify-center font-bold shrink-0`}>
      {style.abbr}
    </div>
  );
}
