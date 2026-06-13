import duckdb from "duckdb";
import type { RawRow } from "./types";

// DuckDB instance is created once per serverless invocation.
function createDb(): duckdb.Database {
  const db = new duckdb.Database(":memory:");
  return db;
}

function configureS3(conn: duckdb.Connection): Promise<void> {
  return new Promise((resolve, reject) => {
    const endpoint = process.env.B2_ENDPOINT ?? "";
    const keyId = process.env.B2_ACCESS_KEY_ID ?? "";
    const secret = process.env.B2_SECRET_ACCESS_KEY ?? "";
    const region = process.env.B2_REGION ?? "auto";

    conn.run(
      `
      INSTALL httpfs;
      LOAD httpfs;
      CREATE OR REPLACE SECRET b2_secret (
        TYPE S3,
        KEY_ID '${keyId}',
        SECRET '${secret}',
        REGION '${region}',
        ENDPOINT '${endpoint}',
        URL_STYLE 'path'
      );
      `,
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export async function sampleRows(
  s3Path: string,
  sampleSize = 20000
): Promise<RawRow[]> {
  const db = createDb();
  const conn = db.connect();

  await configureS3(conn);

  return new Promise((resolve, reject) => {
    conn.all(
      `SELECT * FROM read_parquet('${s3Path}') USING SAMPLE ${sampleSize} ROWS`,
      (err, rows) => {
        db.close();
        if (err) reject(err);
        else resolve(rows as RawRow[]);
      }
    );
  });
}

// Streaming variant — yields rows in batches for ReadableStream usage.
export async function* streamRows(
  s3Path: string,
  sampleSize = 20000,
  batchSize = 2000
): AsyncGenerator<RawRow[]> {
  const db = createDb();
  const conn = db.connect();
  await configureS3(conn);

  const allRows = await new Promise<RawRow[]>((resolve, reject) => {
    conn.all(
      `SELECT * FROM read_parquet('${s3Path}') USING SAMPLE ${sampleSize} ROWS`,
      (err, rows) => {
        db.close();
        if (err) reject(err);
        else resolve(rows as RawRow[]);
      }
    );
  });

  for (let i = 0; i < allRows.length; i += batchSize) {
    yield allRows.slice(i, i + batchSize);
  }
}
