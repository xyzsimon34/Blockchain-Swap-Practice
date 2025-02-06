"use client";

import { useState } from "react";
import SwapForm from "./SwapForm";
import SwapSettings from "./SwapSettings";
import SwapConfirmation from "./SwapConfirmation";
import ChainSelector from "../ChainSelector";
import { EChainType } from "@/constant/enum/chain.types";
import { useTranslation } from "react-i18next";
import { ArrowsUpDownIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

interface SwapContainerProps {
  className?: string;
}

// 添加 SwapDetails 類型定義
interface SwapDetails {
  fromToken: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
  };
  toToken: {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
  };
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  priceImpact: string;
  networkFee: string;
  minimumReceived: string;
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
  const [swapDetails, setSwapDetails] = useState<SwapDetails>({
    fromToken: {
      address: "",
      symbol: "",
      name: "",
      decimals: 18,
    },
    toToken: {
      address: "",
      symbol: "",
      name: "",
      decimals: 18,
    },
    fromAmount: "0",
    toAmount: "0",
    exchangeRate: "0",
    priceImpact: "0",
    networkFee: "0",
    minimumReceived: "0",
  });

  const handleSwapChains = () => {
    setSourceChain(targetChain);
    setTargetChain(sourceChain);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Main Swap Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-900/70 backdrop-blur-xl border border-white/10">
        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="relative p-4 flex justify-between items-center border-b border-white/10">
          <h2 className="text-lg font-medium text-white">{t("swap.title")}</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Cog6ToothIcon className="h-5 w-5 text-white/70 hover:text-white/90" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Chain Selectors */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">
                  {t("swap.fromChain")}
                </label>
                <ChainSelector
                  value={sourceChain}
                  onChainChange={setSourceChain}
                  className="bg-gray-800/50 border-gray-700/50 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/70">
                  {t("swap.toChain")}
                </label>
                <ChainSelector
                  value={sourceChain}
                  onChainChange={setSourceChain}
                  className="bg-gray-800/50 border-gray-700/50 text-white"
                />
              </div>
            </div>

            {/* Swap Direction Button */}
            <button
              onClick={handleSwapChains}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full
                bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30
                transition-all duration-200 hover:scale-110 group"
            >
              <ArrowsUpDownIcon className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300" />
            </button>
          </div>

          {/* Swap Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl" />
            <div className="relative backdrop-blur-sm rounded-xl">
              <SwapForm
                sourceChain={sourceChain}
                targetChain={targetChain}
                onSwapClick={() => setShowConfirmation(true)}
                onSwapDetailsChange={setSwapDetails}
                className="text-white"
              />
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="rounded-xl bg-gray-800/30 backdrop-blur-sm p-4 border border-white/5">
              <SwapSettings className="text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <SwapConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={() => {
          // 實作交換邏輯
          setShowConfirmation(false);
        }}
        swapDetails={swapDetails}
      />
    </div>
  );
}
