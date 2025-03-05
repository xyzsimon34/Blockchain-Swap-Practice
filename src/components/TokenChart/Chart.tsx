"use client";

import { createChart, IChartApi, ColorType } from "lightweight-charts";
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
  const { data, timeframe, setTimeframe, loading } = useChartData(
    tokenAddress,
    chainId
  );

  useEffect(() => {
    if (!chartContainerRef.current || !data?.length) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#1A1A1A" },
        textColor: "#DDD",
        fontSize: 12,
      },
      grid: {
        vertLines: { color: "#2B2B2B" },
        horzLines: { color: "#2B2B2B" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: "#555",
          style: 3,
        },
        horzLine: {
          width: 1,
          color: "#555",
          style: 3,
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#2B2B2B",
      },
      rightPriceScale: {
        borderColor: "#2B2B2B",
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
      },
    });

    // K線圖系列
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      priceFormat: {
        type: "price",
        precision: 6,
        minMove: 0.000001,
      },
    });

    // 成交量系列
    const volumeSeries = chart.addHistogramSeries({
      color: "#385263",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "volume",
    });

    // 設置成交量的價格軸
    chart.priceScale("volume").applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
      borderVisible: false,
    });

    // 處理 K 線數據，確保正確的紅綠顯示
    const processedData = data.map((item, index, arr) => {
      const prevClose = index > 0 ? arr[index - 1].close : item.open;
      return {
        ...item,
        open: prevClose, // 使用前一個收盤價作為開盤價
      };
    });

    // 設置 K 線數據
    candlestickSeries.setData(processedData);

    // 設置成交量數據
    volumeSeries.setData(
      data.map((item, index, arr) => {
        const prevClose = index > 0 ? arr[index - 1].close : item.open;
        const isUp = item.close >= prevClose;

        return {
          time: item.time,
          value: item.volume,
          color: isUp ? "rgba(38, 166, 154, 0.5)" : "rgba(239, 83, 80, 0.5)",
        };
      })
    );

    // 自動調整視圖以適應所有數據
    chart.timeScale().fitContent();

    // 響應式處理
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

  if (loading) {
    return (
      <div className="w-full rounded-lg bg-gray-900 p-4 h-[400px] flex items-center justify-center">
        <div className="text-white">載入中...</div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="w-full rounded-lg bg-gray-900 p-4 h-[400px] flex items-center justify-center">
        <div className="text-gray-400">無可用數據</div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg bg-gray-900 p-4">
      <ChartControls timeframe={timeframe} onTimeframeChange={setTimeframe} />
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
};
