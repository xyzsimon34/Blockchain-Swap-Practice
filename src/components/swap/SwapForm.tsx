"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { EChainType } from "@/constant/enum/chain.types";
import TokenSelector from "@/components/swap/TokenSelector";

interface SwapFormProps {
  sourceChain: EChainType;
  targetChain: EChainType;
  onSwapClick: () => void;
  onSwapDetailsChange: (details: any) => void;
  className?: string;
}

export default function SwapForm({
  sourceChain,
  targetChain,
  onSwapClick,
  onSwapDetailsChange,
}: SwapFormProps) {
  const { t } = useTranslation();
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [fromToken, setFromToken] = useState<any>(null);
  const [toToken, setToToken] = useState<any>(null);

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      // 更新交換詳情
      onSwapDetailsChange({
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        exchangeRate: "1",
        priceImpact: "0.5",
        networkFee: "0.001",
        minimumReceived: toAmount,
      });
    }
  }, [fromAmount, toAmount, fromToken, toToken]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <TokenSelector
          label={t("swap.from")}
          value={fromToken}
          onChange={setFromToken}
          chainType={sourceChain}
        />
        <input
          type="number"
          value={fromAmount}
          onChange={(e) => setFromAmount(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="0.0"
        />
      </div>

      <div className="space-y-2">
        <TokenSelector
          label={t("swap.to")}
          value={toToken}
          onChange={setToToken}
          chainType={targetChain}
        />
        <input
          type="number"
          value={toAmount}
          onChange={(e) => setToAmount(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="0.0"
          disabled
        />
      </div>

      <button
        onClick={onSwapClick}
        disabled={!fromAmount || !fromToken || !toToken}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {t("swap.swapButton")}
      </button>
    </div>
  );
}
