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

async function s3AsyncBuffer(s3Path: string): Promise<AsyncBuffer> {
  const { Bucket, Key } = parseS3Path(s3Path);
  const head = await s3.send(new HeadObjectCommand({ Bucket, Key }));
  const byteLength = head.ContentLength!;

  return {
    byteLength,
    async slice(start: number, end?: number): Promise<ArrayBuffer> {
      const rangeEnd = (end ?? byteLength) - 1;
      const resp = await s3.send(
        new GetObjectCommand({ Bucket, Key, Range: `bytes=${start}-${rangeEnd}` })
      );
      const bytes = await resp.Body!.transformToByteArray();
      return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
    },
  };
}

export async function sampleRows(s3Path: string, sampleSize = 20000): Promise<RawRow[]> {
  const file = await s3AsyncBuffer(s3Path);
  return (await parquetReadObjects({ file, rowEnd: sampleSize })) as RawRow[];
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
