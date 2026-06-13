import { notFound } from "next/navigation";
import Link from "next/link";
import { getDataset, DATASETS } from "@/lib/datasets";
import DatasetView from "@/components/DatasetView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return DATASETS.map((d) => ({ id: d.id }));
}

export default async function DatasetPage({ params }: Props) {
  const { id } = await params;
  const dataset = getDataset(id);
  if (!dataset) notFound();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-slate-500 hover:text-white transition-colors text-sm flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Home
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-blue-400 font-semibold">{dataset.name}</span>
          <span className="ml-auto text-slate-600 text-xs hidden md:block">
            {dataset.description}
          </span>
        </div>
      </div>

      {/* Legend row */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-2">
        <div className="grid grid-cols-2 gap-4 mb-2">
          <p className="text-center text-xs font-semibold text-sky-400 uppercase tracking-widest">
            ← Real Data (CMS)
          </p>
          <p className="text-center text-xs font-semibold text-orange-400 uppercase tracking-widest">
            Monte Carlo Simulation →
          </p>
        </div>
        <p className="text-center text-slate-600 text-xs mb-6">
          Each row shows the same observable · {dataset.charts.length} metrics · random sample of 20 000 events
        </p>
      </div>

      {/* Charts */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <DatasetView dataset={dataset} />
      </div>
    </main>
  );
}
