import type { RawRow } from "./types";

function randn(): number {
  const u = 1 - Math.random();
  const v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function gaussian(mean: number, sigma: number): number {
  return mean + sigma * randn();
}

function uniform(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function generateMockRows(datasetId: string, n = 20000): RawRow[] {
  const rows: RawRow[] = [];
  for (let i = 0; i < n; i++) rows.push(generateRow(datasetId));
  return rows;
}

function generateRow(id: string): RawRow {
  switch (id) {
    case "2leptons": {
      const invariant_mass = Math.random() < 0.6
        ? Math.abs(gaussian(91.2, 3.5))
        : uniform(2, 200);
      return {
        invariant_mass,
        HT:              Math.abs(gaussian(90, 30)),
        delta_eta:       gaussian(0, 1.5),
        delta_phi:       uniform(-Math.PI, Math.PI),
        transverse_mass: Math.abs(gaussian(60, 25)),
        met_significance: Math.abs(gaussian(3, 2)),
      };
    }
    case "3leptons": {
      const best_mll_z = Math.abs(gaussian(91.2, 5));
      return {
        inv_mass_3l:  Math.abs(gaussian(120, 40)),
        best_mll_z,
        lep_pt_W:     Math.abs(gaussian(40, 15)),
        ht_3l:        Math.abs(gaussian(180, 60)),
        min_dr_ll:    Math.abs(gaussian(1.5, 0.8)),
      };
    }
    case "1largerjet": {
      return {
        ht_boosted:         Math.abs(gaussian(500, 150)),
        large_jet_mass:     Math.abs(gaussian(80, 40)),
        large_jet_tau32:    Math.min(1, Math.abs(gaussian(0.6, 0.2))),
        mt_w:               Math.abs(gaussian(60, 25)),
        delta_R_lep_fatjet: Math.abs(gaussian(3.5, 1.0)),
        met_significance:   Math.abs(gaussian(4, 2)),
      };
    }
    case "gammagamma": {
      const m_yy = Math.random() < 0.05
        ? gaussian(125, 2)
        : uniform(105, 160);
      return {
        m_yy,
        photon_pt_0:  Math.abs(gaussian(60, 20)),
        photon_pt_1:  Math.abs(gaussian(40, 15)),
        photon_eta_0: gaussian(0, 1.2),
        pt_yy:        Math.abs(gaussian(30, 20)),
      };
    }
    case "4leptons": {
      const m4l = Math.random() < 0.15
        ? gaussian(125, 3)
        : uniform(80, 250);
      return {
        m4l,
        lep_pt_0:  Math.abs(gaussian(50, 15)),
        lep_pt_1:  Math.abs(gaussian(35, 12)),
        lep_pt_2:  Math.abs(gaussian(25, 10)),
        lep_pt_3:  Math.abs(gaussian(15, 8)),
        lep_eta_0: gaussian(0, 1.2),
        lep_phi_0: uniform(-Math.PI, Math.PI),
      };
    }
    default:
      return { invariant_mass: uniform(0, 200) };
  }
}
