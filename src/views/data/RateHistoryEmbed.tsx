import WeeklyRateChart, { type WeeklySeriesMeta } from "@/components/WeeklyRateChart";

const HISTORY_PAGE_URL = "https://latestmortgagerates.ca/mortgage-rate-history/";

export default function RateHistoryEmbed({
  svg,
  series,
}: {
  svg: string;
  series: WeeklySeriesMeta[];
}) {
  return (
    <main className="bg-white px-4 py-4 text-slate-800">
      <h1 className="text-lg font-semibold text-slate-900">Canadian mortgage rate history (weekly)</h1>
      <div className="mt-3">
        <WeeklyRateChart svg={svg} series={series} />
      </div>
      <p className="mt-3 text-sm text-slate-600">
        Source:{" "}
        <a href={HISTORY_PAGE_URL} className="font-medium text-teal-700 hover:underline" target="_top" rel="noopener">
          Latest Mortgage Rates
        </a>
      </p>
    </main>
  );
}
