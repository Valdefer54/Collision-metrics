import DatasetCard from "@/components/DatasetCard";
import { DATASETS } from "@/lib/datasets";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.12)_0%,_transparent_60%)]" />
        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            CERN Open Data — CMS Detector
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">
            Collision<span className="text-blue-400">Metrics</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Interactive exploration of open LHC particle collision data.
            Compare real CMS detector measurements against Monte Carlo simulations in real time.
          </p>
          <p className="text-slate-600 text-sm mt-4">
            20 000 events per sample · Live streaming from S3 · Histograms computed in the browser
          </p>
        </div>
      </div>

      {/* Dataset selector */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
          Select a collision channel
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DATASETS.map((ds) => (
            <DatasetCard key={ds.id} dataset={ds} />
          ))}
        </div>
      </div>

      <footer className="border-t border-slate-900 max-w-5xl mx-auto px-6 py-8 text-center">
        <p className="text-slate-600 text-sm">
          Data from{" "}
          <a
            href="https://opendata.cern.ch"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-blue-400 transition-colors"
          >
            CERN Open Data Portal
          </a>
          {" · "}Visualized with Next.js, DuckDB, and Recharts
        </p>
      </footer>
    </main>
  );
}
