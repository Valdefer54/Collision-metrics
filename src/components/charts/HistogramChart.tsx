"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { buildHistogram } from "@/lib/histogram";
import type { RawRow, ChartConfig } from "@/lib/types";

interface Props {
  rows: RawRow[];
  config: ChartConfig;
  color: string;
}

export default function HistogramChart({ rows, config, color }: Props) {
  const data = buildHistogram(
    rows,
    config.xColumn,
    config.bins ?? 60,
    config.xMin ?? 0,
    config.xMax ?? 500
  );

  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest px-1">
        {config.title}
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 20, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis
            dataKey="x"
            tickFormatter={(v: number) => v.toFixed(0)}
            label={{ value: config.xLabel, position: "insideBottom", offset: -12, fill: "#94a3b8", fontSize: 11 }}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <YAxis
            label={{ value: config.yLabel, angle: -90, position: "insideLeft", fill: "#94a3b8", fontSize: 11 }}
            tick={{ fill: "#64748b", fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 6 }}
            labelFormatter={(v) => `${config.xColumn}: ${Number(v).toFixed(2)}`}
            formatter={(v) => [v, "Events"]}
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
          />
          <Bar dataKey="count" fill={color} isAnimationActive={rows.length > 0} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
