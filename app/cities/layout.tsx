import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "City Mortgage Rates | Latest Mortgage Rates Canada",
  description: "Find the best mortgage rates in major Canadian cities. Compare rates for Toronto, Vancouver, Montreal, Calgary, and more.",
};

export default function CitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
