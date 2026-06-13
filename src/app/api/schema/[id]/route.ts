import { NextRequest, NextResponse } from "next/server";
import { getDataset } from "@/lib/datasets";
import { sampleRows } from "@/lib/duckdb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dataset = getDataset(id);

  if (!dataset) {
    return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
  }

  if (!process.env.B2_ACCESS_KEY_ID) {
    return NextResponse.json({ error: "No B2 credentials — running in mock mode" }, { status: 400 });
  }

  try {
    const rows = await sampleRows(dataset.measuredPath, 3);
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    const sample = rows[0] ?? null;

    return NextResponse.json({
      dataset: id,
      measuredPath: dataset.measuredPath,
      mcPath: dataset.mcPath,
      columns,
      sample,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
