import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Latest Mortgage Rates Canada",
  description: "Compare the latest mortgage rates from Canada's top lenders - Big 5 banks and monoline lenders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
