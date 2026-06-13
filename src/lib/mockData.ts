import type { RawRow } from "./types";

function randn(): number {
  // Box-Muller transform
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

// Generate realistic-ish physics distributions per dataset
export function generateMockRows(datasetId: string, n = 20000): RawRow[] {
  const rows: RawRow[] = [];

  for (let i = 0; i < n; i++) {
    rows.push(generateRow(datasetId));
  }
  return rows;
}

function generateRow(id: string): RawRow {
  switch (id) {
    case "2leptons": {
      const M = Math.random() < 0.6
        ? Math.abs(gaussian(91.2, 3.5))   // Z peak
        : uniform(2, 200);
      const pt1 = Math.abs(gaussian(40, 15));
      const pt2 = Math.abs(gaussian(25, 12));
      const eta1 = gaussian(0, 1.2);
      const eta2 = gaussian(0, 1.2);
      const phi1 = uniform(-Math.PI, Math.PI);
      const Q1 = Math.random() < 0.5 ? 1 : -1;
      return { M, pt1, pt2, eta1, eta2, phi1, Q1 };
    }
    case "3leptons": {
      const M = Math.abs(gaussian(120, 40));
      const pt1 = Math.abs(gaussian(50, 20));
      const pt2 = Math.abs(gaussian(30, 15));
      const pt3 = Math.abs(gaussian(20, 10));
      const eta1 = gaussian(0, 1.2);
      return { M, pt1, pt2, pt3, eta1 };
    }
    case "1largerjet": {
      const M = Math.abs(gaussian(80, 25));
      const pt = Math.abs(gaussian(300, 100));
      const eta = gaussian(0, 1.0);
      const phi = uniform(-Math.PI, Math.PI);
      return { M, pt, eta, phi };
    }
    case "gammagamma": {
      const M = Math.random() < 0.05
        ? gaussian(125, 2)                // Higgs peak
        : uniform(100, 180);
      const pt1 = Math.abs(gaussian(60, 20));
      const pt2 = Math.abs(gaussian(40, 15));
      const eta1 = gaussian(0, 1.2);
      return { M, pt1, pt2, eta1 };
    }
    case "4leptons": {
      const M = Math.random() < 0.15
        ? gaussian(125, 3)                // Higgs peak
        : uniform(80, 180);
      const pt1 = Math.abs(gaussian(50, 15));
      const eta1 = gaussian(0, 1.2);
      const phi1 = uniform(-Math.PI, Math.PI);
      return { M, pt1, eta1, phi1 };
    }
    default:
      return { M: uniform(0, 200), pt1: uniform(0, 100), eta1: gaussian(0, 1) };
  }
}
