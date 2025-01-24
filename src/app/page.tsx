"use client";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ChainSelector from "@/components/ChainSelector";
import { EChainType, ETronType } from "@/constant/enum/chain.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 創建 QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function HomeContent() {
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false); // 清理函數
  }, []);

  // 使用 useCallback
  const handleChainSelect = useCallback(
    (chain: EChainType) => {
      if (chain === EChainType.TRON) {
        console.log(`${t("home.chainSelect.tronMainnet")}:`, ETronType.Mainnet);
      }
    },
    [t]
  );

  if (!mounted) {
    // 返回一個加載佔位符而不是 null
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black">
        <Navbar />
        <div className="relative max-w-xl mx-auto mt-20 px-4">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gray-900/70 p-6 backdrop-blur-xl">
            <div className="animate-pulse h-10 bg-gray-700 rounded" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-black">
      <Navbar />

      <div className="relative max-w-xl mx-auto mt-32 px-4 pb-32">
        {/* 背景光暈效果 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
        </div>

        {/* 主要內容卡片 */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gray-900/70 p-6 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />

          {/* 內容區域 */}
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">
                {t("home.title")}
              </h1>

              <div className="rounded-full bg-purple-600 px-4 py-1 text-sm font-medium text-white">
                Testnet
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <ChainSelector onChainChange={handleChainSelect} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// 主頁面組件
export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeContent />
    </QueryClientProvider>
  );
}
