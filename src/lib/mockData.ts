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
        lep_pt_0:  Math.abs(gaussian(40, 15)),
        lep_pt_1:  Math.abs(gaussian(25, 12)),
        lep_eta_0: gaussian(0, 1.2),
        lep_eta_1: gaussian(0, 1.2),
        lep_phi_0: uniform(-Math.PI, Math.PI),
        met_et:    Math.abs(gaussian(20, 15)),
      };
    }
    case "3leptons": {
      const best_mll_z = Math.abs(gaussian(91.2, 5));
      return {
        inv_mass_3l: Math.abs(gaussian(120, 40)),
        best_mll_z,
        lep_pt_0:    Math.abs(gaussian(50, 20)),
        lep_pt_1:    Math.abs(gaussian(30, 15)),
        lep_pt_2:    Math.abs(gaussian(20, 10)),
        lep_eta_0:   gaussian(0, 1.2),
      };
    }
    case "1largerjet": {
      return {
        largeRjet_pt_0:  Math.abs(gaussian(300, 100)),
        // large_jet_mass is stored in MeV in real data
        large_jet_mass:  Math.abs(gaussian(60000, 30000)),
        largeRjet_eta_0: gaussian(0, 1.0),
        lep_pt_0:        Math.abs(gaussian(80, 30)),
        met_et:          Math.abs(gaussian(60, 40)),
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
      return {
        invariant_mass: uniform(0, 200),
        lep_pt_0:       uniform(0, 100),
        lep_eta_0:      gaussian(0, 1),
      };
  }
}
