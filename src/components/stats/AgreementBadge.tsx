"use client";

import type { ChiSquaredResult } from "@/lib/types";

interface Props {
  result: ChiSquaredResult;
}

function label(chi2PerNdf: number): { text: string; classes: string } {
  if (chi2PerNdf < 1.5)  return { text: "Good agreement",  classes: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" };
  if (chi2PerNdf < 3.0)  return { text: "Fair agreement",  classes: "bg-yellow-500/10  border-yellow-500/30  text-yellow-300"  };
  return                         { text: "Poor agreement",  classes: "bg-red-500/10     border-red-500/30     text-red-300"     };
}

export default function AgreementBadge({ result }: Props) {
  if (result.ndf === 0) return null;

  const { text, classes } = label(result.chi2PerNdf);

  return (
    <div className={`flex items-center gap-3 px-3 py-1.5 border rounded-lg text-xs ${classes}`}>
      <span className="font-mono font-semibold">
        χ²/ndf = {result.chi2PerNdf.toFixed(2)}
      </span>
      <span className="text-slate-500">·</span>
      <span className="font-medium">{text}</span>
      <span className="ml-auto text-slate-500 font-mono">
        χ² = {result.chi2.toFixed(1)}, ndf = {result.ndf}
      </span>
    </div>
  );
}
