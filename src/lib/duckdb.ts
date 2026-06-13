import { S3Client, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { parquetReadObjects } from 'hyparquet';
import type { AsyncBuffer } from 'hyparquet';
import type { RawRow } from './types';

const s3 = new S3Client({
  region: process.env.B2_REGION ?? 'auto',
  endpoint: `https://${process.env.B2_ENDPOINT ?? ''}`,
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY ?? '',
  },
  forcePathStyle: true,
});

function parseS3Path(s3Path: string): { Bucket: string; Key: string } {
  const url = new URL(s3Path);
  return { Bucket: url.hostname, Key: url.pathname.slice(1) };
}

function classifyS3Error(err: unknown, s3Path: string): Error {
  const raw = err instanceof Error ? err.message : String(err);
  const code: string =
    (err as { Code?: string })?.Code ??
    (err as { name?: string })?.name ??
    '';

  if (code === 'NoSuchKey') return new Error(`File not found in bucket: ${s3Path}`);
  if (code === 'NoSuchBucket') return new Error(`Bucket does not exist: ${s3Path.split('/')[2]}`);
  if (code === 'AccessDenied' || code === 'InvalidAccessKeyId')
    return new Error(`S3 access denied (${code}) — check B2_ACCESS_KEY_ID / B2_SECRET_ACCESS_KEY`);
  if (code === 'SignatureDoesNotMatch')
    return new Error(`S3 signature mismatch — B2_SECRET_ACCESS_KEY may be wrong`);
  if (raw.includes('ECONNREFUSED') || raw.includes('ENOTFOUND') || raw.includes('fetch failed'))
    return new Error(`Cannot reach S3 endpoint "${process.env.B2_ENDPOINT ?? '(not set)'}" — ${raw}`);
  if (!process.env.B2_ENDPOINT)
    return new Error(`B2_ENDPOINT env var is not set`);

  return new Error(`S3 error for ${s3Path}: ${raw}${code ? ` (${code})` : ''}`);
}

async function s3AsyncBuffer(s3Path: string): Promise<AsyncBuffer> {
  const { Bucket, Key } = parseS3Path(s3Path);

  let byteLength: number;
  try {
    const head = await s3.send(new HeadObjectCommand({ Bucket, Key }));
    byteLength = head.ContentLength!;
  } catch (err) {
    throw classifyS3Error(err, s3Path);
  }

  return {
    byteLength,
    async slice(start: number, end?: number): Promise<ArrayBuffer> {
      const rangeEnd = (end ?? byteLength) - 1;
      let resp;
      try {
        resp = await s3.send(
          new GetObjectCommand({ Bucket, Key, Range: `bytes=${start}-${rangeEnd}` })
        );
      } catch (err) {
        throw classifyS3Error(err, s3Path);
      }
      const bytes = await resp.Body!.transformToByteArray();
      return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    },
  };
}

export async function sampleRows(s3Path: string, sampleSize = 20000): Promise<RawRow[]> {
  const file = await s3AsyncBuffer(s3Path);
  try {
    return (await parquetReadObjects({ file, rowEnd: sampleSize })) as RawRow[];
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to parse parquet file ${s3Path}: ${msg}`);
  }
}

export async function* streamRows(
  s3Path: string,
  sampleSize = 20000,
  batchSize = 2000
): AsyncGenerator<RawRow[]> {
  const allRows = await sampleRows(s3Path, sampleSize);
  for (let i = 0; i < allRows.length; i += batchSize) {
    yield allRows.slice(i, i + batchSize);
  }
}
