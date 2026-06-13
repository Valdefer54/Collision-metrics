export interface DatasetConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  physics: string;
  measuredPath: string;
  mcPath: string;
  columns: ColumnConfig[];
  charts: ChartConfig[];
}

export interface ColumnConfig {
  key: string;
  label: string;
  unit: string;
}

export interface ChartConfig {
  id: string;
  title: string;
  type: "histogram" | "scatter";
  xColumn: string;
  yColumn?: string;
  xLabel: string;
  yLabel: string;
  bins?: number;
  xMin?: number;
  xMax?: number;
}

export interface RawRow {
  [key: string]: number | string;
}

export interface BinEntry {
  x: number;
  count: number;
  label: string;
}

export interface ScatterEntry {
  x: number;
  y: number;
}

export interface DatasetPayload {
  measured: RawRow[];
  mc: RawRow[];
  error?: string;
}

export interface StreamChunk {
  type: "measured" | "mc";
  rows: RawRow[];
  done: boolean;
}
