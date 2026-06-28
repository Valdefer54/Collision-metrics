// ─── DATASET CONFIGURATION ───────────────────────────────────────────────────
// Column names are derived from the real parquet files in the Gold bucket.
// 2lep/3lep/1largeRjet Gold files contain derived aggregate variables only
// (individual lepton kinematics were dropped by the pipeline).
// 4lep and gammagamma Gold files retain raw ntuple columns + derived quantities.
// All energies in GeV unless noted.
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
      { key: "HT",             label: "H_T",             unit: "GeV"    },
      { key: "delta_eta",      label: "Δη leptons",      unit: ""       },
      { key: "delta_phi",      label: "Δφ leptons",      unit: "rad"    },
      { key: "transverse_mass",label: "Transverse Mass", unit: "GeV/c²" },
      { key: "met_significance",label: "MET significance",unit: ""      },
    ],
    charts: [
      {
        id: "mass", title: "Invariant Mass", type: "histogram",
        xColumn: "invariant_mass", xLabel: "M (GeV/c²)", yLabel: "Events",
        bins: 100, xMin: 50, xMax: 150,
        interpretation: "The sharp peak at ~91.2 GeV is the Z boson resonance, produced via Drell-Yan qq̄ → Z → ℓ⁺ℓ⁻. The agreement between data and MC in the peak position and width validates the lepton energy/momentum calibration.",
      },
      {
        id: "ht", title: "H_T (Scalar pT Sum)", type: "histogram",
        xColumn: "HT", xLabel: "H_T (GeV)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 300,
        interpretation: "H_T is the scalar sum of lepton transverse momenta. For Z→ℓℓ events it peaks near the Z mass (~91 GeV). The tail at high H_T reflects events where the Z is produced with significant boost from initial-state radiation.",
      },
      {
        id: "deta", title: "Δη (Lepton Separation)", type: "histogram",
        xColumn: "delta_eta", xLabel: "Δη", yLabel: "Events",
        bins: 50, xMin: -5, xMax: 5,
        interpretation: "The pseudorapidity difference Δη between the two leptons reflects the boost of the Z along the beam axis. A narrow Δη distribution indicates central Z production from symmetric quark-antiquark annihilation at the Z peak.",
      },
      {
        id: "dphi", title: "Δφ (Lepton Azimuthal Separation)", type: "histogram",
        xColumn: "delta_phi", xLabel: "Δφ (rad)", yLabel: "Events",
        bins: 50, xMin: -3.2, xMax: 3.2,
        interpretation: "The azimuthal angle difference Δφ between the leptons peaks near π for back-to-back Z→ℓℓ decays. Events with small Δφ arise when the Z acquires transverse momentum from initial-state radiation.",
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
      { key: "inv_mass_3l",   label: "3-Lepton Invariant Mass", unit: "GeV/c²" },
      { key: "best_mll_z",    label: "Z candidate mass",        unit: "GeV/c²" },
      { key: "lep_pt_W",      label: "pT lepton (W)",           unit: "GeV/c"  },
      { key: "ht_3l",         label: "H_T (3 leptons)",         unit: "GeV"    },
      { key: "min_dr_ll",     label: "min ΔR(ℓℓ)",              unit: ""       },
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
        id: "ptW", title: "pT of W-lepton Candidate", type: "histogram",
        xColumn: "lep_pt_W", xLabel: "pT (GeV/c)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 150,
        interpretation: "The transverse momentum of the lepton assigned to the W boson candidate. The spectrum peaks at ~40 GeV, reflecting the W mass and the V-A structure of W→ℓν decay.",
      },
      {
        id: "ht", title: "H_T (3 Leptons)", type: "histogram",
        xColumn: "ht_3l", xLabel: "H_T (GeV)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 500,
        interpretation: "Scalar sum of the three lepton pTs. For WZ production it peaks around 100–200 GeV. An excess at high H_T could indicate BSM processes such as SUSY or heavy resonances decaying to multi-lepton final states.",
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
      { key: "ht_boosted",        label: "H_T (boosted)",       unit: "GeV"    },
      { key: "large_jet_mass",    label: "Large-R jet mass",    unit: "GeV/c²" },
      { key: "large_jet_tau32",   label: "τ₃₂ substructure",   unit: ""       },
      { key: "mt_w",              label: "W transverse mass",   unit: "GeV/c²" },
      { key: "delta_R_lep_fatjet",label: "ΔR(ℓ, jet)",         unit: ""       },
      { key: "met_significance",  label: "MET significance",    unit: ""       },
    ],
    charts: [
      {
        id: "ht", title: "H_T (Boosted)", type: "histogram",
        xColumn: "ht_boosted", xLabel: "H_T (GeV)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 1000,
        interpretation: "H_T in boosted events reflects the energy scale of the hard scattering. Boosted topologies require H_T ≳ 300 GeV so that massive particles are produced with enough pT to have collimated decay products inside a large-R jet.",
      },
      {
        id: "jetmass", title: "Large-R Jet Mass", type: "histogram",
        xColumn: "large_jet_mass", xLabel: "M_jet (GeV/c²)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 250,
        interpretation: "QCD jets peak at low mass (~10–30 GeV). Peaks near 80 GeV or 91 GeV indicate boosted W or Z bosons reconstructed as a single fat jet. A shoulder near 173 GeV would signal top quarks in the fully-hadronic or semi-leptonic boosted regime.",
      },
      {
        id: "dr", title: "ΔR(lepton, large-R jet)", type: "histogram",
        xColumn: "delta_R_lep_fatjet", xLabel: "ΔR", yLabel: "Events",
        bins: 50, xMin: 0, xMax: 6,
        interpretation: "The angular separation between the isolated lepton and the large-R jet. In semi-leptonic top events (t→Wb→ℓνb), the lepton from W and the fat jet (capturing the b or full hadronic top) are well-separated (ΔR > 2). A minimum ΔR cut is applied to suppress overlap.",
      },
      {
        id: "mtw", title: "W Transverse Mass", type: "histogram",
        xColumn: "mt_w", xLabel: "m_T^W (GeV/c²)", yLabel: "Events",
        bins: 60, xMin: 0, xMax: 300,
        interpretation: "Transverse mass of the W candidate (lepton + MET). For W→ℓν decays, m_T peaks below the W mass (~80 GeV) due to the unmeasured neutrino longitudinal momentum. This distribution directly tests the W production model.",
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
