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

  // Log full details server-side only
  console.error(`[storage] error for ${s3Path} (${code || 'unknown'}): ${raw}`);

  if (code === 'NoSuchKey') return new Error('Data file not found in storage.');
  if (code === 'NoSuchBucket') return new Error('Storage bucket not found. Check server configuration.');
  if (code === 'AccessDenied' || code === 'InvalidAccessKeyId')
    return new Error('Storage access denied. Check server credentials.');
  if (code === 'SignatureDoesNotMatch')
    return new Error('Storage authentication failed. Check server credentials.');
  if (raw.includes('ECONNREFUSED') || raw.includes('ENOTFOUND') || raw.includes('fetch failed'))
    return new Error('Cannot reach storage endpoint. Check server configuration.');
  if (!process.env.B2_ENDPOINT)
    return new Error('Storage endpoint is not configured. Check server configuration.');

  return new Error('Storage error. Check server logs for details.');
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
    console.error(`[storage] failed to parse parquet ${s3Path}: ${msg}`);
    throw new Error('Failed to parse data file. Check server logs for details.');
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
