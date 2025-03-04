"use client";

import { createChart, IChartApi } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { useChartData } from "./hooks/useChartData";
import { ChartControls } from "./ChartControls";

interface TokenChartProps {
  tokenAddress: string;
  chainId: number;
}

export const TokenChart = ({ tokenAddress, chainId }: TokenChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const { data, timeframe, setTimeframe, loading, error } = useChartData(
    tokenAddress,
    chainId
  );

  useEffect(() => {
    if (!chartContainerRef.current || !data?.length) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "#1A1A1A" },
        textColor: "#DDD",
      },
      grid: {
        vertLines: { color: "#2B2B2B" },
        horzLines: { color: "#2B2B2B" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    candlestickSeries.setData(data);

    // 添加成交量圖表
    const volumeSeries = chart.addHistogramSeries({
      color: "#385263",
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    volumeSeries.setData(
      data.map((item) => ({
        time: item.time,
        value: item.volume,
        color: item.close > item.open ? "#26a69a" : "#ef5350",
      }))
    );

    chartRef.current = chart;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  if (loading) return <div className="text-center py-8">載入中...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="w-full rounded-lg bg-gray-900 p-4">
      <ChartControls timeframe={timeframe} onTimeframeChange={setTimeframe} />
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
};
