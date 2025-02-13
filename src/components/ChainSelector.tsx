"use client";

import React, { Fragment, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { EChainType } from "@/constant/enum/chain.types";
import { useQuery } from "@tanstack/react-query";
import { SiEthereum, SiBinance, SiPolygon } from "react-icons/si";
import { TbBrandTorchain } from "react-icons/tb";
import { IconType } from "react-icons";
import {
  ChainApiResponse,
  useChainApi,
  createFallbackResponse,
} from "@/contexts/api/ChainApiContext";
import { toast } from "react-toastify";

// Types
interface ChainSelectorProps {
  value: EChainType;
  onChainChange: (chain: EChainType) => void;
  className?: string;
  disabled?: boolean;
}

interface ChainData {
  chainType: EChainType;
  name: string;
  currencySymbol: string;
  chainId: string;
  blockExplorerUrl: string;
  rpcUrl: string;
}

// Constants
const chainIcons: Record<EChainType, IconType> = {
  [EChainType.ETHEREUM]: SiEthereum,
  [EChainType.BINANCE]: SiBinance,
  [EChainType.TRON]: TbBrandTorchain,
  [EChainType.POLYGON]: SiPolygon,
  [EChainType.POLYGON_ZKEVM]: SiPolygon,
};

export default function ChainSelector({
  value,
  onChainChange,
  className = "",
  disabled = false,
}: ChainSelectorProps) {
  const { t } = useTranslation("common");
  const { getChains } = useChainApi();

  // 獲取鏈數據
  const {
    data: chainsResponse,
    isLoading,
    error,
  } = useQuery<ChainApiResponse>({
    queryKey: ["chains"],
    queryFn: getChains,
    initialData: createFallbackResponse("初始化使用備用數據"),
    staleTime: 300000,
  });

  // 處理鏈數據
  const chains = useMemo(
    () =>
      chainsResponse.data
        ? Object.values(chainsResponse.data).map(
            ({
              chainType,
              name,
              currencySymbol,
              chainId,
              blockExplorerUrl,
              rpcUrl,
            }) => ({
              chainType: chainType as EChainType,
              name,
              currencySymbol,
              chainId,
              blockExplorerUrl,
              rpcUrl,
            })
          )
        : [],
    [chainsResponse.data]
  );

  // 加載狀態
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="h-10 bg-gray-800/50 animate-pulse rounded-lg" />
      </div>
    );
  }

  // 錯誤處理
  if (error) {
    console.error("Error fetching chains:", error);
    toast.error(t("errors.chainLoadFailed"));
    return null;
  }

  // 獲取當前選中的鏈數據
  const selectedChain = chains.find((chain) => chain.chainType === value);
  const SelectedIcon = chainIcons[value] || SiEthereum;

  return (
    <div className={className}>
      <Listbox value={value} onChange={onChainChange} disabled={disabled}>
        <div className="relative">
          {/* 選擇器按鈕 */}
          <ListboxButton className="relative w-auto h-16 cursor-pointer rounded-xl bg-gray-800/50 py-3 pl-4 pr-10 text-left border border-white/10 hover:border-indigo-500/50 hover:bg-gray-800/70 focus:outline-none transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg">
            <div className="grid grid-cols-[auto,1fr,auto] items-center h-full gap-3">
              {/* Icon with hover effect */}
              <SelectedIcon className="h-6 w-6 text-white/70 flex-shrink-0 transition-transform duration-200 hover:scale-110" />

              {/* Text Content */}
              <div className="flex flex-col justify-center min-w-0">
                {/* Chain Name */}
                <span className="text-white font-medium truncate">
                  {selectedChain?.name || t("common.selectChain")}
                </span>

                {/* Currency Symbol */}
                <span className="text-sm text-white/50 truncate">
                  {selectedChain?.currencySymbol}
                </span>
              </div>

              {/* Chevron Icon with rotation effect */}
              <ChevronUpDownIcon className="h-5 w-5 text-white/50 flex-shrink-0 transition-transform duration-200 hover:rotate-180" />
            </div>
          </ListboxButton>

          {/* 下拉選單 */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-10 w-full mt-2 max-h-60 overflow-auto bg-gray-900/95 backdrop-blur-sm py-2 text-base shadow-lg ring-1 ring-black/5 border border-white/10 rounded-xl">
              {chains.map((chain) => {
                const Icon = chainIcons[chain.chainType] || SiEthereum;
                return (
                  <ListboxOption
                    key={chain.chainId || chain.chainType}
                    value={chain.chainType}
                    className={({ active }) =>
                      `cursor-pointer select-none py-3 pl-10 pr-4 ${
                        active ? "bg-indigo-500/20 text-white" : "text-gray-300"
                      }`
                    }
                  >
                    {({ selected }) => (
                      <div className="flex items-center">
                        <Icon className="h-6 w-6 mr-3 text-gray-400" />
                        <div>
                          <span
                            className={`${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {chain.name}
                          </span>
                          <span className="text-sm text-gray-400 block">
                            {chain.currencySymbol}
                          </span>
                        </div>
                        {selected && (
                          <CheckIcon className="absolute left-3 h-5 w-5 text-indigo-400" />
                        )}
                        {chain.chainId && (
                          <span className="absolute right-3 text-xs text-gray-500">
                            Chain ID: {chain.chainId}
                          </span>
                        )}
                      </div>
                    )}
                  </ListboxOption>
                );
              })}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>

      {/* 區塊鏈瀏覽器連結 */}
      {selectedChain?.blockExplorerUrl && (
        <div className="mt-2 text-sm">
          <a
            href={selectedChain.blockExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
          >
            <span>{t("home.viewExplorer")}</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
