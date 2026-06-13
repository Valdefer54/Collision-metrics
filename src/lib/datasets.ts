// ─── DATASET CONFIGURATION ───────────────────────────────────────────────────
// This is the ONLY file that defines dataset structure.
// To add/change a dataset: edit here only. The rest of the app is data-driven.
// ─────────────────────────────────────────────────────────────────────────────

import type { DatasetConfig } from "./types";

const BUCKET = process.env.B2_BUCKET_NAME ?? "your-bucket-name";

export const DATASETS: DatasetConfig[] = [
  {
    id: "2leptons",
    name: "2 Leptons",
    shortName: "2L",
    description: "Events with two leptons — dimuon/dielectron channel from the CMS detector.",
    physics: "The invariant mass of the lepton pair reconstructs the Z boson peak (~91 GeV).",
    measuredPath: `s3://${BUCKET}/2leptons_data.parquet`,
    mcPath: `s3://${BUCKET}/2leptons_mc.parquet`,
    columns: [
      { key: "M",   label: "Invariant Mass", unit: "GeV/c²" },
      { key: "pt1", label: "pT lepton 1",    unit: "GeV/c"  },
      { key: "pt2", label: "pT lepton 2",    unit: "GeV/c"  },
      { key: "eta1",label: "η lepton 1",     unit: ""       },
      { key: "eta2",label: "η lepton 2",     unit: ""       },
      { key: "phi1",label: "φ lepton 1",     unit: "rad"    },
    ],
    charts: [
      { id: "mass", title: "Invariant Mass M",    type: "histogram", xColumn: "M",   xLabel: "M (GeV/c²)", yLabel: "Events", bins: 100, xMin: 0,    xMax: 200  },
      { id: "pt1",  title: "pT lepton 1",         type: "histogram", xColumn: "pt1", xLabel: "pT (GeV/c)", yLabel: "Events", bins: 60,  xMin: 0,    xMax: 120  },
      { id: "eta1", title: "Pseudorapidity η",    type: "histogram", xColumn: "eta1",xLabel: "η",          yLabel: "Events", bins: 50,  xMin: -3,   xMax: 3    },
      { id: "phi1", title: "Azimuthal angle φ",   type: "histogram", xColumn: "phi1",xLabel: "φ (rad)",    yLabel: "Events", bins: 50,  xMin: -3.2, xMax: 3.2  },
    ],
  },
  {
    id: "3leptons",
    name: "3 Leptons",
    shortName: "3L",
    description: "Events with three leptons — tri-lepton channel from the CMS detector.",
    physics: "This channel is sensitive to processes beyond the Standard Model.",
    measuredPath: `s3://${BUCKET}/3leptons_data.parquet`,
    mcPath: `s3://${BUCKET}/3leptons_mc.parquet`,
    columns: [
      { key: "M",   label: "Invariant Mass", unit: "GeV/c²" },
      { key: "pt1", label: "pT lepton 1",    unit: "GeV/c"  },
      { key: "pt2", label: "pT lepton 2",    unit: "GeV/c"  },
      { key: "pt3", label: "pT lepton 3",    unit: "GeV/c"  },
      { key: "eta1",label: "η lepton 1",     unit: ""       },
    ],
    charts: [
      { id: "mass", title: "Invariant Mass M",  type: "histogram", xColumn: "M",   xLabel: "M (GeV/c²)", yLabel: "Events", bins: 80,  xMin: 0,  xMax: 300 },
      { id: "pt1",  title: "pT lepton 1",       type: "histogram", xColumn: "pt1", xLabel: "pT (GeV/c)", yLabel: "Events", bins: 60,  xMin: 0,  xMax: 120 },
      { id: "pt2",  title: "pT lepton 2",       type: "histogram", xColumn: "pt2", xLabel: "pT (GeV/c)", yLabel: "Events", bins: 60,  xMin: 0,  xMax: 120 },
      { id: "eta1", title: "Pseudorapidity η",  type: "histogram", xColumn: "eta1",xLabel: "η",          yLabel: "Events", bins: 50,  xMin: -3, xMax: 3   },
    ],
  },
  {
    id: "1largerjet",
    name: "1 Large-R Jet",
    shortName: "1J",
    description: "Events with one large-radius jet — boosted object reconstruction.",
    physics: "Wide-radius jets capture the decay products of massive high-momentum particles.",
    measuredPath: `s3://${BUCKET}/1largerjet_data.parquet`,
    mcPath: `s3://${BUCKET}/1largerjet_mc.parquet`,
    columns: [
      { key: "M",  label: "Jet mass", unit: "GeV/c²" },
      { key: "pt", label: "Jet pT",   unit: "GeV/c"  },
      { key: "eta",label: "Jet η",    unit: ""       },
      { key: "phi",label: "Jet φ",    unit: "rad"    },
    ],
    charts: [
      { id: "mass", title: "Jet Mass",            type: "histogram", xColumn: "M",  xLabel: "M (GeV/c²)", yLabel: "Events", bins: 80, xMin: 0,    xMax: 400  },
      { id: "pt",   title: "Transverse Momentum", type: "histogram", xColumn: "pt", xLabel: "pT (GeV/c)", yLabel: "Events", bins: 60, xMin: 0,    xMax: 600  },
      { id: "eta",  title: "Pseudorapidity η",    type: "histogram", xColumn: "eta",xLabel: "η",          yLabel: "Events", bins: 50, xMin: -3,   xMax: 3    },
      { id: "phi",  title: "Azimuthal angle φ",   type: "histogram", xColumn: "phi",xLabel: "φ (rad)",    yLabel: "Events", bins: 50, xMin: -3.2, xMax: 3.2  },
    ],
  },
  {
    id: "gammagamma",
    name: "Gamma-Gamma",
    shortName: "γγ",
    description: "Events with two photons — Higgs boson search channel H→γγ.",
    physics: "The diphoton invariant mass peak at ~125 GeV is the signature of the Higgs boson.",
    measuredPath: `s3://${BUCKET}/gammagamma_data.parquet`,
    mcPath: `s3://${BUCKET}/gammagamma_mc.parquet`,
    columns: [
      { key: "M",   label: "Invariant Mass", unit: "GeV/c²" },
      { key: "pt1", label: "pT photon 1",    unit: "GeV/c"  },
      { key: "pt2", label: "pT photon 2",    unit: "GeV/c"  },
      { key: "eta1",label: "η photon 1",     unit: ""       },
    ],
    charts: [
      { id: "mass", title: "Diphoton Invariant Mass Mγγ", type: "histogram", xColumn: "M",   xLabel: "M (GeV/c²)", yLabel: "Events", bins: 80, xMin: 100, xMax: 180 },
      { id: "pt1",  title: "pT photon 1",                 type: "histogram", xColumn: "pt1", xLabel: "pT (GeV/c)", yLabel: "Events", bins: 60, xMin: 0,   xMax: 200 },
      { id: "pt2",  title: "pT photon 2",                 type: "histogram", xColumn: "pt2", xLabel: "pT (GeV/c)", yLabel: "Events", bins: 60, xMin: 0,   xMax: 200 },
      { id: "eta1", title: "Pseudorapidity η",            type: "histogram", xColumn: "eta1",xLabel: "η",          yLabel: "Events", bins: 50, xMin: -3,  xMax: 3   },
    ],
  },
  {
    id: "4leptons",
    name: "4 Leptons",
    shortName: "4L",
    description: "Events with four leptons — the golden channel H→ZZ→4l from CMS.",
    physics: "Low background rate; the ~125 GeV peak is direct evidence of the Higgs boson.",
    measuredPath: `s3://${BUCKET}/4leptons_data.parquet`,
    mcPath: `s3://${BUCKET}/4leptons_mc.parquet`,
    columns: [
      { key: "M",   label: "Invariant Mass", unit: "GeV/c²" },
      { key: "pt1", label: "pT lepton 1",    unit: "GeV/c"  },
      { key: "pt2", label: "pT lepton 2",    unit: "GeV/c"  },
      { key: "eta1",label: "η lepton 1",     unit: ""       },
      { key: "phi1",label: "φ lepton 1",     unit: "rad"    },
    ],
    charts: [
      { id: "mass", title: "4-Lepton Invariant Mass M4l", type: "histogram", xColumn: "M",   xLabel: "M (GeV/c²)", yLabel: "Events", bins: 80,  xMin: 80,   xMax: 180  },
      { id: "pt1",  title: "pT lepton 1",                 type: "histogram", xColumn: "pt1", xLabel: "pT (GeV/c)", yLabel: "Events", bins: 60,  xMin: 0,    xMax: 120  },
      { id: "eta1", title: "Pseudorapidity η",            type: "histogram", xColumn: "eta1",xLabel: "η",          yLabel: "Events", bins: 50,  xMin: -3,   xMax: 3    },
      { id: "phi1", title: "Azimuthal angle φ",           type: "histogram", xColumn: "phi1",xLabel: "φ (rad)",    yLabel: "Events", bins: 50,  xMin: -3.2, xMax: 3.2  },
    ],
  },
];

export function getDataset(id: string): DatasetConfig | undefined {
  return DATASETS.find((d) => d.id === id);
}
