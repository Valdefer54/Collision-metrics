"use client";

import type { DescriptiveStats as Stats } from "@/lib/types";

interface Props {
  stats: Stats;
  unit: string;
  color: "sky" | "orange";
}

export default function DescriptiveStats({ stats, unit, color }: Props) {
  const text = color === "sky" ? "text-sky-400" : "text-orange-400";

  if (stats.count === 0) {
    return <div className="h-8 bg-slate-800/40 rounded animate-pulse" />;
  }

  const fmt = (v: number) =>
    Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0)
      ? v.toExponential(2)
      : v.toFixed(2);

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 px-1 py-1.5 text-xs text-slate-400">
      <span>
        <span className={`font-semibold ${text}`}>n</span> = {stats.count.toLocaleString()}
      </span>
      <span>
        <span className={`font-semibold ${text}`}>μ</span> = {fmt(stats.mean)}{unit ? ` ${unit}` : ""}
      </span>
      <span>
        <span className={`font-semibold ${text}`}>σ</span> = {fmt(stats.std)}{unit ? ` ${unit}` : ""}
      </span>
      <span>
        <span className={`font-semibold ${text}`}>min</span> = {fmt(stats.min)}
      </span>
      <span>
        <span className={`font-semibold ${text}`}>max</span> = {fmt(stats.max)}
      </span>
    </div>
  );
}
