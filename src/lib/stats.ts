import type { DescriptiveStats, RawRow } from "./types";

export function computeStats(rows: RawRow[], column: string): DescriptiveStats {
  const values: number[] = [];
  for (const row of rows) {
    const v = Number(row[column]);
    if (!isNaN(v)) values.push(v);
  }

  if (values.length === 0) {
    return { count: 0, mean: 0, std: 0, min: 0, max: 0 };
  }

  const count = values.length;
  const mean = values.reduce((s, v) => s + v, 0) / count;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / count;
  const std = Math.sqrt(variance);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return { count, mean, std, min, max };
}
