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
    staleTime: 5 * 60 * 1000,
  });

  // 處理鏈數據
  const chains = useMemo(() => {
    if (!chainsResponse.data) return [];
    return Object.values(chainsResponse.data).map((chainData) => ({
      chainType: chainData.chainType as EChainType,
      name: chainData.name,
      currencySymbol: chainData.currencySymbol,
      chainId: chainData.chainId,
      blockExplorerUrl: chainData.blockExplorerUrl,
      rpcUrl: chainData.rpcUrl,
    }));
  }, [chainsResponse.data]);

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

  return (
    <div className={className}>
      <Listbox value={value} onChange={onChainChange} disabled={disabled}>
        <div className="relative">
          {/* 選擇器按鈕 */}
          <ListboxButton
            className="relative w-full cursor-pointer rounded-xl 
            bg-gray-800/50 py-3 pl-4 pr-10 group
            text-left border border-white/10 
            hover:border-indigo-500/50 hover:bg-gray-800/70
            focus:outline-none focus-visible:border-indigo-500 
            focus-visible:ring-2 focus-visible:ring-white/75 
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center">
              {React.createElement(chainIcons[value] || SiEthereum, {
                className:
                  "h-6 w-6 mr-3 text-white/70 group-hover:text-indigo-400 transition-colors",
              })}
              <div className="flex flex-col">
                <span className="block text-white font-medium">
                  {selectedChain?.name}
                </span>
                <span className="text-sm text-white/50">
                  {selectedChain?.currencySymbol}
                </span>
              </div>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon className="h-5 w-5 text-white/50 group-hover:text-indigo-400 transition-colors" />
            </span>
          </ListboxButton>

          {/* 下拉選項 */}
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute z-[100] w-full mt-2 max-h-60 overflow-auto 
              rounded-xl bg-gray-900/95 backdrop-blur-sm py-2 
              text-base shadow-lg ring-1 ring-black/5 focus:outline-none
              border border-white/10"
            >
              {chains.map((chain) => (
                <ListboxOption
                  key={chain.chainType}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-3 pl-10 pr-4
                    ${active ? "bg-indigo-500/20 text-white" : "text-gray-300"}
                    transition-colors duration-150`
                  }
                  value={chain.chainType}
                >
                  {({ selected, active }) => (
                    <>
                      <span className="flex items-center">
                        {React.createElement(
                          chainIcons[chain.chainType] || SiEthereum,
                          {
                            className: `h-6 w-6 mr-3 ${
                              active ? "text-indigo-400" : "text-gray-400"
                            }`,
                          }
                        )}
                        <div className="flex flex-col">
                          <span
                            className={`block ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {chain.name}
                          </span>
                          <span className="text-sm text-gray-400">
                            {chain.currencySymbol}
                          </span>
                        </div>
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-400">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                      {chain.chainId && (
                        <span
                          className="absolute inset-y-0 right-0 flex items-center pr-3 
                          text-xs text-gray-500"
                        >
                          Chain ID: {chain.chainId}
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
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
            className="text-indigo-400 hover:text-indigo-300 transition-colors
                     flex items-center space-x-1"
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
