"use client";

import { useState } from "react";
import ChainSelector from "@/components/ChainSelector";
import { EChainType } from "@/constant/enum/chain.types";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

export default function ChainSelectors() {
  const { t } = useTranslation();
  const [sourceChain, setSourceChain] = useState<EChainType>(
    EChainType.ETHEREUM
  );
  const [targetChain, setTargetChain] = useState<EChainType>(
    EChainType.ETHEREUM
  );

  const handleSwapChains = () => {
    const temp = sourceChain;
    setSourceChain(targetChain);
    setTargetChain(temp);
  };

  return (
    <div className="relative">
      {/* 背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-indigo-500/5 rounded-xl" />

      <div className="relative backdrop-blur-sm p-6 rounded-xl border border-white/10">
        {/* Chain Selectors Grid */}
        <div className="grid grid-cols-2 gap-8 relative">
          {/* From Chain */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white/70 uppercase tracking-wider">
              {t("swap.fromChain")}
            </label>
            <ChainSelector
              value={sourceChain}
              onChainChange={setSourceChain}
              className="w-full transform transition-all duration-200 hover:scale-[1.02]"
            />
          </div>

          {/* To Chain */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white/70 uppercase tracking-wider">
              {t("swap.toChain")}
            </label>
            <ChainSelector
              value={targetChain}
              onChainChange={setTargetChain}
              className="w-full transform transition-all duration-200 hover:scale-[1.02]"
            />
          </div>

          {/* Swap Direction Button */}
          <button
            onClick={handleSwapChains}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                     p-3 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 
                     border border-indigo-500/20 transition-all duration-300 
                     hover:scale-110 group z-10"
          >
            <ArrowsRightLeftIcon
              className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300 
                                          transition-colors duration-300"
            />
          </button>
        </div>

        {/* Network Info */}
        <div className="mt-6 grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="text-xs text-white/50">Network Status</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-white/70">Connected</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-white/50">Gas Price</div>
            <div className="text-sm text-white/70">~20 Gwei</div>
          </div>
        </div>
      </div>
    </div>
  );
}
