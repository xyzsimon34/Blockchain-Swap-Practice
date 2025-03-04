import { useState, useEffect } from "react";
import { Time } from "lightweight-charts";

interface ChartData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeFrame = "1H" | "1D" | "1W" | "1M";

export const useChartData = (tokenAddress: string, chainId: number) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [timeframe, setTimeframe] = useState<TimeFrame>("1D");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 使用模擬數據進行測試
        const mockData: ChartData[] = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (30 - i));

          return {
            time: (date.getTime() / 1000) as Time,
            open: 100 + Math.random() * 10,
            high: 110 + Math.random() * 10,
            low: 90 + Math.random() * 10,
            close: 105 + Math.random() * 10,
            volume: 1000000 + Math.random() * 1000000,
          };
        });

        setData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tokenAddress, chainId, timeframe]);

  return { data, timeframe, setTimeframe, loading, error };
};
