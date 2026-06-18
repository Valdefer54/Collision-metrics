"use client";

import { useEffect, useRef, useState } from "react";
import type { DatasetConfig, RawRow } from "@/lib/types";
import HistogramChart from "./charts/HistogramChart";
import DescriptiveStats from "./stats/DescriptiveStats";
import AgreementBadge from "./stats/AgreementBadge";
import InterpretationCard from "./InterpretationCard";
import LoadingState from "./ui/LoadingState";
import { computeStats } from "@/lib/stats";
import { computeChiSquared } from "@/lib/chiSquared";
import { buildHistogram } from "@/lib/histogram";

interface Props {
  dataset: DatasetConfig;
}

interface DataState {
  measured: RawRow[];
  mc: RawRow[];
  measuredDone: boolean;
  mcDone: boolean;
  error: string | null;
  isMock: boolean;
  retryCount: number;
}

const MEASURED_COLOR = "#38bdf8"; // sky-400
const MC_COLOR = "#fb923c";       // orange-400

export default function DatasetView({ dataset }: Props) {
  const [data, setData] = useState<DataState>({
    measured: [],
    mc: [],
    measuredDone: false,
    mcDone: false,
    error: null,
    isMock: false,
    retryCount: 0,
  });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setData((prev) => ({ measured: [], mc: [], measuredDone: false, mcDone: false, error: null, isMock: false, retryCount: prev.retryCount }));

    (async () => {
      try {
        const res = await fetch(`/api/dataset/${dataset.id}`, {
          signal: controller.signal,
        });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        if (res.headers.get("X-Data-Source") === "mock") {
          setData((prev) => ({ ...prev, isMock: true }));
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.trim()) continue;
            const chunk = JSON.parse(line) as { type: string; rows?: RawRow[]; done?: boolean; message?: string };

            if (chunk.type === "error") {
              setData((prev) => ({ ...prev, error: chunk.message ?? "Unknown error" }));
              return;
            }

            if (chunk.type === "measured") {
              if (chunk.done) {
                setData((prev) => ({ ...prev, measuredDone: true }));
              } else {
                setData((prev) => ({ ...prev, measured: [...prev.measured, ...(chunk.rows ?? [])] }));
              }
            }

            if (chunk.type === "mc") {
              if (chunk.done) {
                setData((prev) => ({ ...prev, mcDone: true }));
              } else {
                setData((prev) => ({ ...prev, mc: [...prev.mc, ...(chunk.rows ?? [])] }));
              }
            }
          }
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setData((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Connection error",
        }));
      }
    })();

    return () => controller.abort();
  }, [dataset.id, data.retryCount]);

  const totalExpected = 40000;
  const received = data.measured.length + data.mc.length;
  const progress = Math.min(100, Math.round((received / totalExpected) * 100));
  const bothDone = data.measuredDone && data.mcDone;
  const anyData = data.measured.length > 0 || data.mc.length > 0;

  if (data.error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="max-w-xl w-full bg-red-950/30 border border-red-500/30 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-red-300 font-semibold text-sm">Failed to load dataset "{dataset.name}"</p>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed border border-slate-700 bg-slate-900/60 rounded px-3 py-2">
                {data.error}
              </p>
              <button
                onClick={() => setData((prev) => ({ ...prev, error: null, retryCount: prev.retryCount + 1 }))}
                className="mt-3 text-xs text-red-400 hover:text-red-300 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!anyData) {
    return <LoadingState progress={0} label="Loading dataset..." />;
  }

  return (
    <div className="flex flex-col gap-6">
      {data.isMock && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>
            <strong>Demo mode</strong> — Credentials not configured. Showing generated data with realistic physics distributions.
          </span>
        </div>
      )}

      {!bothDone && (
        <LoadingState progress={progress} label="Receiving collision data..." />
      )}

      {/* Column headers */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-500/30 rounded-lg">
          <span className="w-3 h-3 rounded-full bg-sky-400" />
          <span className="text-sky-300 text-sm font-semibold">Real Data (ATLAS)</span>
          <span className="ml-auto text-slate-500 text-xs">{data.measured.length.toLocaleString()} events</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <span className="w-3 h-3 rounded-full bg-orange-400" />
          <span className="text-orange-300 text-sm font-semibold">Monte Carlo Simulation</span>
          <span className="ml-auto text-slate-500 text-xs">{data.mc.length.toLocaleString()} events</span>
        </div>
      </div>

      {/* Chart rows — each row: histograms + stats + χ² + interpretation */}
      <div className="flex flex-col gap-10">
        {dataset.charts.map((chartCfg) => {
          const unit = dataset.columns.find((c) => c.key === chartCfg.xColumn)?.unit ?? "";
          const measuredStats = computeStats(data.measured, chartCfg.xColumn);
          const mcStats = computeStats(data.mc, chartCfg.xColumn);

          const bins = chartCfg.bins ?? 60;
          const xMin = chartCfg.xMin ?? 0;
          const xMax = chartCfg.xMax ?? 500;
          const measuredHist = buildHistogram(data.measured, chartCfg.xColumn, bins, xMin, xMax);
          const mcHist = buildHistogram(data.mc, chartCfg.xColumn, bins, xMin, xMax);
          const agreement = computeChiSquared(measuredHist, mcHist);

          return (
            <div key={chartCfg.id} className="flex flex-col gap-2">
              {/* Histograms side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <HistogramChart rows={data.measured} config={chartCfg} color={MEASURED_COLOR} />
                  <DescriptiveStats stats={measuredStats} unit={unit} color="sky" />
                </div>
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                  <HistogramChart rows={data.mc} config={chartCfg} color={MC_COLOR} />
                  <DescriptiveStats stats={mcStats} unit={unit} color="orange" />
                </div>
              </div>

              {/* χ² agreement indicator */}
              {bothDone && agreement.ndf > 0 && (
                <AgreementBadge result={agreement} />
              )}

              {/* Physics interpretation */}
              {chartCfg.interpretation && (
                <InterpretationCard text={chartCfg.interpretation} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
