"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EChainType } from "@/constant/enum/chain.types";
import TokenSelector from "@/components/swap/TokenSelector";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

interface SwapDetails {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  exchangeRate: string;
  priceImpact: string;
  networkFee: string;
  minimumReceived: string;
}

interface SwapFormProps {
  sourceChain: EChainType;
  targetChain: EChainType;
  onSwapClick: () => void;
  onSwapDetailsChange: (details: SwapDetails) => void;
  className?: string;
}

export default function SwapForm({
  sourceChain,
  targetChain,
  onSwapClick,
  onSwapDetailsChange,
  className = "",
}: SwapFormProps) {
  const { t } = useTranslation();
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      // Simulate price calculation

      const calculatedToAmount = String(Number(fromAmount) * 1.5);
      setToAmount(calculatedToAmount);

      onSwapDetailsChange({
        fromToken,
        toToken,
        fromAmount,
        toAmount: calculatedToAmount,
        exchangeRate: "1.5",
        priceImpact: "0.5",
        networkFee: "0.001",
        minimumReceived: calculatedToAmount,
      });
    }
  }, [fromAmount, fromToken, toToken]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* From Token Section */}
      <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{t("swap.from")}</span>
          <span className="text-sm text-gray-400">
            {fromToken && `Balance: 0.00 ${fromToken.symbol}`}
          </span>
        </div>
        <div className="flex gap-4">
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="flex-1 bg-transparent text-2xl outline-none"
            placeholder="0.0"
          />
          <TokenSelector
            value={fromToken}
            onChange={setFromToken}
            chainType={sourceChain}
            className="min-w-[120px]"
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <button className="mx-auto flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors">
        <ArrowsUpDownIcon className="w-5 h-5 text-blue-500" />
      </button>

      {/* To Token Section */}
      <div className="bg-gray-800/50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">{t("swap.to")}</span>
          <span className="text-sm text-gray-400">
            {toToken && `Balance: 0.00 ${toToken.symbol}`}
          </span>
        </div>
        <div className="flex gap-4">
          <input
            type="number"
            value={toAmount}
            className="flex-1 bg-transparent text-2xl outline-none"
            placeholder="0.0"
            disabled
          />
          <TokenSelector
            value={toToken}
            onChange={setToToken}
            chainType={targetChain}
            className="min-w-[120px]"
          />
        </div>
      </div>

      {/* Swap Button */}
      <button
        onClick={onSwapClick}
        disabled={!fromAmount || !fromToken || !toToken}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                   text-white font-medium rounded-xl transition-colors"
      >
        {t("swap.swapButton")}
      </button>
    </div>
  );
}
