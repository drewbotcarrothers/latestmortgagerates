import { Metadata } from "next";
import TrendsPageClient from "./TrendsPageClient";

export const metadata: Metadata = {
  title: "Mortgage Rate Trends & Historical Analysis | Latest Mortgage Rates Canada",
  description: "Track Canadian mortgage rate trends with interactive charts. View historical data for fixed and variable rates over 7, 30, 60, or 90 days. Compare insured vs uninsured rates.",
  keywords: ["mortgage rate trends", "historical mortgage rates", "rate analysis", "fixed rate trends", "variable rate trends", "Canada mortgage chart"],
  alternates: {
    canonical: "https://latestmortgagerates.ca/trends",
  },
  openGraph: {
    title: "Mortgage Rate Trends & Historical Analysis",
    description: "Track Canadian mortgage rate trends with interactive charts and historical data analysis.",
    type: "website",
    url: "https://latestmortgagerates.ca/trends",
    locale: "en_CA",
    siteName: "Latest Mortgage Rates Canada",
  },
};

export const dynamic = 'force-static';

export default function TrendsPage() {
  return <TrendsPageClient />;
}
