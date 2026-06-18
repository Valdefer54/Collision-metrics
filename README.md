# CollisionMetrics

An interactive data application for exploring real particle collision data from the **ATLAS detector** at CERN's Large Hadron Collider. Real detector measurements stream from cloud storage and are visualized side-by-side against Monte Carlo simulations, with statistical comparison computed in the browser.

**Live demo:** *(deploy URL here)*

---

## Motivation

High-energy physics produces some of the most complex and voluminous datasets in science. This project was built to demonstrate end-to-end data pipeline design — from raw Parquet files in object storage to interactive statistical visualizations — using a real open scientific dataset.

The core analytical question is simple and concrete: *does our theoretical model of particle collisions match what the detector actually measured?* The chi-squared goodness-of-fit test makes this comparison quantitative and immediately visible.

---

## Datasets

All data is sourced from the [CERN Open Data Portal](https://opendata.cern.ch) (CC0 license), collected by the ATLAS detector during Run 2 proton-proton collisions at √s = 13 TeV.

| Channel | Physics process | Key observable |
|---|---|---|
| 2 Leptons | Drell-Yan qq̄ → Z → ℓ⁺ℓ⁻ | Z boson peak at ~91.2 GeV |
| 3 Leptons | WZ → 3ℓ, BSM-sensitive | Tri-lepton invariant mass |
| 1 Large-R Jet | Boosted W/Z/top reconstruction | Jet mass and pT spectra |
| Gamma-Gamma | H → γγ (Higgs search) | Diphoton mass peak at ~125 GeV |
| 4 Leptons | H → ZZ\* → 4ℓ (golden channel) | Higgs mass at ~125 GeV |

Each dataset contains two tables: **real data** collected by the ATLAS detector and a **Monte Carlo simulation** produced with GEANT4 + Pythia8, enabling direct comparison of theoretical predictions against experiment.

---

## Statistical Analysis

For each observable and dataset pair, the application computes:

- **Descriptive statistics** — mean, standard deviation, min, max across up to 20,000 events
- **Histogram normalization** — equal-width binning with configurable range, rendered at matching scales for visual comparison
- **Chi-squared goodness-of-fit** (χ²/NDF) — quantifies agreement between measured data and Monte Carlo simulation bin-by-bin; a value near 1.0 indicates good agreement

The chi-squared result is displayed as a color-coded badge (green/yellow/red) so agreement quality is immediately scannable without reading numbers.

---

## Architecture

```
ATLAS Open Data (Parquet files)
        │
        ▼
Backblaze B2 Object Storage (S3-compatible)
        │
        │  Range-request reads via AWS SDK
        ▼
Next.js API Route — serverless, Node.js runtime
        │  hyparquet decodes Parquet in memory
        │  Rows batched and streamed as NDJSON
        ▼
Browser (React)
        │  Reads NDJSON stream incrementally
        │  Histograms update live as data arrives
        ▼
Recharts — histogram rendering
Stats engine — chi-squared, descriptive stats (pure JS, no library)
```

Key design decisions:
- **Streaming over single payload** — the browser starts rendering histograms after the first batch (~2,000 events), not after all 20,000 arrive. This keeps perceived latency low even on slow connections.
- **Server-side S3 access** — credentials never leave the server; the browser only sees the processed rows.
- **Single configuration file** — `src/lib/datasets.ts` is the only file that knows about bucket paths, column names, and chart ranges. Adding a new dataset requires editing only that file.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Node.js serverless) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Parquet decoding | hyparquet |
| Object storage | Backblaze B2 (S3-compatible) |
| Cloud SDK | AWS SDK v3 |
| Deployment | Vercel |

---

## Local Setup

### Prerequisites

- Node.js 18+
- A Backblaze B2 bucket containing the datasets in Parquet format
- A B2 Application Key with read-only permissions on that bucket

### Steps

```bash
git clone https://github.com/your-username/collision-metrics.git
cd collision-metrics
npm install

cp .env.example .env.local
# Fill in your B2 credentials in .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app includes a **demo mode** that generates realistic synthetic data when no credentials are configured, so the UI can be explored without a bucket.

### Environment variables

| Variable | Description |
|---|---|
| `B2_ENDPOINT` | S3-compatible endpoint (e.g. `s3.us-west-004.backblazeb2.com`) |
| `B2_REGION` | Region (e.g. `us-west-004`) |
| `B2_BUCKET_NAME` | Bucket name |
| `B2_ACCESS_KEY_ID` | Application key ID |
| `B2_SECRET_ACCESS_KEY` | Application key secret |

### Deployment (Vercel)

1. Push the repository to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Add the five environment variables above under **Settings → Environment Variables**.
4. Deploy.

The `vercel.json` at the project root sets a 60-second function timeout on the streaming endpoint to accommodate cold-start latency on large Parquet files.

---

## Data Source

Datasets are from the **[CERN Open Data Portal](https://opendata.cern.ch)** and are published under a [Creative Commons CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) license.

---

## License

MIT
