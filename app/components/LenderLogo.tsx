interface LenderLogoProps {
  lenderSlug: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

// Extended lender styles with 19+ lenders
const lenderStyles: Record<string, { bg: string; text: string; abbr: string; fullName?: string }> = {
  // Big 6 Banks
  rbc: { bg: "bg-blue-700", text: "text-white", abbr: "RBC", fullName: "RBC Royal Bank" },
  td: { bg: "bg-green-600", text: "text-white", abbr: "TD", fullName: "TD Canada Trust" },
  scotiabank: { bg: "bg-red-600", text: "text-white", abbr: "Scotia", fullName: "Scotiabank" },
  bmo: { bg: "bg-red-700", text: "text-white", abbr: "BMO", fullName: "BMO Bank of Montreal" },
  cibc: { bg: "bg-red-600", text: "text-white", abbr: "CIBC", fullName: "CIBC" },
  nationalbank: { bg: "bg-emerald-700", text: "text-white", abbr: "NatBank", fullName: "National Bank" },
  
  // Digital/Direct Banks
  nesto: { bg: "bg-emerald-500", text: "text-white", abbr: "nesto", fullName: "nesto" },
  tangerine: { bg: "bg-orange-500", text: "text-white", abbr: "Tang", fullName: "Tangerine" },
  eqbank: { bg: "bg-indigo-600", text: "text-white", abbr: "EQ", fullName: "EQ Bank" },
  simplii: { bg: "bg-red-500", text: "text-white", abbr: "Simplii", fullName: "Simplii Financial" },
  motive: { bg: "bg-yellow-600", text: "text-white", abbr: "Motive", fullName: "Motive Financial" },
  alterna: { bg: "bg-cyan-600", text: "text-white", abbr: "Alterna", fullName: "Alterna Bank" },
  
  // Credit Unions
  meridian: { bg: "bg-teal-600", text: "text-white", abbr: "M", fullName: "Meridian CU" },
  desjardins: { bg: "bg-green-500", text: "text-white", abbr: "Desj", fullName: "Desjardins" },
  
  // Monoline Lenders
  firstnational: { bg: "bg-blue-500", text: "text-white", abbr: "FNF", fullName: "First National" },
  mcap: { bg: "bg-gray-700", text: "text-white", abbr: "MCAP", fullName: "MCAP" },
  laurentian: { bg: "bg-blue-600", text: "text-white", abbr: "Laurent", fullName: "Laurentian Bank" },
  manulife: { bg: "bg-green-700", text: "text-white", abbr: "Manu", fullName: "Manulife Bank" },
  rfa: { bg: "bg-slate-600", text: "text-white", abbr: "RFA", fullName: "RFA Bank" },
  
  // Default fallback
  default: { bg: "bg-gray-400", text: "text-white", abbr: "?", fullName: "Unknown" },
};

export default function LenderLogo({ lenderSlug, size = "md", showText = true }: LenderLogoProps) {
  const style = lenderStyles[lenderSlug.toLowerCase()] || lenderStyles.default;
  
  if (!showText) {
    return (
      <div className={`${sizeClasses[size]} ${style.bg} rounded-lg flex items-center justify-center font-bold shrink-0 shadow-sm`}>
        <span className={style.text}>{style.abbr.charAt(0)}</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} ${style.bg} rounded-lg flex items-center justify-center font-bold shrink-0 shadow-sm`}>
        <span className={style.text}>{style.abbr}</span>
      </div>
      {showText && (
        <span className="font-medium text-gray-900 dark:text-gray-100">{style.fullName}</span>
      )}
    </div>
  );
}