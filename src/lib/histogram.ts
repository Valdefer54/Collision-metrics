import type { BinEntry, RawRow } from "./types";

export function buildHistogram(
  rows: RawRow[],
  column: string,
  bins: number,
  xMin: number,
  xMax: number
): BinEntry[] {
  const step = (xMax - xMin) / bins;
  const counts = new Array<number>(bins).fill(0);

  for (const row of rows) {
    const val = Number(row[column]);
    if (isNaN(val) || val < xMin || val > xMax) continue;
    const idx = Math.min(Math.floor((val - xMin) / step), bins - 1);
    counts[idx]++;
  }

  return counts.map((count, i) => ({
    x: xMin + (i + 0.5) * step,
    count,
    label: `${(xMin + i * step).toFixed(1)}–${(xMin + (i + 1) * step).toFixed(1)}`,
  }));
}
