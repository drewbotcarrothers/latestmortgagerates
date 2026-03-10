"use client";

import { useState } from "react";
import Image from "next/image";

interface LenderLogoProps {
  lenderSlug: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

const sizePixels = {
  sm: 32,
  md: 40,
  lg: 48,
};

// Lender display names mapping
const lenderNames: Record<string, string> = {
  // Big 6 Banks
  rbc: "RBC Royal Bank",
  td: "TD Canada Trust",
  scotiabank: "Scotiabank",
  bmo: "BMO Bank of Montreal",
  cibc: "CIBC",
  nationalbank: "National Bank",
  
  // Digital/Direct Banks
  nesto: "nesto",
  tangerine: "Tangerine",
  eqbank: "EQ Bank",
  simplii: "Simplii Financial",
  motive: "Motive Financial",
  alterna: "Alterna Bank",
  
  // Credit Unions
  meridian: "Meridian Credit Union",
  desjardins: "Desjardins",
  vancity: "Vancity",
  coastcapital: "Coast Capital Savings",
  
  // Regional Banks
  atb: "ATB Financial",
  cwb: "Canadian Western Bank",
  
  // Monoline Lenders
  firstnational: "First National",
  mcap: "MCAP",
  laurentian: "Laurentian Bank",
  manulife: "Manulife Bank",
  rfa: "RFA Bank",
  cmls: "CMLS Financial",
  merix: "Merix Financial",
  lendwise: "Lendwise",
  butlermortgage: "Butler Mortgage",
  intellimortgage: "IntelliMortgage",
  streetcapital: "Street Capital",
  centum: "Centum",
};

// Fallback styles for when image is not available
const fallbackStyles: Record<string, { bg: string; text: string; abbr: string }> = {
  // Big 6 Banks
  rbc: { bg: "bg-blue-700", text: "text-white", abbr: "RBC" },
  td: { bg: "bg-green-600", text: "text-white", abbr: "TD" },
  scotiabank: { bg: "bg-red-600", text: "text-white", abbr: "Scotia" },
  bmo: { bg: "bg-red-700", text: "text-white", abbr: "BMO" },
  cibc: { bg: "bg-red-600", text: "text-white", abbr: "CIBC" },
  nationalbank: { bg: "bg-emerald-700", text: "text-white", abbr: "NatBank" },
  
  // Digital/Direct Banks
  nesto: { bg: "bg-emerald-500", text: "text-white", abbr: "nesto" },
  tangerine: { bg: "bg-orange-500", text: "text-white", abbr: "Tang" },
  eqbank: { bg: "bg-indigo-600", text: "text-white", abbr: "EQ" },
  simplii: { bg: "bg-red-500", text: "text-white", abbr: "Simplii" },
  motive: { bg: "bg-yellow-600", text: "text-white", abbr: "Motive" },
  alterna: { bg: "bg-cyan-600", text: "text-white", abbr: "Alterna" },
  
  // Credit Unions
  meridian: { bg: "bg-teal-600", text: "text-white", abbr: "M" },
  desjardins: { bg: "bg-green-500", text: "text-white", abbr: "Desj" },
  vancity: { bg: "bg-red-500", text: "text-white", abbr: "Vancity" },
  coastcapital: { bg: "bg-blue-500", text: "text-white", abbr: "Coast" },
  
  // Regional Banks
  atb: { bg: "bg-blue-600", text: "text-white", abbr: "ATB" },
  cwb: { bg: "bg-green-700", text: "text-white", abbr: "CWB" },
  
  // Monoline Lenders
  firstnational: { bg: "bg-blue-500", text: "text-white", abbr: "FNF" },
  mcap: { bg: "bg-gray-700", text: "text-white", abbr: "MCAP" },
  laurentian: { bg: "bg-blue-600", text: "text-white", abbr: "Laurent" },
  manulife: { bg: "bg-green-700", text: "text-white", abbr: "Manu" },
  rfa: { bg: "bg-slate-600", text: "text-white", abbr: "RFA" },
  cmls: { bg: "bg-blue-800", text: "text-white", abbr: "CMLS" },
  merix: { bg: "bg-indigo-700", text: "text-white", abbr: "Merix" },
  lendwise: { bg: "bg-emerald-600", text: "text-white", abbr: "Lendwise" },
  butlermortgage: { bg: "bg-orange-600", text: "text-white", abbr: "Butler" },
  intellimortgage: { bg: "bg-purple-600", text: "text-white", abbr: "Intelli" },
  streetcapital: { bg: "bg-cyan-700", text: "text-white", abbr: "Street" },
  centum: { bg: "bg-red-700", text: "text-white", abbr: "Centum" },
  
  // Default fallback
  default: { bg: "bg-gray-400", text: "text-white", abbr: "?" },
};

export default function LenderLogo({ lenderSlug, size = "md", showText = true }: LenderLogoProps) {
  const [imageError, setImageError] = useState(false);
  const normalizedSlug = lenderSlug.toLowerCase();
  const lenderName = lenderNames[normalizedSlug] || lenderNames[normalizedSlug.replace(/\s+/g, '')] || "Unknown";
  const fallback = fallbackStyles[normalizedSlug] || fallbackStyles.default;
  const logoPath = `/logos/${normalizedSlug}.png`;
  const pixelSize = sizePixels[size];

  // If image failed to load or we're in fallback mode, show colored initials
  if (imageError) {
    return (
      <div className="flex items-center gap-3">
        <div className={`${sizeClasses[size]} ${fallback.bg} rounded-lg flex items-center justify-center font-bold shrink-0 shadow-sm`}>
          <span className={`${fallback.text} text-xs`}>{fallback.abbr}</span>
        </div>
        {showText && (
          <span className="font-medium text-gray-900 dark:text-gray-100">{lenderName}</span>
        )}
      </div>
    );
  }

  // Try to load actual logo image
  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} relative shrink-0`}>
        <Image
          src={logoPath}
          alt={`${lenderName} logo`}
          fill
          className="object-contain rounded-lg"
          onError={() => setImageError(true)}
          sizes={`${pixelSize}px`}
        />
      </div>
      {showText && (
        <span className="font-medium text-gray-900 dark:text-gray-100">{lenderName}</span>
      )}
    </div>
  );
}
