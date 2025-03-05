import { useState, useEffect } from "react";
import { Time } from "lightweight-charts";
import { toast } from "react-toastify";

interface ChartData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeFrame = "1H" | "1D" | "1W" | "1M";

const timeframeToParams = {
  "1H": { days: 1, interval: "minutes" },
  "1D": { days: 7, interval: "hours" },
  "1W": { days: 30, interval: "daily" },
  "1M": { days: 90, interval: "daily" },
};

const COINGECKO_API = "https://api.coingecko.com/api/v3";

export const useChartData = (tokenAddress: string, chainId: number) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [timeframe, setTimeframe] = useState<TimeFrame>("1D");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const { days } = timeframeToParams[timeframe];
        const networkId = getNetworkId(chainId);

        const response = await fetch(
          `${COINGECKO_API}/coins/${networkId}/contract/${tokenAddress}/market_chart?vs_currency=usd&days=${days}`
        );

        if (!response.ok) {
          throw new Error(`API 請求失敗: ${response.status}`);
        }

        const marketData = await response.json();
        const prices = marketData.prices || [];
        const volumes = marketData.total_volumes || [];

        if (prices.length < 2) {
          throw new Error("數據點不足");
        }

        const interval = getIntervalInSeconds(timeframe);
        let currentGroup: number[][] = [];
        let currentTimestamp =
          Math.floor(prices[0][0] / (interval * 1000)) * (interval * 1000);
        const chartData: ChartData[] = [];

        prices.forEach((price: number[], index: number) => {
          const [timestamp, value] = price;
          const volume = volumes[index] ? volumes[index][1] : 0;

          if (
            timestamp >= currentTimestamp &&
            timestamp < currentTimestamp + interval * 1000
          ) {
            currentGroup.push([timestamp, value, volume]);
          } else {
            if (currentGroup.length > 0) {
              const groupData = processGroupData(currentGroup);
              chartData.push({
                time: (currentTimestamp / 1000) as Time,
                ...groupData,
              });
            }
            currentTimestamp =
              Math.floor(timestamp / (interval * 1000)) * (interval * 1000);
            currentGroup = [[timestamp, value, volume]];
          }
        });

        if (currentGroup.length > 0) {
          const groupData = processGroupData(currentGroup);
          chartData.push({
            time: (currentTimestamp / 1000) as Time,
            ...groupData,
          });
        }

        setData(chartData);
      } catch (err) {
        console.error("數據獲取錯誤:", err);
        const errorMessage =
          err instanceof Error ? err.message : "數據獲取失敗";

        // 使用 toastify 顯示錯誤
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        setData([]); // 清空數據
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tokenAddress, chainId, timeframe]);

  return { data, timeframe, setTimeframe, loading };
};

// 輔助函數：處理分組數據
function processGroupData(group: number[][]): Omit<ChartData, "time"> {
  const prices = group.map((item) => item[1]);
  const volume = group.reduce((sum, item) => sum + (item[2] || 0), 0);

  return {
    open: prices[0],
    high: Math.max(...prices),
    low: Math.min(...prices),
    close: prices[prices.length - 1],
    volume,
  };
}

// 輔助函數：獲取時間間隔（秒）
function getIntervalInSeconds(timeframe: TimeFrame): number {
  switch (timeframe) {
    case "1H":
      return 60; // 1分鐘
    case "1D":
      return 3600; // 1小時
    case "1W":
      return 86400; // 1天
    case "1M":
      return 86400; // 1天
    default:
      return 3600;
  }
}
function getNetworkId(chainId: number): string {
  switch (chainId) {
    case 1:
      return "ethereum";
    case 56:
      return "binance-smart-chain";
    case 137:
      return "polygon-pos";
    case 42161:
      return "arbitrum-one";
    case 10:
      return "optimistic-ethereum";
    default:
      return "ethereum";
  }
}
