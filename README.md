# CollisionMetrics

> Interactive visualization of CERN open particle collision data — real detector measurements vs. Monte Carlo simulations, streamed live from object storage.

## Overview

CollisionMetrics is a full-stack web application that lets physics enthusiasts and educators explore LHC proton-proton collision data from the **CMS detector** at CERN without downloading any files or writing a single line of code.

Clicking a dataset triggers a live serverless query against a Backblaze B2 (S3-compatible) bucket using **DuckDB**. A random sample of 20 000 events streams to the browser via NDJSON chunked transfer, where **Recharts** renders histograms in real time. Each observable is shown **side-by-side** — measured data on the left, Monte Carlo simulation on the right — at the exact same scale, enabling immediate visual comparison.

---

## Physics Background

| Dataset | Physics Channel | Key Observable |
|---|---|---|
| 2 Leptons | Dimuon / di-electron | Z boson peak at ~91 GeV |
| 3 Leptons | Tri-lepton | BSM-sensitive multi-lepton channel |
| 1 Large-R Jet | Boosted jet | Jet mass and pT spectra |
| Gamma-Gamma | H → γγ | Diphoton mass peak at ~125 GeV (Higgs) |
| 4 Leptons | H → ZZ → 4l | "Golden channel" Higgs mass at ~125 GeV |

Each dataset contains two tables: **real data** collected by CMS and a **Monte Carlo simulation** produced with GEANT4 + Pythia, allowing direct comparison of theory predictions against experiment.

---

## Architecture

```
Browser (React + Recharts)
    │  fetch /api/dataset/[id]  (NDJSON stream)
    ▼
Next.js API Route (Node.js serverless)
    │  DuckDB + httpfs extension
    ▼
Backblaze B2 Bucket (S3-compatible)
    ├── [dataset]_data.parquet   ← CMS measured events
    └── [dataset]_mc.parquet     ← Monte Carlo simulation
```

**Why this design is robust to dataset changes:**  
`src/lib/datasets.ts` is the single file that knows about bucket paths and column names. Adding or replacing a dataset requires editing only that file — the API route, streaming logic, chart components, and pages are all data-driven.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | [Next.js 15](https://nextjs.org) (App Router) |
| UI styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Charts | [Recharts](https://recharts.org) |
| Query engine | [DuckDB Node.js](https://duckdb.org) with `httpfs` extension |
| Object storage | [Backblaze B2](https://www.backblaze.com/b2/cloud-storage.html) (S3-compatible) |
| Deployment | [Vercel](https://vercel.com) (Hobby — free tier) |
| Language | TypeScript |

---

## Local Development

### Prerequisites

- Node.js 18+
- A Backblaze B2 bucket with the datasets in Parquet format
- B2 Application Key with read permissions

### Setup

```bash
git clone https://github.com/your-username/collision-metrics.git
cd collision-metrics

npm install

# Copy environment template and fill in your B2 credentials
cp .env.example .env.local
```

Edit `.env.local`:

```env
B2_ENDPOINT=s3.us-west-004.backblazeb2.com
B2_REGION=us-west-004
B2_BUCKET_NAME=your-bucket-name
B2_ACCESS_KEY_ID=your-key-id
B2_SECRET_ACCESS_KEY=your-secret-key
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Dataset Configuration

All dataset metadata lives in **`src/lib/datasets.ts`**. To add a new dataset or change file paths, edit only that file:

```ts
{
  id: "newdataset",
  name: "New Dataset",
  measuredPath: `s3://${BUCKET}/newdataset_data.parquet`,
  mcPath:       `s3://${BUCKET}/newdataset_mc.parquet`,
  charts: [
    { id: "mass", title: "Invariant Mass", type: "histogram",
      xColumn: "M", xLabel: "M (GeV/c²)", yLabel: "Events",
      bins: 80, xMin: 0, xMax: 300 }
  ],
  // ...
}
```

No changes required in the API route, streaming logic, or chart components.

---

## Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Add the five environment variables from `.env.example` in the Vercel dashboard under **Settings → Environment Variables**.
4. Deploy. Vercel's free Hobby plan covers this project's workload entirely.

> The `vercel.json` at the project root sets the API function timeout to 60 s to accommodate DuckDB's S3 query latency on cold starts.

---

## Data Source

All datasets are sourced from the **[CERN Open Data Portal](https://opendata.cern.ch)** under a [Creative Commons CC0 license](https://creativecommons.org/publicdomain/zero/1.0/), and are hosted in a Backblaze B2 bucket for low-latency access.

---

## License

MIT
