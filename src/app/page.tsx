"use client";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ChainSelector from "@/components/ChainSelector";
import { WalletConnect } from "@/components/WalletConnect";
import { EChainType, ETronType } from "@/constant/enum/chain.types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create QueryClient
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

// **Main Page Content**
function HomeContent() {
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // **Callback when selecting a chain**
  const handleChainSelect = useCallback(
    (chain: EChainType) => {
      if (chain === EChainType.TRON) {
        console.log(`${t("home.chainSelect.tronMainnet")}:`, ETronType.Mainnet);
      }
    },
    [t]
  );

  if (!mounted) {
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
        {/* Background glow effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
        </div>

        {/* Main content card */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gray-900/70 p-6 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />

          {/* Content area */}
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-white">
                {t("home.title")}
              </h1>

              <div className="flex items-center gap-4">
                <div className="rounded-full bg-purple-600 px-4 py-1 text-sm font-medium text-white">
                  Testnet
                </div>
                <WalletConnect />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                {/* ✅ Chain Selector */}
                <ChainSelector onChainChange={handleChainSelect} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// **Main Page Component**
export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <HomeContent />
    </QueryClientProvider>
  );
}
