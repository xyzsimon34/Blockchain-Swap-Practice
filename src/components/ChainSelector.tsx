"use client";

import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Listbox,
  ListboxOptions,
  ListboxOption,
  ListboxButton,
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
  IChainResponse,
  fallbackChains,
  useChainApi,
  createFallbackResponse,
} from "@/contexts/api/ChainApiContext";
import { toast } from "react-toastify";

// Types
interface ChainSelectorProps {
  onChainChange?: (chain: EChainType) => void;
}

interface ChainData {
  chainType: EChainType;
  name: string;
  currencySymbol: string;
  chainId: string;
  blockExplorerUrl: string;
  rpcUrl: string;
}

interface ChainSelectorContentProps {
  selectedChain: EChainType;
  handleChainChange: (chain: EChainType) => void;
  chains: ChainData[];
  t: (key: string) => string;
}

// Constants
const chainIcons: Record<EChainType, IconType> = {
  [EChainType.ETHEREUM]: SiEthereum,
  [EChainType.BINANCE]: SiBinance,
  [EChainType.TRON]: TbBrandTorchain,
  [EChainType.POLYGON]: SiPolygon,
  [EChainType.POLYGON_ZKEVM]: SiPolygon,
};

// Components
function ChainSelectorContent({
  selectedChain,
  handleChainChange,
  chains,
  t,
}: ChainSelectorContentProps) {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedChainData = chains.find(
    (chain) => chain.chainType === selectedChain
  );

  return (
    <div className="w-73 h-80">
      {/* 添加測試按鈕 */}
      <button
        onClick={() => {
          toast.success("成功提示測試");
          toast.error("錯誤提示測試");
          toast.warning("警告提示測試");
          toast.info("信息提示測試");
        }}
        className="mb-2 px-4 py-2 bg-purple-800 rounded-lg text-sm"
      >
        測試 Toast
      </button>
      <Listbox
        value={selectedChain}
        onChange={(value) => {
          handleChainChange(value);
          setIsOpen(false);
        }}
      >
        <div className="relative mt-1">
          <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 shadow-sm">
            <span className="flex items-center">
              {React.createElement(chainIcons[selectedChain] || SiEthereum, {
                className: "h-6 w-6 mr-2 text-gray-600",
              })}
              <span className="block truncate">{selectedChainData?.name}</span>
              <span className="ml-2 text-sm text-gray-500">
                ({selectedChainData?.currencySymbol})
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute z-[100] w-full mt-1 max-h-60 overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
              {chains.map((chain) => (
                <ListboxOption
                  key={chain.chainType}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-indigo-100 text-indigo-900" : "text-gray-900"
                    }`
                  }
                  value={chain.chainType}
                >
                  {({ selected, active }) => (
                    <>
                      <span className="flex items-center">
                        {React.createElement(
                          chainIcons[chain.chainType] || SiEthereum,
                          {
                            className: `h-6 w-6 mr-2 ${
                              active ? "text-indigo-600" : "text-gray-600"
                            }`,
                          }
                        )}
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {chain.name}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({chain.currencySymbol})
                        </span>
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                      {chain.chainId && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400">
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

      {isClient && selectedChainData?.blockExplorerUrl && (
        <div className="mt-2 text-sm text-gray-500">
          <a
            href={selectedChainData.blockExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800"
          >
            {t("home.viewExplorer")}
          </a>
        </div>
      )}
    </div>
  );
}

// Main Component
export default function ChainSelector({ onChainChange }: ChainSelectorProps) {
  const { t } = useTranslation("common");
  const { getChains } = useChainApi();
  const [selectedChain, setSelectedChain] = useState<EChainType>(
    EChainType.ETHEREUM
  );

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

  const chains = useMemo(() => {
    return chainsResponse.data
      ? Object.values(chainsResponse.data).map((chainData) => ({
          chainType: chainData.chainType as EChainType,
          name: chainData.name,
          currencySymbol: chainData.currencySymbol,
          chainId: chainData.chainId,
          blockExplorerUrl: chainData.blockExplorerUrl,
          rpcUrl: chainData.rpcUrl,
        }))
      : fallbackChains; // 如果仍然為空，返回備用數據
  }, [chainsResponse]);

  const handleChainChange = (chain: EChainType) => {
    setSelectedChain(chain);
    onChainChange?.(chain);
  };

  if (isLoading) {
    return (
      <div className="w-72">
        <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    console.error("Error fetching chains:", error);
    toast.error(`Failed to load chains: ${error.message || "Unknown error"}`);
    return <div>Error loading chains. Please try again.</div>;
  }

  return (
    <ChainSelectorContent
      selectedChain={selectedChain}
      handleChainChange={handleChainChange}
      chains={chains}
      t={t}
    />
  );
}
