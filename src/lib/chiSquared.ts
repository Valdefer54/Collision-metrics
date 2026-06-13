import type { BinEntry, ChiSquaredResult } from "./types";

export function computeChiSquared(
  measured: BinEntry[],
  mc: BinEntry[]
): ChiSquaredResult {
  if (measured.length === 0 || mc.length === 0) {
    return { chi2: 0, ndf: 0, chi2PerNdf: 0 };
  }

  // Normalize MC to the same total count as measured
  const measuredTotal = measured.reduce((s, b) => s + b.count, 0);
  const mcTotal = mc.reduce((s, b) => s + b.count, 0);
  const scale = mcTotal > 0 ? measuredTotal / mcTotal : 1;

  let chi2 = 0;
  let ndf = 0;

  for (let i = 0; i < Math.min(measured.length, mc.length); i++) {
    const observed = measured[i].count;
    const expected = mc[i].count * scale;

    // Only include bins with enough statistics
    if (expected < 5) continue;

    chi2 += (observed - expected) ** 2 / expected;
    ndf++;
  }

  // Subtract fitted parameters (normalization = 1 free parameter)
  ndf = Math.max(1, ndf - 1);

  return {
    chi2,
    ndf,
    chi2PerNdf: chi2 / ndf,
  };
}
