"use client";

import Link from "next/link";
import type { DatasetConfig } from "@/lib/types";

interface Props {
  dataset: DatasetConfig;
}

export default function DatasetCard({ dataset }: Props) {
  return (
    <Link
      href={`/dataset/${dataset.id}`}
      className="group relative flex flex-col gap-3 p-6 bg-slate-900 border border-slate-800 rounded-2xl
                 hover:border-blue-500/60 hover:bg-slate-900/80 transition-all duration-200
                 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl font-black text-blue-400 font-mono tracking-tight">
          {dataset.shortName}
        </span>
        <svg
          className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors mt-1"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
      <div>
        <h3 className="font-semibold text-white text-lg leading-tight">{dataset.name}</h3>
        <p className="text-slate-400 text-sm mt-1 leading-relaxed">{dataset.description}</p>
      </div>
      <p className="text-xs text-slate-500 border-t border-slate-800 pt-3 leading-relaxed">
        {dataset.physics}
      </p>
    </Link>
  );
}
