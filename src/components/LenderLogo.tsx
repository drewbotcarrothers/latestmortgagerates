import { logoBox, lenderLogoRecord, monogramFor, type LogoSize } from "@/lib/lenderLogos";

interface LenderLogoProps {
  lenderSlug: string;
  size?: LogoSize;
  showText?: boolean;
  /** Above-the-fold marks should load immediately. Everything else stays lazy. */
  loading?: "lazy" | "eager";
}

function Monogram({
  initials,
  color,
  size,
  label,
}: {
  initials: string;
  color: string;
  size: LogoSize;
  label: string;
}) {
  const box = logoBox(size);
  const mark = box.height;
  const text =
    size === "xs" ? "text-[9px]" : size === "sm" ? "text-[10px]" : size === "lg" ? "text-sm" : "text-xs";
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-inset ring-slate-200"
      style={{ width: box.width, height: box.height }}
    >
      <span
        role="img"
        aria-label={label}
        className={`${text} inline-flex items-center justify-center rounded font-bold text-white`}
        style={{ width: mark, height: mark, backgroundColor: color }}
      >
        {initials}
      </span>
    </span>
  );
}

export default function LenderLogo({
  lenderSlug,
  size = "md",
  showText = true,
  loading = "lazy",
}: LenderLogoProps) {
  const record = lenderLogoRecord(lenderSlug);
  const name = record?.name || lenderSlug;
  const label = `${name} logo`;
  const box = logoBox(size);

  const mark =
    record?.kind === "logo" && record.file ? (
      <span
        className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-white ring-1 ring-inset ring-slate-200"
        style={{ width: box.width, height: box.height }}
      >
        <img
          src={`/logos/${record.file}`}
          alt={label}
          width={box.width}
          height={box.height}
          loading={loading}
          decoding="async"
          className="block h-full w-full max-w-none object-contain"
          style={{ width: box.width, height: box.height }}
        />
      </span>
    ) : (
      <Monogram
        initials={record?.initials || monogramFor(lenderSlug, name).initials}
        color={record?.color || monogramFor(lenderSlug, name).color}
        size={size}
        label={label}
      />
    );

  return (
    <span className={`inline-flex items-center gap-2 ${showText ? "min-w-0 max-w-full" : "shrink-0"}`}>
      {mark}
      {showText ? <span className="min-w-0 truncate font-medium text-slate-900">{name}</span> : null}
    </span>
  );
}
