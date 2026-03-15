import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

export const metadata: Metadata = {
  title: "Latest Mortgage Rates Canada",
  description: "Compare the latest mortgage rates from Canada's top lenders including Big 5 banks and monoline lenders. Updated daily with current fixed and variable rates.",
  keywords: ["mortgage rates Canada", "Canadian mortgage rates", "fixed mortgage rates", "variable mortgage rates", "Big 5 banks", "monoline lenders", "best mortgage rates", "compare mortgage rates"],
  authors: [{ name: "Latest Mortgage Rates" }],
  creator: "Latest Mortgage Rates Canada",
  publisher: "Latest Mortgage Rates Canada",
  metadataBase: new URL("https://latestmortgagerates.ca"),
  alternates: {
    canonical: "https://latestmortgagerates.ca",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Latest Mortgage Rates Canada",
    description: "Compare the latest mortgage rates from Canada's top lenders including Big 5 banks and monoline lenders. Updated daily.",
    url: "https://latestmortgagerates.ca",
    siteName: "Latest Mortgage Rates Canada",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "https://latestmortgagerates.ca/logo.png",
        width: 1200,
        height: 630,
        alt: "Latest Mortgage Rates Canada - Compare Rates from Top Lenders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Latest Mortgage Rates Canada",
    description: "Compare the latest mortgage rates from Canada's top lenders. Updated daily.",
    creator: "@latestmortgage",
    images: ["https://latestmortgagerates.ca/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification code here
  },
  other: {
    "msvalidate.01": "your-bing-verification-code", // Add your Bing Webmaster verification code here
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* JSON-LD Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Latest Mortgage Rates Canada",
              url: "https://latestmortgagerates.ca",
              logo: "https://latestmortgagerates.ca/logo.png",
              description: "Compare the latest mortgage rates from Canada's top lenders",
              sameAs: [
                "https://twitter.com/latestmortgage",
                "https://www.facebook.com/latestmortgagerates",
              ],
            }),
          }}
        />
        {/* JSON-LD Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Latest Mortgage Rates Canada",
              url: "https://latestmortgagerates.ca",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://latestmortgagerates.ca/?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7909541570116920"
          crossOrigin="anonymous"
        />
        {/* Google Analytics (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-JSK93NSP6Y"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JSK93NSP6Y');
            `,
          }}
        />
      </head>
      <body className="antialiased transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
