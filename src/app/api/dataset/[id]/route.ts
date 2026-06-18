import { NextRequest } from "next/server";
import { getDataset } from "@/lib/datasets";
import { streamRows } from "@/lib/duckdb";
import { generateMockRows } from "@/lib/mockData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MOCK_MODE = !process.env.B2_ACCESS_KEY_ID;
const BATCH_SIZE = 2000;

function* batchRows(rows: import("@/lib/types").RawRow[], size: number) {
  for (let i = 0; i < rows.length; i += size) {
    yield rows.slice(i, i + size);
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dataset = getDataset(id);

  if (!dataset) {
    return new Response(JSON.stringify({ error: "Dataset not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (MOCK_MODE) {
          // No credentials — serve generated data so the UI can be previewed
          for (const batch of batchRows(generateMockRows(id), BATCH_SIZE)) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: "measured", rows: batch, done: false }) + "\n"));
          }
          controller.enqueue(encoder.encode(JSON.stringify({ type: "measured", rows: [], done: true }) + "\n"));

          for (const batch of batchRows(generateMockRows(id), BATCH_SIZE)) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: "mc", rows: batch, done: false }) + "\n"));
          }
          controller.enqueue(encoder.encode(JSON.stringify({ type: "mc", rows: [], done: true }) + "\n"));
        } else {
          // Real S3 data via DuckDB
          for await (const batch of streamRows(dataset.measuredPath)) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: "measured", rows: batch, done: false }) + "\n"));
          }
          controller.enqueue(encoder.encode(JSON.stringify({ type: "measured", rows: [], done: true }) + "\n"));

          for await (const batch of streamRows(dataset.mcPath)) {
            controller.enqueue(encoder.encode(JSON.stringify({ type: "mc", rows: batch, done: false }) + "\n"));
          }
          controller.enqueue(encoder.encode(JSON.stringify({ type: "mc", rows: [], done: true }) + "\n"));
        }
      } catch (err) {
        console.error(`[dataset/${id}] stream error:`, err);
        const msg = err instanceof Error ? err.message : "Unknown error";
        controller.enqueue(encoder.encode(JSON.stringify({ type: "error", message: msg }) + "\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-store",
      ...(MOCK_MODE && { "X-Data-Source": "mock" }),
    },
  });
}
