import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import DataLinks from "@/components/DataLinks";
import type { ReactNode } from "react";

export default function DataArticle({
  title,
  lead,
  asOf,
  currentPath,
  children,
  badge,
  breadcrumb,
}: {
  title: string;
  lead: string;
  asOf: string;
  currentPath: string;
  children: ReactNode;
  badge?: string;
  /** Override when this page is the hub itself. */
  breadcrumb?: { name: string; url?: string }[];
}) {
  const crumbs = breadcrumb ?? [
    { name: "Home", url: "/" },
    { name: "Rate data", url: "/rate-data/" },
    { name: title },
  ];
  return (
    <>
      <BreadcrumbSchema items={crumbs} />
      <main className="min-h-screen bg-slate-50">
        <Header currentPage="rates" />
        <article className="mx-auto max-w-7xl px-4 py-10">
          <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
            {crumbs.map((crumb, index) => (
              <span key={`${crumb.name}-${index}`}>
                {index > 0 ? <span className="mx-2">/</span> : null}
                {crumb.url && index < crumbs.length - 1 ? (
                  <a href={crumb.url} className="hover:text-slate-800">{crumb.name}</a>
                ) : (
                  <span>{crumb.name}</span>
                )}
              </span>
            ))}
          </nav>
          {badge ? (
            <p className="mb-3 inline-block rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
              {badge}
            </p>
          ) : null}
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">As of {asOf}</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">{title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">{lead}</p>
          <div className="mt-8 space-y-10 text-slate-700 leading-relaxed">{children}</div>
          <DataLinks current={currentPath} />
        </article>
        <Footer />
      </main>
    </>
  );
}
