import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  THANK_YOU_BUTTON,
  THANK_YOU_FILES,
  THANK_YOU_FOLDER_BUTTON,
  THANK_YOU_H1,
  THANK_YOU_NOTE,
  THANK_YOU_PENDING,
} from "@/lib/guide";

const DISPLAY_PARAMS = ["session_id", "utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;

export default function ThankYouPage({
  downloadUrl = "",
  folderUrl = "",
}: {
  /** Zip. Set PUBLIC_GUIDE_DOWNLOAD_URL at build time. */
  downloadUrl?: string;
  /** Drive folder. Set PUBLIC_GUIDE_FOLDER_URL at build time. */
  folderUrl?: string;
}) {
  const [params, setParams] = useState<Partial<Record<(typeof DISPLAY_PARAMS)[number], string>>>({});
  const zipHref = downloadUrl.trim();
  const folderHref = folderUrl.trim();
  const hasDownload = Boolean(zipHref || folderHref);

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const next: Partial<Record<(typeof DISPLAY_PARAMS)[number], string>> = {};
    for (const key of DISPLAY_PARAMS) {
      const value = search.get(key);
      if (value) next[key] = value;
    }
    setParams(next);
  }, []);

  const reference = params.session_id;

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">Mortgage Guide + Renewal Toolkit</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">{THANK_YOU_H1}</h1>
        <p className="mt-4 text-slate-600">{THANK_YOU_NOTE}</p>

        {hasDownload ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {folderHref ? (
              <a
                href={folderHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-6 py-3 text-base font-semibold text-white hover:bg-teal-700"
              >
                {THANK_YOU_FOLDER_BUTTON}
              </a>
            ) : null}
            {zipHref ? (
              <a
                href={zipHref}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  folderHref
                    ? "inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-teal-800 ring-1 ring-teal-600 hover:bg-teal-50"
                    : "inline-flex items-center justify-center rounded-lg bg-teal-600 px-6 py-3 text-base font-semibold text-white hover:bg-teal-700"
                }
              >
                {THANK_YOU_BUTTON}
              </a>
            ) : null}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-slate-800">{THANK_YOU_PENDING}</p>
        )}

        <h2 className="mt-10 text-xl font-bold text-slate-900">Your files</h2>
        <ul className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {THANK_YOU_FILES.map((file) => (
            <li key={file} className="px-4 py-3 text-slate-800">{file}</li>
          ))}
        </ul>

        {reference ? (
          <p className="mt-6 text-sm text-slate-500">
            Reference: <span className="font-medium text-slate-700">{reference}</span>
          </p>
        ) : null}
      </div>
      <Footer />
    </main>
  );
}
