"use client";

import { useState } from "react";
import SwapForm from "./SwapForm";
import SwapSettings from "./SwapSettings";
import SwapHistory from "./SwapHistory";
import SwapConfirmation from "./SwapConfirmation";
import ChainSelector from "../ChainSelector";
import { EChainType } from "@/constant/enum/chain.types";
import { useTranslation } from "react-i18next";
import {
  ArrowsUpDownIcon,
  Cog6ToothIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { SwapDetails, Token } from "@/types/swap.types";
import { WalletConnect } from "@/components/WalletConnect";

interface SwapContainerProps {
  className?: string;
}

export default function SwapContainer({ className }: SwapContainerProps) {
  const { t } = useTranslation();
  const [sourceChain, setSourceChain] = useState<EChainType>(
    EChainType.ETHEREUM
  );
  const [targetChain, setTargetChain] = useState<EChainType>(
    EChainType.BINANCE
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [swapDetails, setSwapDetails] = useState<SwapDetails>({
    fromToken: {
      address: "",
      symbol: "",
      name: "",
      decimals: 18,
      chainId: EChainType.ETHEREUM, // 添加 chainId
    },
    toToken: {
      address: "",
      symbol: "",
      name: "",
      decimals: 18,
      chainId: EChainType.BINANCE, // 添加 chainId
    },
    fromAmount: "0",
    toAmount: "0",
    exchangeRate: "0",
    priceImpact: "0",
    networkFee: "0",
    minimumReceived: "0",
    route: [], // 添加 route 屬性
  });

  const handleSwapChains = () => {
    setSourceChain(targetChain);
    setTargetChain(sourceChain);

    // 更新 token 的 chainId
    setSwapDetails((prev) => ({
      ...prev,
      fromToken: {
        ...prev.fromToken,
        chainId: targetChain,
      },
      toToken: {
        ...prev.toToken,
        chainId: sourceChain,
      },
    }));
  };

  const handleSwapDetailsChange = (newDetails: Partial<SwapDetails>) => {
    setSwapDetails((prev) => ({
      ...prev,
      ...newDetails,
      fromToken: {
        ...prev.fromToken,
        ...(newDetails.fromToken || {}),
        chainId: sourceChain,
      },
      toToken: {
        ...prev.toToken,
        ...(newDetails.toToken || {}),
        chainId: targetChain,
      },
    }));
  };

  return (
    <div className="w-full mx-auto">
      <div className="relative bg-[#1a1f2d] rounded-3xl p-6 border border-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Header */}
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-white">
              {t("swap.title")}
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                title={t("swap.settings")}
              >
                <Cog6ToothIcon className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
              </button>
              <div className="h-5 w-[1px] bg-white/10" />
              {/* 移除外層的 button，直接使用 div */}
              <div className="text-white/70 hover:text-white transition-colors">
                <WalletConnect />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ClockIcon className="h-4 w-4" />
              {t("swap.history")}
            </button>
          </div>
        </div>

        <SwapHistory
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Chain Selectors */}
          <div className="relative">
            <div className="flex justify-between items-start gap-8">
              <div className="flex-1 space-y-2 max-w-[240px]">
                <label className="block text-sm font-medium text-white/70">
                  {t("swap.fromChain")}
                </label>
                <ChainSelector
                  value={sourceChain}
                  onChainChange={setSourceChain}
                  className="w-full"
                />
              </div>
              <div className="flex-1 space-y-2 max-w-[240px]">
                <label className="block text-sm font-medium text-white/70">
                  {t("swap.toChain")}
                </label>
                <ChainSelector
                  value={targetChain}
                  onChainChange={setTargetChain}
                  className="w-full"
                />
              </div>
            </div>

            <button
              onClick={handleSwapChains}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
             p-3 rounded-full
             bg-[#2d2f3d] hover:bg-[#363847]
             border border-[#4b6af5]/20 
             transition-all duration-200 hover:scale-110 group
             shadow-lg shadow-black/20"
            >
              <ArrowsUpDownIcon className="h-5 w-5 text-[#4b6af5] group-hover:text-[#5d79ff] group-hover:rotate-180 transition-transform duration-200" />
            </button>
          </div>

          {/* Swap Form */}
          <SwapForm
            sourceChain={sourceChain}
            targetChain={targetChain}
            onSwapClick={() => setShowConfirmation(true)}
            onSwapDetailsChange={handleSwapDetailsChange}
          />

          {/* Settings Panel */}
          {showSettings && (
            <div className="rounded-xl bg-gray-800/30 backdrop-blur-sm p-4 border border-white/5">
              <SwapSettings />
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <SwapConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          setShowConfirmation(false);
        }}
        swapDetails={swapDetails}
      />
    </div>
  );
}
