"use client";

import { useEffect, useRef, useState } from "react";
import type { DatasetConfig, RawRow } from "@/lib/types";
import HistogramChart from "./charts/HistogramChart";
import LoadingState from "./ui/LoadingState";

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
  });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setData({ measured: [], mc: [], measuredDone: false, mcDone: false, error: null, isMock: false });

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
  }, [dataset.id]);

  const totalExpected = 40000; // 20k measured + 20k mc
  const received = data.measured.length + data.mc.length;
  const progress = Math.min(100, Math.round((received / totalExpected) * 100));
  const bothDone = data.measuredDone && data.mcDone;
  const anyData = data.measured.length > 0 || data.mc.length > 0;

  if (data.error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-red-400 font-semibold">Failed to load data</p>
          <p className="text-slate-500 text-sm mt-1">{data.error}</p>
        </div>
      </div>
    );
  }

  if (!anyData) {
    return <LoadingState progress={0} label="Connecting to S3 bucket..." />;
  }

  return (
    <div className="flex flex-col gap-6">
      {data.isMock && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-xs">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span>
            <strong>Demo mode</strong> — B2 credentials not configured. Showing generated data with realistic physics distributions.
            Fill in <code className="font-mono bg-amber-500/10 px-1 rounded">.env.local</code> to load real CMS data.
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
          <span className="text-sky-300 text-sm font-semibold">Real Data (CMS)</span>
          <span className="ml-auto text-slate-500 text-xs">{data.measured.length.toLocaleString()} events</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <span className="w-3 h-3 rounded-full bg-orange-400" />
          <span className="text-orange-300 text-sm font-semibold">Monte Carlo Simulation</span>
          <span className="ml-auto text-slate-500 text-xs">{data.mc.length.toLocaleString()} events</span>
        </div>
      </div>

      {/* Side-by-side charts — each row shows the same observable for real vs MC */}
      <div className="flex flex-col gap-8">
        {dataset.charts.map((chartCfg) => (
          <div key={chartCfg.id} className="grid grid-cols-2 gap-4">
            {/* Real data */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <HistogramChart
                rows={data.measured}
                config={chartCfg}
                color={MEASURED_COLOR}
              />
            </div>
            {/* Monte Carlo */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <HistogramChart
                rows={data.mc}
                config={chartCfg}
                color={MC_COLOR}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
