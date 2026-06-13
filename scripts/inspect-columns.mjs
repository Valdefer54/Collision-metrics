import { S3Client, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { parquetReadObjects } from "hyparquet";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually
const envPath = resolve(process.cwd(), ".env.local");
const env = Object.fromEntries(
  readFileSync(envPath, "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const s3 = new S3Client({
  region: env.B2_REGION ?? "auto",
  endpoint: `https://${env.B2_ENDPOINT}`,
  credentials: {
    accessKeyId: env.B2_ACCESS_KEY_ID,
    secretAccessKey: env.B2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = env.B2_BUCKET_NAME;

const DATASETS = [
  { id: "2lep",          path: "2lep/Data/Gold/Data.parquet" },
  { id: "3lep",          path: "3lep/Data/Gold/Data.parquet" },
  { id: "4lep",          path: "4lep/Data/Gold/Data.parquet" },
  { id: "1largeRjet1lep",path: "1largeRjet1lep/Data/Gold/Data.parquet" },
  { id: "Gamma-Gamma",   path: "Gamma-Gamma/Data/Gold/Data.parquet" },
  { id: "exactly2lep",   path: "exactly2lep/Data/Gold/Data.parquet" },
];

async function readParquet(key) {
  const head = await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
  const byteLength = head.ContentLength;

  const file = {
    byteLength,
    async slice(start, end) {
      const rangeEnd = (end ?? byteLength) - 1;
      const resp = await s3.send(
        new GetObjectCommand({ Bucket: BUCKET, Key: key, Range: `bytes=${start}-${rangeEnd}` })
      );
      const bytes = await resp.Body.transformToByteArray();
      return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    },
  };

  const rows = await parquetReadObjects({ file, rowEnd: 1 });
  return rows[0] ?? {};
}

for (const ds of DATASETS) {
  process.stdout.write(`\n=== ${ds.id} ===\n`);
  try {
    const row = await readParquet(ds.path);
    const cols = Object.entries(row).map(([k, v]) => `  ${k}: ${typeof v} (${v})`);
    console.log(cols.join("\n"));
  } catch (e) {
    console.log(`  ERROR: ${e.message}`);
  }
}
