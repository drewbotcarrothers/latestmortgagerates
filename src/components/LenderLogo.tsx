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
  const height = size === "xs" ? 20 : size === "sm" ? 28 : size === "md" ? 32 : 40;
  const text =
    size === "xs" ? "text-[9px]" : size === "sm" ? "text-[10px]" : size === "lg" ? "text-sm" : "text-xs";
  return (
    <span
      role="img"
      aria-label={label}
      className={`${text} inline-flex items-center justify-center rounded-md font-bold text-white shrink-0 shadow-sm`}
      style={{ width: height, height, backgroundColor: color }}
    >
      {initials}
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
  const box = record && record.kind === "logo" && record.file
    ? logoBox(record.width, record.height, size)
    : null;

  const mark =
    record?.kind === "logo" && record.file && box ? (
      <span
        className="inline-flex items-center justify-center shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white p-0.5 box-border"
        style={{ width: box.width, height: box.height }}
      >
        <img
          src={`/logos/${record.file}`}
          alt={label}
          width={box.width}
          height={box.height}
          loading={loading}
          decoding="async"
          className="max-h-full max-w-full object-contain"
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
    <span className="inline-flex items-center gap-2 min-w-0">
      {mark}
      {showText ? <span className="font-medium text-slate-900 truncate">{name}</span> : null}
    </span>
  );
}
