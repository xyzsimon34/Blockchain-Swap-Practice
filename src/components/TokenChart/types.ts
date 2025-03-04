export type TimeFrame = "1H" | "1D" | "1W" | "1M";

export interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
