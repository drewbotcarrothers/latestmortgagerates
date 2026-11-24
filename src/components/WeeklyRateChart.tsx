export interface WeeklySeriesMeta {
  key: string;
  label: string;
  color: string;
  dash: boolean;
}

export default function WeeklyRateChart({
  svg,
  series,
}: {
  svg: string;
  series: WeeklySeriesMeta[];
}) {
  return (
    <figure>
      <div
        className="overflow-x-auto rounded-lg border border-slate-200 bg-white p-3"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-700">
        {series.map((item) => (
          <li key={item.key} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block w-6"
              style={{
                borderTopWidth: 2,
                borderTopStyle: item.dash ? "dashed" : "solid",
                borderTopColor: item.color,
              }}
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-2 text-sm text-slate-500">
        Rates are percent. A break in a line is a week with no stored observation for that series.
      </figcaption>
    </figure>
  );
}
