// ─── DATASET CONFIGURATION ───────────────────────────────────────────────────
// This is the ONLY file that defines dataset structure.
// To add/change a dataset: edit here only. The rest of the app is data-driven.
//
// When real bucket data is connected, update:
//   1. measuredPath / mcPath  — actual S3 file paths
//   2. xMin / xMax per chart  — adjust to real data range
//   3. interpretation strings — replace [UPDATE: ...] with observed values
// ─────────────────────────────────────────────────────────────────────────────

import type { DatasetConfig } from "./types";

const BUCKET = process.env.B2_BUCKET_NAME ?? "CollisionMetricsCERN13TeVcollisionopendata";

export const DATASETS: DatasetConfig[] = [
  {
    id: "2leptons",
    name: "2 Leptons",
    shortName: "2L",
    description: "Events with two leptons — dimuon/dielectron channel from the CMS detector.",
    physics: "The invariant mass of the lepton pair reconstructs the Z boson peak (~91 GeV).",
    measuredPath: `s3://${BUCKET}/2lep/Data/Gold/Data.parquet`,
    mcPath: `s3://${BUCKET}/2lep/MC/Gold/Data.parquet`,
    columns: [
      { key: "M",   label: "Invariant Mass", unit: "GeV/c²" },
      { key: "pt1", label: "pT lepton 1",    unit: "GeV/c"  },
      { key: "pt2", label: "pT lepton 2",    unit: "GeV/c"  },
      { key: "eta1",label: "η lepton 1",     unit: ""       },
      { key: "eta2",label: "η lepton 2",     unit: ""       },
      { key: "phi1",label: "φ lepton 1",     unit: "rad"    },
    ],
    charts: [
      {
        id: "mass", title: "Invariant Mass M", type: "histogram",
        xColumn: "M", xLabel: "M (GeV/c²)", yLabel: "Events",
        bins: 100, xMin: 0, xMax: 200,
        interpretation: "The sharp peak at ~91.2 GeV is the Z boson resonance, produced via Drell-Yan qq̄ → Z → ℓ⁺ℓ⁻. The agreement between data and MC in the peak position and width validates the lepton energy/momentum calibration. [UPDATE: confirm peak position and σ from real data fit.]",
      },
      {
        id: "pt1", title: "pT lepton 1", type: "histogram",
        xColumn: "pt1", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 120,
        interpretation: "The steeply falling pT spectrum is characteristic of Drell-Yan production. The turn-on at low pT reflects the single-lepton trigger threshold applied during data-taking. Discrepancies between data and MC at low pT may indicate trigger efficiency corrections not fully modeled. [UPDATE: verify threshold value against real trigger tables.]",
      },
      {
        id: "eta1", title: "Pseudorapidity η", type: "histogram",
        xColumn: "eta1", xLabel: "η", yLabel: "Events",
        bins: 50, xMin: -3, xMax: 3,
        interpretation: "The pseudorapidity distribution reflects CMS detector acceptance. The slight dip near |η| ≈ 1.5 marks the barrel-endcap transition region, where material budget increases and reconstruction efficiency drops. Good data/MC agreement here validates the detector geometry model used in simulation.",
      },
      {
        id: "phi1", title: "Azimuthal angle φ", type: "histogram",
        xColumn: "phi1", xLabel: "φ (rad)", yLabel: "Events",
        bins: 50, xMin: -3.2, xMax: 3.2,
        interpretation: "An approximately uniform φ distribution is expected: the pp collision is azimuthally symmetric. Periodic dips would reveal inactive detector sectors or dead channels. Any significant data/MC discrepancy in φ is a detector effect, not a physics one.",
      },
    ],
  },
  {
    id: "3leptons",
    name: "3 Leptons",
    shortName: "3L",
    description: "Events with three leptons — tri-lepton channel from the CMS detector.",
    physics: "This channel is sensitive to processes beyond the Standard Model.",
    measuredPath: `s3://${BUCKET}/3lep/Data/Gold/Data.parquet`,
    mcPath: `s3://${BUCKET}/3lep/MC/Gold/Data.parquet`,
    columns: [
      { key: "M",   label: "Invariant Mass", unit: "GeV/c²" },
      { key: "pt1", label: "pT lepton 1",    unit: "GeV/c"  },
      { key: "pt2", label: "pT lepton 2",    unit: "GeV/c"  },
      { key: "pt3", label: "pT lepton 3",    unit: "GeV/c"  },
      { key: "eta1",label: "η lepton 1",     unit: ""       },
    ],
    charts: [
      {
        id: "mass", title: "Invariant Mass M", type: "histogram",
        xColumn: "M", xLabel: "M (GeV/c²)", yLabel: "Events",
        bins: 80, xMin: 0, xMax: 300,
        interpretation: "The tri-lepton invariant mass distribution lacks a sharp resonance, reflecting the diverse SM backgrounds (WZ, ZZ, tт̄). An excess over MC prediction could signal BSM processes such as WR or SUSY. [UPDATE: comment on observed data/MC ratio in the high-mass tail.]",
      },
      {
        id: "pt1", title: "pT lepton 1", type: "histogram",
        xColumn: "pt1", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 120,
        interpretation: "The leading lepton carries most of the event pT. The harder spectrum compared to the di-lepton channel reflects the higher invariant mass of the tri-lepton system. [UPDATE: compare mean pT with MC prediction.]",
      },
      {
        id: "pt2", title: "pT lepton 2", type: "histogram",
        xColumn: "pt2", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 120,
        interpretation: "The sub-leading lepton pT is softer, as expected from the phase space of three-body final states. Pile-up and underlying event effects are more visible here than in the leading lepton.",
      },
      {
        id: "eta1", title: "Pseudorapidity η", type: "histogram",
        xColumn: "eta1", xLabel: "η", yLabel: "Events",
        bins: 50, xMin: -3, xMax: 3,
        interpretation: "The η distribution of the leading lepton is similar to the di-lepton case but may show a slightly more central preference due to the higher Q² of the hard process.",
      },
    ],
  },
  {
    id: "1largerjet",
    name: "1 Large-R Jet",
    shortName: "1J",
    description: "Events with one large-radius jet — boosted object reconstruction.",
    physics: "Wide-radius jets capture the decay products of massive high-momentum particles.",
    measuredPath: `s3://${BUCKET}/1largeRjet1lep/Data/Gold/Data.parquet`,
    mcPath: `s3://${BUCKET}/1largeRjet1lep/MC/Gold/Data.parquet`,
    columns: [
      { key: "M",  label: "Jet mass", unit: "GeV/c²" },
      { key: "pt", label: "Jet pT",   unit: "GeV/c"  },
      { key: "eta",label: "Jet η",    unit: ""       },
      { key: "phi",label: "Jet φ",    unit: "rad"    },
    ],
    charts: [
      {
        id: "mass", title: "Jet Mass", type: "histogram",
        xColumn: "M", xLabel: "M (GeV/c²)", yLabel: "Events",
        bins: 80, xMin: 0, xMax: 400,
        interpretation: "The jet mass spectrum rises from zero and peaks around [UPDATE: observe peak from real data] GeV, driven by QCD radiation within the cone. Peaks near 80 or 91 GeV would indicate boosted W/Z bosons reconstructed as a single fat jet — a signature of high-pT vector boson production.",
      },
      {
        id: "pt", title: "Transverse Momentum", type: "histogram",
        xColumn: "pt", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 600,
        interpretation: "The steeply falling jet pT spectrum follows a power law, consistent with QCD Compton and gluon fusion hard scattering. The large-R cone (typically R=0.8 or 1.0) captures substructure relevant for boosted topologies at pT ≳ 200 GeV. [UPDATE: confirm pT range with real data.]",
      },
      {
        id: "eta", title: "Pseudorapidity η", type: "histogram",
        xColumn: "eta", xLabel: "η", yLabel: "Events",
        bins: 50, xMin: -3, xMax: 3,
        interpretation: "Central jets (|η| < 2.4) dominate, as expected for high-pT hard-scattered objects. The η acceptance cut reflects the hadronic calorimeter coverage in CMS.",
      },
      {
        id: "phi", title: "Azimuthal angle φ", type: "histogram",
        xColumn: "phi", xLabel: "φ (rad)", yLabel: "Events",
        bins: 50, xMin: -3.2, xMax: 3.2,
        interpretation: "A flat φ distribution confirms no preferred direction in the transverse plane, as expected for inclusive jet production. Any azimuthal modulation would indicate a detector artifact.",
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
      { key: "M",   label: "Invariant Mass", unit: "GeV/c²" },
      { key: "pt1", label: "pT photon 1",    unit: "GeV/c"  },
      { key: "pt2", label: "pT photon 2",    unit: "GeV/c"  },
      { key: "eta1",label: "η photon 1",     unit: ""       },
    ],
    charts: [
      {
        id: "mass", title: "Diphoton Invariant Mass Mγγ", type: "histogram",
        xColumn: "M", xLabel: "M (GeV/c²)", yLabel: "Events",
        bins: 80, xMin: 100, xMax: 180,
        interpretation: "The smooth continuum background (γγ, γ+jet) is expected from QCD. A narrow excess near 125 GeV is the Higgs boson signal (H→γγ), first observed by CMS and ATLAS in 2012. The signal-to-background ratio is small (~1–3%) but the excellent CMS electromagnetic calorimeter resolution (~1–2 GeV) makes it detectable. [UPDATE: comment on whether signal peak is visible in this sample size.]",
      },
      {
        id: "pt1", title: "pT photon 1", type: "histogram",
        xColumn: "pt1", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 200,
        interpretation: "Signal photons from H→γγ tend to have pT ~ mH/2 ≈ 62.5 GeV, while background photons follow a softer spectrum. Applying pT/Mγγ > 0.33 (0.25) for the leading (subleading) photon is a standard selection to enhance signal purity.",
      },
      {
        id: "pt2", title: "pT photon 2", type: "histogram",
        xColumn: "pt2", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 200,
        interpretation: "The sub-leading photon pT spectrum is softer than the leading one. The ratio pT₂/Mγγ cut is looser (0.25) to retain signal efficiency while suppressing asymmetric QCD backgrounds.",
      },
      {
        id: "eta1", title: "Pseudorapidity η", type: "histogram",
        xColumn: "eta1", xLabel: "η", yLabel: "Events",
        bins: 50, xMin: -3, xMax: 3,
        interpretation: "The photon η acceptance is |η| < 2.5, with a gap at 1.44 < |η| < 1.57 (ECAL barrel-endcap crack). Signal photons are preferentially central; relaxing the η cut to the endcap region increases acceptance but worsens mass resolution.",
      },
    ],
  },
  {
    id: "4leptons",
    name: "4 Leptons",
    shortName: "4L",
    description: "Events with four leptons — the golden channel H→ZZ→4l from CMS.",
    physics: "Low background rate; the ~125 GeV peak is direct evidence of the Higgs boson.",
    measuredPath: `s3://${BUCKET}/4lep/Data/Gold/Data.parquet`,
    mcPath: `s3://${BUCKET}/4lep/MC/Gold/Data.parquet`,
    columns: [
      { key: "M",   label: "Invariant Mass", unit: "GeV/c²" },
      { key: "pt1", label: "pT lepton 1",    unit: "GeV/c"  },
      { key: "pt2", label: "pT lepton 2",    unit: "GeV/c"  },
      { key: "eta1",label: "η lepton 1",     unit: ""       },
      { key: "phi1",label: "φ lepton 1",     unit: "rad"    },
    ],
    charts: [
      {
        id: "mass", title: "4-Lepton Invariant Mass M4l", type: "histogram",
        xColumn: "M", xLabel: "M (GeV/c²)", yLabel: "Events",
        bins: 80, xMin: 80, xMax: 180,
        interpretation: "This is the 'golden channel' for Higgs discovery. The ZZ* continuum forms a broad background, while the Higgs signal appears as a narrow peak near 125 GeV with very low QCD background. The ZZ threshold at ~183 GeV produces a second structure. This channel provided one of the clearest Higgs boson signals in the 2012 discovery paper. [UPDATE: count events in 120–130 GeV window and compare to MC signal prediction.]",
      },
      {
        id: "pt1", title: "pT lepton 1", type: "histogram",
        xColumn: "pt1", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 120,
        interpretation: "The leading lepton in H→ZZ→4l carries roughly mH/4 ≈ 31 GeV of pT on average. The pT distribution is harder than in inclusive Z events because both Z bosons must be reconstructed on-shell (or one off-shell for H mass below 2mZ).",
      },
      {
        id: "eta1", title: "Pseudorapidity η", type: "histogram",
        xColumn: "eta1", xLabel: "η", yLabel: "Events",
        bins: 50, xMin: -3, xMax: 3,
        interpretation: "Four-lepton events tend to be more central than inclusive Z events due to the higher Q² of the Higgs production process (gg→H via top loop). The η distribution should be well-modeled by MC, as leptons from Z→ℓ⁺ℓ⁻ are well-understood in CMS.",
      },
      {
        id: "phi1", title: "Azimuthal angle φ", type: "histogram",
        xColumn: "phi1", xLabel: "φ (rad)", yLabel: "Events",
        bins: 50, xMin: -3.2, xMax: 3.2,
        interpretation: "A flat φ distribution is expected. In signal events, the decay angles of the four leptons in the Higgs rest frame carry spin-parity information (H is 0⁺), but this is not visible in the inclusive φ distribution shown here.",
      },
    ],
  },
];

export function getDataset(id: string): DatasetConfig | undefined {
  return DATASETS.find((d) => d.id === id);
}
