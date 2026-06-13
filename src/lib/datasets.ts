// ─── DATASET CONFIGURATION ───────────────────────────────────────────────────
// Column names and ranges are derived from the real parquet files in the bucket.
// All energies/momenta in GeV unless noted as MeV (largeRjet mass variables).
// ─────────────────────────────────────────────────────────────────────────────

import type { DatasetConfig } from "./types";

const BUCKET = process.env.B2_BUCKET_NAME ?? "CollisionMetricsCERN13TeVcollisionopendata";

export const DATASETS: DatasetConfig[] = [
  {
    id: "2leptons",
    name: "2 Leptons",
    shortName: "2L",
    description: "Events with two leptons — dimuon/dielectron channel from the ATLAS detector.",
    physics: "The invariant mass of the lepton pair reconstructs the Z boson peak (~91 GeV).",
    measuredPath: `s3://${BUCKET}/2lep/Data/Gold/Data.parquet`,
    mcPath: `s3://${BUCKET}/2lep/MC/Gold/Data.parquet`,
    columns: [
      { key: "invariant_mass", label: "Invariant Mass",  unit: "GeV/c²" },
      { key: "lep_pt_0",       label: "pT lepton 1",     unit: "GeV/c"  },
      { key: "lep_pt_1",       label: "pT lepton 2",     unit: "GeV/c"  },
      { key: "lep_eta_0",      label: "η lepton 1",      unit: ""       },
      { key: "lep_eta_1",      label: "η lepton 2",      unit: ""       },
      { key: "lep_phi_0",      label: "φ lepton 1",      unit: "rad"    },
      { key: "met_et",         label: "Missing ET",       unit: "GeV"   },
    ],
    charts: [
      {
        id: "mass", title: "Invariant Mass", type: "histogram",
        xColumn: "invariant_mass", xLabel: "M (GeV/c²)", yLabel: "Events",
        bins: 100, xMin: 50, xMax: 150,
        interpretation: "The sharp peak at ~91.2 GeV is the Z boson resonance, produced via Drell-Yan qq̄ → Z → ℓ⁺ℓ⁻. The agreement between data and MC in the peak position and width validates the lepton energy/momentum calibration.",
      },
      {
        id: "pt1", title: "pT lepton 1", type: "histogram",
        xColumn: "lep_pt_0", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 150,
        interpretation: "The steeply falling pT spectrum is characteristic of Drell-Yan production. The turn-on at low pT reflects the single-lepton trigger threshold applied during data-taking.",
      },
      {
        id: "eta1", title: "Pseudorapidity η lepton 1", type: "histogram",
        xColumn: "lep_eta_0", xLabel: "η", yLabel: "Events",
        bins: 50, xMin: -3, xMax: 3,
        interpretation: "The pseudorapidity distribution reflects ATLAS detector acceptance. The slight dip near |η| ≈ 1.5 marks the barrel-endcap transition region where reconstruction efficiency drops.",
      },
      {
        id: "phi1", title: "Azimuthal angle φ lepton 1", type: "histogram",
        xColumn: "lep_phi_0", xLabel: "φ (rad)", yLabel: "Events",
        bins: 50, xMin: -3.2, xMax: 3.2,
        interpretation: "An approximately uniform φ distribution is expected: the pp collision is azimuthally symmetric. Periodic dips would reveal inactive detector sectors or dead channels.",
      },
    ],
  },
  {
    id: "3leptons",
    name: "3 Leptons",
    shortName: "3L",
    description: "Events with three leptons — tri-lepton channel from the ATLAS detector.",
    physics: "This channel is sensitive to WZ production and processes beyond the Standard Model.",
    measuredPath: `s3://${BUCKET}/3lep/Data/Gold/Data.parquet`,
    mcPath: `s3://${BUCKET}/3lep/MC/Gold/Data.parquet`,
    columns: [
      { key: "inv_mass_3l", label: "3-Lepton Invariant Mass", unit: "GeV/c²" },
      { key: "best_mll_z",  label: "Z candidate mass",        unit: "GeV/c²" },
      { key: "lep_pt_0",    label: "pT lepton 1",             unit: "GeV/c"  },
      { key: "lep_pt_1",    label: "pT lepton 2",             unit: "GeV/c"  },
      { key: "lep_pt_2",    label: "pT lepton 3",             unit: "GeV/c"  },
      { key: "lep_eta_0",   label: "η lepton 1",              unit: ""       },
    ],
    charts: [
      {
        id: "mass", title: "3-Lepton Invariant Mass", type: "histogram",
        xColumn: "inv_mass_3l", xLabel: "M₃ₗ (GeV/c²)", yLabel: "Events",
        bins: 80, xMin: 0, xMax: 300,
        interpretation: "The tri-lepton invariant mass distribution lacks a sharp resonance, reflecting diverse SM backgrounds (WZ, ZZ, tt̄). An excess over MC prediction could signal BSM processes such as WR or SUSY.",
      },
      {
        id: "zmass", title: "Z Candidate Mass", type: "histogram",
        xColumn: "best_mll_z", xLabel: "M_Z (GeV/c²)", yLabel: "Events",
        bins: 60, xMin: 50, xMax: 150,
        interpretation: "The best same-flavor opposite-sign lepton pair is selected as the Z candidate. The peak at ~91 GeV confirms Z+lepton topology (WZ → 3ℓ), the dominant SM background in this channel.",
      },
      {
        id: "pt1", title: "pT lepton 1", type: "histogram",
        xColumn: "lep_pt_0", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 150,
        interpretation: "The leading lepton carries most of the event pT. The harder spectrum compared to the di-lepton channel reflects the higher invariant mass of the tri-lepton system.",
      },
      {
        id: "eta1", title: "Pseudorapidity η lepton 1", type: "histogram",
        xColumn: "lep_eta_0", xLabel: "η", yLabel: "Events",
        bins: 50, xMin: -3, xMax: 3,
        interpretation: "The η distribution of the leading lepton may show a slightly more central preference due to the higher Q² of the hard process compared to inclusive Z production.",
      },
    ],
  },
  {
    id: "1largerjet",
    name: "1 Large-R Jet",
    shortName: "1J",
    description: "Events with one large-radius jet and one lepton — boosted object reconstruction.",
    physics: "Wide-radius jets capture the decay products of massive high-momentum particles (W, Z, top).",
    measuredPath: `s3://${BUCKET}/1largeRjet1lep/Data/Gold/Data.parquet`,
    mcPath: `s3://${BUCKET}/1largeRjet1lep/MC/Gold/Data.parquet`,
    columns: [
      { key: "largeRjet_pt_0",  label: "Large-R jet pT",   unit: "GeV/c"   },
      { key: "large_jet_mass",  label: "Large-R jet mass",  unit: "MeV/c²"  },
      { key: "largeRjet_eta_0", label: "Jet η",             unit: ""        },
      { key: "lep_pt_0",        label: "Lepton pT",         unit: "GeV/c"   },
      { key: "met_et",          label: "Missing ET",        unit: "GeV"     },
      { key: "large_jet_tau32", label: "τ₃₂ substructure",  unit: ""        },
    ],
    charts: [
      {
        id: "jetpt", title: "Large-R Jet pT", type: "histogram",
        xColumn: "largeRjet_pt_0", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 600,
        interpretation: "The large-R jet pT spectrum falls steeply following a power law. Boosted topologies require pT ≳ 200 GeV so that the decay products of a W/Z/top fit within the large cone (typically R=1.0 in ATLAS).",
      },
      {
        id: "jetmass", title: "Large-R Jet Mass", type: "histogram",
        xColumn: "large_jet_mass", xLabel: "M_jet (MeV/c²)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 250000,
        interpretation: "The jet mass is stored in MeV (divide by 1000 for GeV). QCD jets peak at low mass (~10–30 GeV = 10000–30000 MeV). Peaks near 80000 or 91000 MeV would indicate boosted W or Z bosons reconstructed as a single fat jet.",
      },
      {
        id: "jeteta", title: "Jet Pseudorapidity η", type: "histogram",
        xColumn: "largeRjet_eta_0", xLabel: "η", yLabel: "Events",
        bins: 50, xMin: -3, xMax: 3,
        interpretation: "Central large-R jets (|η| < 2.0) dominate, as expected for high-pT hard-scattered objects. The acceptance cut reflects the hadronic calorimeter coverage in ATLAS.",
      },
      {
        id: "met", title: "Missing Transverse Energy", type: "histogram",
        xColumn: "met_et", xLabel: "E_T^miss (GeV)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 300,
        interpretation: "Missing ET indicates the presence of neutrinos from W→ℓν decay. High MET events are enriched in semi-leptonic top quark decays (t→Wb→ℓνb) reconstructed in the boosted regime.",
      },
    ],
  },
  {
    id: "gammagamma",
    name: "Gamma-Gamma",
    shortName: "γγ",
    description: "Events with two photons — Higgs boson search channel H→γγ.",
    physics: "The diphoton invariant mass peak at ~125 GeV is the signature of the Higgs boson.",
    measuredPath: `s3://${BUCKET}/Gamma-Gamma/Data/Gold/Data.parquet`,
    mcPath: `s3://${BUCKET}/Gamma-Gamma/MC/Gold/Data.parquet`,
    columns: [
      { key: "m_yy",        label: "Diphoton Invariant Mass", unit: "GeV/c²" },
      { key: "photon_pt_0", label: "pT photon 1",             unit: "GeV/c"  },
      { key: "photon_pt_1", label: "pT photon 2",             unit: "GeV/c"  },
      { key: "photon_eta_0",label: "η photon 1",              unit: ""       },
      { key: "pt_yy",       label: "Diphoton pT",             unit: "GeV/c"  },
    ],
    charts: [
      {
        id: "mass", title: "Diphoton Invariant Mass Mγγ", type: "histogram",
        xColumn: "m_yy", xLabel: "M_γγ (GeV/c²)", yLabel: "Events",
        bins: 55, xMin: 105, xMax: 160,
        interpretation: "The smooth continuum background (γγ, γ+jet) is expected from QCD. A narrow excess near 125 GeV is the Higgs boson signal (H→γγ), first observed by CMS and ATLAS in 2012. The excellent ATLAS electromagnetic calorimeter resolution (~1–2 GeV) makes the narrow peak detectable above background.",
      },
      {
        id: "pt1", title: "pT photon 1", type: "histogram",
        xColumn: "photon_pt_0", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 200,
        interpretation: "Signal photons from H→γγ tend to have pT ~ mH/2 ≈ 62.5 GeV, while background photons follow a softer spectrum. The selection pT/Mγγ > 0.35 for the leading photon suppresses QCD backgrounds.",
      },
      {
        id: "pt2", title: "pT photon 2", type: "histogram",
        xColumn: "photon_pt_1", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 150,
        interpretation: "The sub-leading photon pT is softer than the leading one. The ratio cut pT₂/Mγγ > 0.25 is looser to retain signal efficiency while suppressing asymmetric QCD backgrounds.",
      },
      {
        id: "eta1", title: "Pseudorapidity η photon 1", type: "histogram",
        xColumn: "photon_eta_0", xLabel: "η", yLabel: "Events",
        bins: 50, xMin: -3, xMax: 3,
        interpretation: "The photon η acceptance is |η| < 2.37, with a gap at 1.37 < |η| < 1.52 (ATLAS ECAL barrel-endcap crack). Signal photons are preferentially central; the crack region degrades mass resolution.",
      },
    ],
  },
  {
    id: "4leptons",
    name: "4 Leptons",
    shortName: "4L",
    description: "Events with four leptons — the golden channel H→ZZ→4l from ATLAS.",
    physics: "Low background rate; the ~125 GeV peak is direct evidence of the Higgs boson.",
    measuredPath: `s3://${BUCKET}/4lep/Data/Gold/Data.parquet`,
    mcPath: `s3://${BUCKET}/4lep/MC/Gold/Data.parquet`,
    columns: [
      { key: "m4l",      label: "4-Lepton Invariant Mass", unit: "GeV/c²" },
      { key: "lep_pt_0", label: "pT lepton 1",             unit: "GeV/c"  },
      { key: "lep_pt_1", label: "pT lepton 2",             unit: "GeV/c"  },
      { key: "lep_pt_2", label: "pT lepton 3",             unit: "GeV/c"  },
      { key: "lep_pt_3", label: "pT lepton 4",             unit: "GeV/c"  },
      { key: "lep_eta_0",label: "η lepton 1",              unit: ""       },
      { key: "lep_phi_0",label: "φ lepton 1",              unit: "rad"    },
    ],
    charts: [
      {
        id: "mass", title: "4-Lepton Invariant Mass M₄ₗ", type: "histogram",
        xColumn: "m4l", xLabel: "M₄ₗ (GeV/c²)", yLabel: "Events",
        bins: 80, xMin: 80, xMax: 250,
        interpretation: "The 'golden channel' for Higgs discovery. The ZZ* continuum forms a broad background, while the Higgs signal appears as a narrow peak near 125 GeV with very low QCD background. This channel provided one of the clearest Higgs boson signals in the 2012 discovery paper.",
      },
      {
        id: "pt1", title: "pT lepton 1", type: "histogram",
        xColumn: "lep_pt_0", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 120,
        interpretation: "The leading lepton in H→ZZ→4l carries roughly mH/4 ≈ 31 GeV of pT on average. The pT distribution is harder than in inclusive Z events because both Z bosons must be on-shell (or one off-shell for mH < 2mZ).",
      },
      {
        id: "eta1", title: "Pseudorapidity η lepton 1", type: "histogram",
        xColumn: "lep_eta_0", xLabel: "η", yLabel: "Events",
        bins: 50, xMin: -3, xMax: 3,
        interpretation: "Four-lepton events tend to be more central than inclusive Z events due to the higher Q² of the Higgs production process (gg→H via top loop). The η distribution should be well-modeled by MC.",
      },
      {
        id: "phi1", title: "Azimuthal angle φ lepton 1", type: "histogram",
        xColumn: "lep_phi_0", xLabel: "φ (rad)", yLabel: "Events",
        bins: 50, xMin: -3.2, xMax: 3.2,
        interpretation: "A flat φ distribution is expected. In signal events, the decay angles of the four leptons in the Higgs rest frame carry spin-parity information (H is 0⁺), but this is not visible in the inclusive φ distribution.",
      },
    ],
  },
];

export function getDataset(id: string): DatasetConfig | undefined {
  return DATASETS.find((d) => d.id === id);
}
