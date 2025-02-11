// src/components/swap/SwapForm.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { EChainType } from "@/constant/enum/chain.types";
import TokenSelector from "@/components/swap/TokenSelector";
import { ArrowsUpDownIcon } from "@heroicons/react/24/outline";
import debounce from "lodash/debounce";
import { PriceService } from "@/services/price.service";
import { Token, SwapQuote } from "@/types/swap.types";

interface SwapFormProps {
  sourceChain: EChainType;
  targetChain: EChainType;
  onSwapClick: () => void;
  onSwapDetailsChange: (quote: SwapQuote) => void;
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
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 使用 debounce 避免頻繁計算
  const debouncedCalculate = useCallback(
    debounce(async (amount: string) => {
      if (!fromToken || !toToken || !amount || parseFloat(amount) <= 0) {
        setToAmount("");
        setError(null);
        return;
      }

      try {
        setIsCalculating(true);
        setError(null);

        const priceInfo = await PriceService.getPrice(
          fromToken,
          toToken,
          amount,
          sourceChain,
          targetChain
        );

        setToAmount(
          (parseFloat(amount) * parseFloat(priceInfo.price)).toFixed(6)
        );

        const quote: SwapQuote = {
          fromToken,
          toToken,
          fromAmount: amount,
          toAmount: priceInfo.minimumReceived,
          exchangeRate: priceInfo.price,
          priceImpact: priceInfo.priceImpact,
          networkFee: priceInfo.networkFee,
          minimumReceived: priceInfo.minimumReceived,
          route: priceInfo.route,
          estimatedGas: "0.001", // TODO: 實際 gas 估算
          validTo: Math.floor(Date.now() / 1000) + 3600, // 1小時有效期
        };

        onSwapDetailsChange(quote);
      } catch (error) {
        console.error("Price calculation error:", error);
        setError(t("swap.priceCalculationError"));
        setToAmount("");
      } finally {
        setIsCalculating(false);
      }
    }, 500),
    [fromToken, toToken, sourceChain, targetChain, onSwapDetailsChange, t]
  );

  // 當輸入值改變時觸發計算
  useEffect(() => {
    if (fromAmount) {
      debouncedCalculate(fromAmount);
    } else {
      setToAmount("");
      setError(null);
    }
  }, [fromAmount, debouncedCalculate]);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const handleSwapTokens = () => {
    if (fromToken && toToken) {
      setFromToken(toToken);
      setToToken(fromToken);
      setFromAmount(toAmount);
      setToAmount(fromAmount);
      // 觸發重新計算
      if (toAmount) {
        debouncedCalculate(toAmount);
      }
    }
  };

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
            type="text"
            value={fromAmount}
            onChange={handleFromAmountChange}
            className="flex-1 bg-transparent text-2xl outline-none text-white 
                     placeholder-gray-500 focus:ring-1 focus:ring-indigo-500/30 
                     rounded-lg transition-all"
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
      <div className="flex justify-center">
        <button
          onClick={handleSwapTokens}
          className="p-2 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 
                   transition-all duration-200 hover:scale-105 group"
        >
          <ArrowsUpDownIcon className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
        </button>
      </div>

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
            type="text"
            value={toAmount}
            className="flex-1 bg-transparent text-2xl outline-none text-white 
                     placeholder-gray-500 cursor-not-allowed"
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

      {/* Error Message */}
      {error && <div className="text-sm text-red-500 text-center">{error}</div>}

      {/* Loading Indicator */}
      {isCalculating && (
        <div className="text-sm text-gray-400 text-center animate-pulse">
          {t("swap.calculatingPrice")}
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={onSwapClick}
        disabled={
          !fromAmount || !fromToken || !toToken || isCalculating || !!error
        }
        className="w-full py-4 bg-blue-600 hover:bg-blue-700
                 text-white font-medium rounded-xl transition-all
                 disabled:bg-gray-600 disabled:cursor-not-allowed
                 hover:scale-[1.02] active:scale-[0.98]"
      >
        {isCalculating
          ? t("swap.calculating")
          : !fromToken || !toToken
          ? t("swap.selectToken")
          : !fromAmount
          ? t("swap.enterAmount")
          : error
          ? t("swap.retry")
          : t("swap.swapButton")}
      </button>
    </div>
  );
}
