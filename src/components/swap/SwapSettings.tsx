"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SwapSettingsProps {
  className?: string;
}

export default function SwapSettings({ className }: SwapSettingsProps) {
  const { t } = useTranslation();
  const [slippage, setSlippage] = useState("0.5");
  const [deadline, setDeadline] = useState("20");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t("swap.settings")}</h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          {t("swap.slippage")}
        </label>
        <input
          type="number"
          value={slippage}
          onChange={(e) => setSlippage(e.target.value)}
          className="w-full p-2 border rounded"
          min="0.1"
          max="5"
          step="0.1"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">
          {t("swap.deadline")}
        </label>
        <input
          type="number"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 border rounded"
          min="1"
          max="60"
          step="1"
        />
      </div>
    </div>
  );
}
