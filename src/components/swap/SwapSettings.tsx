"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SwapSettingsProps {
  className?: string;
}

export default function SwapSettings({ className = "" }: SwapSettingsProps) {
  const { t } = useTranslation();
  const [slippage, setSlippage] = useState("0.5");
  const [deadline, setDeadline] = useState("20");

  const slippagePresets = ["0.1", "0.5", "1.0"];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-3">
        <label className="block text-sm text-gray-400">
          {t("swap.slippage")}
        </label>
        <div className="flex gap-2">
          {slippagePresets.map((preset) => (
            <button
              key={preset}
              onClick={() => setSlippage(preset)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors
              ${
                slippage === preset
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {preset}%
            </button>
          ))}
          <div className="flex-1">
            <input
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="w-full px-3 py-1 bg-gray-800 rounded-lg text-right text-sm"
              min="0.1"
              max="5"
              step="0.1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm text-gray-400">
          {t("swap.deadline")}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="flex-1 px-3 py-1 bg-gray-800 rounded-lg text-right text-sm"
            min="1"
            max="60"
            step="1"
          />
          <span className="text-sm text-gray-400">分鐘</span>
        </div>
      </div>
    </div>
  );
}
