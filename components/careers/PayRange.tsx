import { DollarSign } from "lucide-react";

interface PayRangeProps {
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryType?: string | null;
}

const TYPE_LABELS: Record<string, string> = {
  hourly: "/hr",
  annual: "/yr",
  "per-diem": "/day",
};

function formatPay(value: number, type: string | null | undefined): string {
  if (type === "annual") {
    return value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`;
  }
  return `$${value}`;
}

export function PayRange({ salaryMin, salaryMax, salaryType }: PayRangeProps) {
  if (!salaryMin && !salaryMax) return null;

  const suffix = TYPE_LABELS[salaryType ?? ""] || "";
  let label: string;

  if (salaryMin && salaryMax) {
    label = `${formatPay(salaryMin, salaryType)}–${formatPay(salaryMax, salaryType)}${suffix}`;
  } else if (salaryMin) {
    label = `From ${formatPay(salaryMin, salaryType)}${suffix}`;
  } else {
    label = `Up to ${formatPay(salaryMax!, salaryType)}${suffix}`;
  }

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400/70 bg-emerald-500/[0.08] border border-emerald-500/[0.12] px-2.5 py-1 rounded-sm">
      <DollarSign className="w-3 h-3" />
      {label}
    </span>
  );
}
